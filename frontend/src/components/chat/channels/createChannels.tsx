import React, { useEffect, useState } from 'react'
import { userProps } from '@/interface/data'
import { disconnect } from 'process';
import AddPeople from './addPeople';

const CreateChannels = ({ users, setClick }: { users: userProps[], setClick: (value: string) => void }) => {

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [password, setPassword] = useState('');
  const [Type, setType] = useState('public');
  const [add, setAdd] = useState(false)
  const [people, setPeople] = useState<number[]>([])
  const [select, setSelect] = useState(false)
  const [good, setGood] = useState(0)


  const handleClick = async () => {
    if (name && description && Type && (Type != 'protected' || (Type == 'protected' && password))) {
      users.map((item: userProps) => {
        item.flag = false
      })
      await fetch(`http://localhost:3333/chat/createChannel`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "name": name,
          "type": Type,
          "description": description,
          "password": password,
          "people": people
        }),
        credentials: 'include',
      });
      setGood(2)
      setClick('')
    }
    else
      setGood(1)
  };

  useEffect(() => {
    setPeople([])
    users.map((item: userProps) => {
      if (item.flag)
        setPeople(prevPeople => [...prevPeople, item.id]);
    })
  }, [select, add])

  const handlSelect = (item: userProps[], s: boolean, index: number) => {
    item[index].flag = s
    if (select == true)
      setSelect(false)
    else
      setSelect(true)
  }

  return (
    <div className="w-full h-full">

      {
        !add ? (
          <div className=" flex  flex-col  h-full w-full">
            <div className='flex flex-col justify-cenfter items-centefr'>
              <div className="flex flex-col justify-center items-center p-6 w-full bg-sjlate-400">
                <h2 className='flex ml- w-full '> Channel Name</h2>
                <input maxLength={12} placeholder="Enter up to 12 characters" className='focus:outline-none  flex items-center justify-center mt-2 pl-4 w-full h-10 border border-sky-200 text-CuisColor_dark_grey' type="text" name='Enter channel name' value={name} onChange={(e) => setName(e.target.value)} />
                {(good == 1 && !name) && <p className=' text-red-500'>Enter Name</p>}
                <h2 className='flex mt-4 w-full'> Description</h2>
                <textarea rows={3} maxLength={80} placeholder="Enter up to 80 characters" className='focus:outline-none max-h-24  flex items-start justify-center mt-2 pl-4 w-full h-24 border  border-sky-200 text-CuisColor_dark_grey' required value={description} onChange={(e) => setDescription(e.target.value)} />
                {(good == 1 && !description) && <p className=' text-red-500'>Enter Description</p>}

              </div>
              <div className=' w-full h-[1px] bg-sky-200' />
              <div className='bg-grajy-400 p-4 '>

                <h2 className='flex  w-full justify-center'> Type</h2>
                <div className=" flex  justify-center">
                  <select className={`focus:outline-none ${Type == 'public' && ' bg-green-200'}  ${Type == 'private' && ' bg-red-200'}  ${Type == 'protected' && ' bg-yellow-200'}  border border-sky-400 p-2 mt-2 w-[40%] rounded-full shadow-xl`} onChange={(e) => setType(e.target.value)}>
                    <option className='  bg-green-200' value="public">Public</option>
                    <option className=' bg-yellow-200' value="protected">Protected</option>
                    <option className=' bg-red-200 text-md font-mono' value="private">Private</option>
                  </select>
                </div>
              </div>
              {Type == 'protected' && <div className='flex flex-col justify-center items-center h-24 w-full bg-sflate-400'>
                <h2 className='flex ml-12 w-full'>Password</h2>
                <input maxLength={15} placeholder="Enter up to 15 characters" className='focus:outline-none   flex items-center justify-center mt-2 pl-4 w-[90%] h-10 border  bg-blafck  text-CuisColor_dark_grey' required type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                {(good == 1 && !password) && <p className=' text-red-500'>Enter Password</p>}
              </div>}
              {Type == 'private' && <div className=" bg-stofne-600 flex flex-col justify-center items-center">
                <h2 className="w-full ml-20 text-lg">Add People</h2>
                <div className='overflow-y-scroll bg-blfack bg-blafck scrollbar-hide flex bg-gdray-600 flex-row justify-start items-center flex-wrap gridx grid-cols-2x grid-flolw-colx  h-28   w-[90%] bg-slatef-400 mt-2  space-fx-0 spacfe-y-0 gap-1 bg-slatfe-700'>
                  {users.map((item, index) => (
                    <div className=' bg-ambder-500 bord,fer border-sfky-900 rounded-md  w-auto b-black'>
                      {
                        item.flag &&
                        <div className='flex  justify-center items-center   border border-sky-400 bg-sky-200 rounded-md  min-w-32f w-aufto space-x-2  h-10 p-2' key={index}>
                          <div className="w-5 bg- h-5">
                            <img className="w-5 h-5 rounded-full" src={item.foto_user} />
                          </div>
                          <h1 className='h-6 w-auto text-sm'>{item.username}</h1>
                          <div className=''>
                            <button className=' bg-white rounded-full' onClick={() => handlSelect(users, false, index)}  >
                              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 180 180" fill="none">
                                <path d="M100.575 90.0004L132.825 57.8254C134.237 56.4131 135.031 54.4977 135.031 52.5004C135.031 50.5032 134.237 48.5877 132.825 47.1754C131.413 45.7631 129.497 44.9697 127.5 44.9697C125.503 44.9697 123.587 45.7631 122.175 47.1754L90 79.4254L57.825 47.1754C56.4128 45.7631 54.4973 44.9697 52.5 44.9697C50.5028 44.9697 48.5873 45.7631 47.175 47.1754C45.7628 48.5877 44.9693 50.5032 44.9693 52.5004C44.9693 54.4977 45.7628 56.4131 47.175 57.8254L79.425 90.0004L47.175 122.175C46.4721 122.873 45.9141 123.702 45.5333 124.616C45.1526 125.53 44.9565 126.51 44.9565 127.5C44.9565 128.491 45.1526 129.471 45.5333 130.385C45.9141 131.299 46.4721 132.128 47.175 132.825C47.8723 133.528 48.7018 134.086 49.6157 134.467C50.5296 134.848 51.5099 135.044 52.5 135.044C53.4901 135.044 54.4704 134.848 55.3844 134.467C56.2983 134.086 57.1278 133.528 57.825 132.825L90 100.575L122.175 132.825C122.872 133.528 123.702 134.086 124.616 134.467C125.53 134.848 126.51 135.044 127.5 135.044C128.49 135.044 129.47 134.848 130.384 134.467C131.298 134.086 132.128 133.528 132.825 132.825C133.528 132.128 134.086 131.299 134.467 130.385C134.847 129.471 135.044 128.491 135.044 127.5C135.044 126.51 134.847 125.53 134.467 124.616C134.086 123.702 133.528 122.873 132.825 122.175L100.575 90.0004Z" fill="#3AB8FF" />
                              </svg>
                            </button>
                          </div>

                        </div>
                      }
                    </div>
                  ))
                  }
                  <div className="w-fullf h-ffull mt bg-slate-f400">

                    <button onClick={() => setAdd(true)} className=''>
                      <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" viewBox="0 0 24 24" fill="none">
                        <path d="M8 20H5C4.73478 20 4.48043 19.8946 4.29289 19.7071C4.10536 19.5196 4 19.2652 4 19V16C4 15.7348 3.89464 15.4804 3.70711 15.2929C3.51957 15.1054 3.26522 15 3 15C2.73478 15 2.48043 15.1054 2.29289 15.2929C2.10536 15.4804 2 15.7348 2 16V19C2 19.7956 2.31607 20.5587 2.87868 21.1213C3.44129 21.6839 4.20435 22 5 22H8C8.26522 22 8.51957 21.8946 8.70711 21.7071C8.89464 21.5196 9 21.2652 9 21C9 20.7348 8.89464 20.4804 8.70711 20.2929C8.51957 20.1054 8.26522 20 8 20ZM3 9C3.26522 9 3.51957 8.89464 3.70711 8.70711C3.89464 8.51957 4 8.26522 4 8V5C4 4.73478 4.10536 4.48043 4.29289 4.29289C4.48043 4.10536 4.73478 4 5 4H8C8.26522 4 8.51957 3.89464 8.70711 3.70711C8.89464 3.51957 9 3.26522 9 3C9 2.73478 8.89464 2.48043 8.70711 2.29289C8.51957 2.10536 8.26522 2 8 2H5C4.20435 2 3.44129 2.31607 2.87868 2.87868C2.31607 3.44129 2 4.20435 2 5V8C2 8.26522 2.10536 8.51957 2.29289 8.70711C2.48043 8.89464 2.73478 9 3 9ZM19 2H16C15.7348 2 15.4804 2.10536 15.2929 2.29289C15.1054 2.48043 15 2.73478 15 3C15 3.26522 15.1054 3.51957 15.2929 3.70711C15.4804 3.89464 15.7348 4 16 4H19C19.2652 4 19.5196 4.10536 19.7071 4.29289C19.8946 4.48043 20 4.73478 20 5V8C20 8.26522 20.1054 8.51957 20.2929 8.70711C20.4804 8.89464 20.7348 9 21 9C21.2652 9 21.5196 8.89464 21.7071 8.70711C21.8946 8.51957 22 8.26522 22 8V5C22 4.20435 21.6839 3.44129 21.1213 2.87868C20.5587 2.31607 19.7956 2 19 2ZM16 12C16 11.7348 15.8946 11.4804 15.7071 11.2929C15.5196 11.1054 15.2652 11 15 11H13V9C13 8.73478 12.8946 8.48043 12.7071 8.29289C12.5196 8.10536 12.2652 8 12 8C11.7348 8 11.4804 8.10536 11.2929 8.29289C11.1054 8.48043 11 8.73478 11 9V11H9C8.73478 11 8.48043 11.1054 8.29289 11.2929C8.10536 11.4804 8 11.7348 8 12C8 12.2652 8.10536 12.5196 8.29289 12.7071C8.48043 12.8946 8.73478 13 9 13H11V15C11 15.2652 11.1054 15.5196 11.2929 15.7071C11.4804 15.8946 11.7348 16 12 16C12.2652 16 12.5196 15.8946 12.7071 15.7071C12.8946 15.5196 13 15.2652 13 15V13H15C15.2652 13 15.5196 12.8946 15.7071 12.7071C15.8946 12.5196 16 12.2652 16 12ZM21 15C20.7348 15 20.4804 15.1054 20.2929 15.2929C20.1054 15.4804 20 15.7348 20 16V19C20 19.2652 19.8946 19.5196 19.7071 19.7071C19.5196 19.8946 19.2652 20 19 20H16C15.7348 20 15.4804 20.1054 15.2929 20.2929C15.1054 20.4804 15 20.7348 15 21C15 21.2652 15.1054 21.5196 15.2929 21.7071C15.4804 21.8946 15.7348 22 16 22H19C19.7956 22 20.5587 21.6839 21.1213 21.1213C21.6839 20.5587 22 19.7956 22 19V16C22 15.7348 21.8946 15.4804 21.7071 15.2929C21.5196 15.1054 21.2652 15 21 15Z" fill="#3AB8FF" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>}
              <div className=' bg-skhy-200 p-4 mt-j4 flex flex-row items-center justify-center'>
                <button onClick={() => setClick('')} className=' bg-white w-20 h-10 border  mr-4'>Cancel</button>
                <button onClick={handleClick} className=' bg-sky-400 w-52 h-10 border border-sky-200 text-white'>Create</button>
              </div>
            </div>
          </div>
        ) : <AddPeople users={users} setCancel={setAdd} />
      }
    </div>
  );
};

export default CreateChannels