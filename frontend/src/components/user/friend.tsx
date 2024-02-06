import { Constant } from "@/constants/constant";
import { userProps } from "@/interface/data";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from 'next/image';


function LevelBar(userid: any) {

  let flag1 = 0;
  const [amis_id, setAmisid] = useState<Array<userProps>>([])

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch(`${Constant.API_URL}/friends/accepted-friends/${userid.userid}`, {
            credentials: 'include',
          });
          const content = await response.json();

          setAmisid(Array.from(content));
        } catch (error) {

        }

      }
    )();
  }, [userid]);
  let filterUser: any = amis_id.filter((user: userProps) => {

    // user.isf = true
    userid.amis.filter((usr: userProps) => {
      if (usr.id == user.id) {
        flag1++;
      }
    })
  })
  return (
    <p className=" indent-0  text-sm sm:tesxt-md text-blue-200">{flag1} matual friends
    </p>
  );

}

const Friends = ({ amis_id, amis, currentUser }: { amis_id: Array<userProps>, amis: Array<userProps>, currentUser: number }) => {

  const [allfriends, setallfriends] = useState<Array<userProps>>([])
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false)
  const [cansle_request, setcansle_request] = useState(false)
  const profailamis = (username: string, userId: number) => {
    router.push(`/users/${username}.${userId}`);
  };
  const [send, setsend] = useState<Array<userProps>>([]);
  const toggleDropdown = () => {
    setcansle_request(!cansle_request);
  };
  useEffect(() => {
    (
      async () => {
        const response = await fetch(`${Constant.API_URL}/friends/send-requests`, {
          credentials: 'include',
        });
        const counte = await response.json();
        if (response.status == 200) {
          setsend(Array.from(counte))
          return;
        }
      }
    )();
  }, [currentUser, isOpen]);
  const CanacelRequest = async (numberPart: number) => {
    try {
      const response = await fetch(`${Constant.API_URL}/friends/delete-friend-request/${numberPart}`, {
        method: 'DELETE',
        credentials: 'include',
      });
      if (response.ok) {
        setIsOpen(true);
      } else {
        console.error('Failed to delete-friend-request.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  useEffect(() => {
    let freid = 0;
    let filterUser: any = amis_id.filter((user: userProps) => {
      user.flag = true;
      user.flag1 = true;
      amis.filter((usr: userProps) => {
        if (usr.id == user.id) {
          user.flag = false
        }
      })
      send.map((usr: any) => {
        if (usr.receiver.id == user.id) {
          user.flag1 = false
        }
      })
      return user
    })
    setallfriends(filterUser)
    setIsOpen(false);
    setcansle_request(false);
  }, [isOpen, amis_id, amis, currentUser, send])
  const sendRequest = async (numberPart: number) => {
    try {
      const response = await fetch(`${Constant.API_URL}/friends/send-request/${numberPart}`, {
        method: 'POST',
        credentials: 'include',
      });
      if (response.ok) {
        setIsOpen(true);
      } else {
        console.error('Failed to send friend request.');
      }
    } catch (error) {
      console.error('Error sending friend request:', error);
    }
  };
  return (
    <div className="flex  flex-none      justify-center items-censter    rounded-r-[40px]  bg-sblue-600  w-full sm:w-[415px] h-[700px] ">
      <div className=" overflow-y-scroll  scrollbar-hide bg-white  -mt-10 sm:mt-0 w-[96%]  sm:w-[430px] drop-shadow shadow-md shadow-black rounded-2xl max-h-[980px] mst-2">
        {
          (allfriends.length) ? allfriends.map((user: any, index: any) => (
            <div key={index} className='   border-b-[2px] mt-0  bg-white w-auto sm:w-[420px] h-16 rounded-l rounded-r items-center      space-x-6 p-2  flex  justify-between'>
              <div className="flex   space-x-2  ">
                <img
                  src={user.foto_user}
                  alt="Your Image Alt Text"
                  className="  sm:w-14 sm:h-14  h-12 w-12 rounded-full " // Adjust the width as needed
                />
                <div className=' rounded-xl  mt-2 flex  justify-start items-start flex-col  '>
                  <button className="  flex  capitalize " onClick={() => profailamis(user.username, user.id)}> {`${user.username}`} </button>
                  {
                    (user.id == currentUser) ?
                      (<div></div>) :
                      <div>
                        <LevelBar userid={user.id} amis={amis} />
                      </div>
                  }
                </div>
              </div>
              {
                (user.id == currentUser) ?
                  (<div></div>) :
                  (!user.flag) ?
                    (<div className="flex w-wfull justify-end items-center ">

                      <div className=" w-14 h-10  sm:w-16 sm:h-10 shadow-blue-400 justify-center bg-gradient-to-r from-blue-500 to-cyan-300   flex  items-center  space-x-1  border rounded-full hover:bg-[white] hover:scale-110 duration-300">
                        <svg width="20" height="20" fill="black" enableBackground="new 0 0 24 24" id="Layer_1" version="1.0" viewBox="0 0 24 24" xmlSpace="preserve" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"><polyline clipRule="evenodd" fill="none" fillRule="evenodd" points="  23,7.5 17.7,13 14.9,10.2 " stroke="#000000" strokeMiterlimit="10" strokeWidth="2" /><circle cx="9" cy="8" r="4" /><path d="M9,14c-6.1,0-8,4-8,4v2h16v-2C17,18,15.1,14,9,14z" /></svg>
                      </div>
                      <div className=" mwr-5 sm:mr-0  w-14 h-10    sm:w-16 sm:h-10 shadow-blue-400 justify-center bg-gradient-to-r from-blue-500 to-cyan-300   flex  items-center  space-x-1  border rounded-full hover:bg-[#eeecec] hover:scale-110 duration-300">

                        <Link href='/game' content='play' className="" >
                          <svg fill="#000000" width="20" height="20" viewBox="0 0 256 256" id="Flat" xmlns="http://www.w3.org/2000/svg">
                            <path d="M128,24A104.02809,104.02809,0,0,0,36.811,178.041l-8.54737,29.915a16.00023,16.00023,0,0,0,19.77979,19.78027l29.916-8.54639A104.00746,104.00746,0,1,0,128,24Zm53.65674,93.65674-32,32a7.99945,7.99945,0,0,1-11.31348,0L112,123.3135,85.65674,149.65676a7.99984,7.99984,0,1,1-11.31348-11.31348l32-32a8,8,0,0,1,11.31348,0L144,132.68654l26.34326-26.34326a7.99984,7.99984,0,0,1,11.31348,11.31348Z" />
                          </svg>
                        </Link>
                      </div>
                    </div>) :
                    (
                      (user.flag1) ?
                        (
                          (<div>
                            <button onClick={() => sendRequest(user.id)} className="py-2 px-5 shadow-blue-400 justify-center bg-gradient-to-r from-blue-500 to-cyan-300  flex  items-center  space-x-1  border rounded-full hover:bg-[white] hover:scale-110 duration-300" >
                              <svg fill="#000000" version="1.1" id="Capa_1" xmlns="http://www.w3.org/2000/svg" xmlnsXlink="http://www.w3.org/1999/xlink"
                                width="20" height="20" viewBox="0 0 45.902 45.902"
                                xmlSpace="preserve">
                                <g>
                                  <g>
                                    <path d="M43.162,26.681c-1.564-1.578-3.631-2.539-5.825-2.742c1.894-1.704,3.089-4.164,3.089-6.912
                      c0-5.141-4.166-9.307-9.308-9.307c-4.911,0-8.932,3.804-9.281,8.625c4.369,1.89,7.435,6.244,7.435,11.299
                      c0,1.846-0.42,3.65-1.201,5.287c1.125,0.588,2.162,1.348,3.066,2.26c2.318,2.334,3.635,5.561,3.61,8.851l-0.002,0.067
                      l-0.002,0.057l-0.082,1.557h11.149l0.092-12.33C45.921,30.878,44.936,28.466,43.162,26.681z"/>
                                    <path d="M23.184,34.558c1.893-1.703,3.092-4.164,3.092-6.912c0-5.142-4.168-9.309-9.309-9.309c-5.142,0-9.309,4.167-9.309,9.309
                      c0,2.743,1.194,5.202,3.084,6.906c-4.84,0.375-8.663,4.383-8.698,9.318l-0.092,1.853h14.153h15.553l0.092-1.714
                      c0.018-2.514-0.968-4.926-2.741-6.711C27.443,35.719,25.377,34.761,23.184,34.558z"/>
                                    <path d="M6.004,11.374v3.458c0,1.432,1.164,2.595,2.597,2.595c1.435,0,2.597-1.163,2.597-2.595v-3.458h3.454
                      c1.433,0,2.596-1.164,2.596-2.597c0-1.432-1.163-2.596-2.596-2.596h-3.454V2.774c0-1.433-1.162-2.595-2.597-2.595
                      c-1.433,0-2.597,1.162-2.597,2.595V6.18H2.596C1.161,6.18,0,7.344,0,8.776c0,1.433,1.161,2.597,2.596,2.597H6.004z"/>
                                  </g>
                                </g>
                              </svg>
                            </button>
                          </div>)
                        ) :
                        (
                          (
                            <div className="">
                              <button onClick={() => CanacelRequest(user.id)} className="flex float-none   py-2 px-5 shadow-blue-400 justify-center bg-gradient-to-r from-blue-500 to-cyan-300  hover:bg-[white] hover:scale-110 items-center      border rounded-full duration-300"><svg width="20" height="20" viewBox="0 0 640 512" xmlns="http://www.w3.org/2000/svg"><path d="M496 224c-79.6 0-144 64.4-144 144s64.4 144 144 144 144-64.4 144-144-64.4-144-144-144zm64 150.3c0 5.3-4.4 9.7-9.7 9.7h-60.6c-5.3 0-9.7-4.4-9.7-9.7v-76.6c0-5.3 4.4-9.7 9.7-9.7h12.6c5.3 0 9.7 4.4 9.7 9.7V352h38.3c5.3 0 9.7 4.4 9.7 9.7v12.6zM320 368c0-27.8 6.7-54.1 18.2-77.5-8-1.5-16.2-2.5-24.6-2.5h-16.7c-22.2 10.2-46.9 16-72.9 16s-50.6-5.8-72.9-16h-16.7C60.2 288 0 348.2 0 422.4V464c0 26.5 21.5 48 48 48h347.1c-45.3-31.9-75.1-84.5-75.1-144zm-96-112c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128z" /></svg>
                              </button>
                            </div>
                          )
                        )
                    )
              }
            </div>
          )) : (
            <footer className='  w-full  rounded-2xl h-full  -mt-20 flex flex-col justify-center items-center space-y-3'>
              <div className="mt-20 bg-green-w500 flex items-end -space-x-2">
                <div className="">
                  <Image className='border-2 border-white rounded-full w-[50px] h-[50px]' width={500} height={500} src={'/search/man.png'} alt='woman iamge' />
                </div>
                <div className=" z-10">
                  <Image className=' border-2 border-white rounded-full w-[60px] h-[60px]' priority width={600} height={600} src={'/search/woman.png'} alt='woman iamge'></Image>
                </div>
                <div className="">
                  <Image className='  border-2 border-white rounded-full w-[50px] h-[50px]' width={500} height={500} src={'/search/boy.png'} alt='woman iamge'></Image>
                </div>
              </div>
              <div className=" w-[50%] text-center  text-xl font-semibold">
                <h1>No user found</h1>
              </div>
              <div className=' w-[50%]   text-center'>
                <h2> Sorry, We couldn't find any user </h2>
              </div>

            </footer>
          )
        }
      </div>
    </div>
  )
}

export default Friends;
