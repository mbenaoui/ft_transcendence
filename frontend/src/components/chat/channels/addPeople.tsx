import { participantsProps, userProps } from '@/interface/data'
import React, { useEffect, useState } from 'react'

const AddPeople = ({ participants, setCancel, users }: { participants?: participantsProps[], setCancel: (value: any) => void, users: userProps[] }) =>{

    const [select, setSelect] = useState(false)


    const handlSelect = (item: userProps[], s: boolean, index: number) => {
        item[index].flag = s
        if (select == true)
            setSelect(false)
        else
            setSelect(true)
        users.map((item) => {
        })
    }

    useEffect(() => {
        users.map((item: userProps) => {
            item.flag = false
            item.dakhal = false
        })

        users.map((item: userProps) => {
            participants?.map((item2) => {
                if (item.username == item2.username)
                    item.dakhal = true
            })
        })

    }, [users])

    return (

        <div className='flex-col  w-full '>
            <div className="h-14 flex">
                <div className='flex justify-start w-full items-center ml-8'>
                    <h1 className=' font-mono font-bold'>Add People</h1>
                </div>
                <div className='w-full justify-end items-center flex'>
                    <button onClick={() => setCancel(false)} className=" mr-6">
                        <svg width="10" height="10" viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <path id="Vector" d="M117.5 100L196.25 21.25C201.25 16.25 201.25 8.75 196.25 3.75C191.25 -1.25 183.75 -1.25 178.75 3.75L100 82.5L21.25 3.75C16.25 -1.25 8.75 -1.25 3.75 3.75C-1.25 8.75 -1.25 16.25 3.75 21.25L82.5 100L3.75 178.75C1.25 181.25 0 183.75 0 187.5C0 195 5 200 12.5 200C16.25 200 18.75 198.75 21.25 196.25L100 117.5L178.75 196.25C181.25 198.75 183.75 200 187.5 200C191.25 200 193.75 198.75 196.25 196.25C201.25 191.25 201.25 183.75 196.25 178.75L117.5 100Z" fill="#376EFA" fill-opacity="0.85" />
                        </svg>
                    </button>
                </div>
            </div>
            <div className='flex-row-revferse overflow-x-scroll scrollbar-hide flex p-2'>
                {users.map((item, index) => (
                    <div key={index} className=''>
                        {
                            item.flag &&
                            <div className='h-full w-16 flex justify-center items-center' key={index}>
                                <img className='w-12 h-12 rounded-full ' src={item.foto_user} />
                                <div className="flex justify-end items-end h-full bgj-black z-18">
                                    <button className='' onClick={() => handlSelect(users, false, index)}  >
                                        <svg className=' ' xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                            <path d="M13.414 12.0003L16.707 8.70732C16.8926 8.5194 16.9963 8.2657 16.9954 8.00161C16.9946 7.73751 16.8893 7.48447 16.7026 7.29773C16.5158 7.11099 16.2628 7.00571 15.9987 7.00489C15.7346 7.00406 15.4809 7.10775 15.293 7.29332L12 10.5863L8.70696 7.29332C8.51887 7.10861 8.26545 7.00565 8.00183 7.00685C7.73822 7.00804 7.48574 7.11329 7.29933 7.2997C7.11292 7.4861 7.00767 7.73858 7.00648 8.0022C7.00529 8.26582 7.10825 8.51924 7.29296 8.70732L10.5859 12.0003L7.29296 15.2933C7.10825 15.4814 7.00529 15.7348 7.00648 15.9984C7.00767 16.2621 7.11292 16.5145 7.29933 16.7009C7.48574 16.8874 7.73822 16.9926 8.00183 16.9938C8.26545 16.995 8.51887 16.892 8.70696 16.7073L12 13.4144L15.293 16.7074C15.4809 16.8929 15.7346 16.9966 15.9987 16.9958C16.2628 16.995 16.5158 16.8897 16.7026 16.7029C16.8893 16.5162 16.9946 16.2631 16.9954 15.999C16.9962 15.7349 16.8925 15.4812 16.707 15.2933L13.414 12.0003Z" fill="white" />
                                            <path d="M19.0708 4.92882C17.1955 3.05353 14.6521 2 12 2C9.34792 2 6.80448 3.05353 4.92919 4.92882C3.05389 6.80411 2.00037 9.34756 2.00037 11.9996C2.00037 14.6517 3.05389 17.1951 4.92919 19.0704C6.80448 20.9457 9.34792 21.9992 12 21.9992C14.6521 21.9992 17.1955 20.9457 19.0708 19.0704C20.9461 17.1951 21.9996 14.6517 21.9996 11.9996C21.9996 9.34756 20.9461 6.80411 19.0708 4.92882V4.92882ZM16.707 15.2926C16.8012 15.3852 16.8762 15.4954 16.9275 15.6171C16.9789 15.7388 17.0057 15.8694 17.0063 16.0015C17.0069 16.1336 16.9813 16.2644 16.931 16.3866C16.8808 16.5087 16.8068 16.6197 16.7134 16.7131C16.62 16.8064 16.5091 16.8804 16.3869 16.9307C16.2648 16.9809 16.1339 17.0065 16.0019 17.0059C15.8698 17.0053 15.7392 16.9786 15.6175 16.9272C15.4958 16.8758 15.3855 16.8009 15.293 16.7066L12 13.4137L8.70699 16.7066C8.5189 16.8913 8.26548 16.9943 8.00186 16.9931C7.73825 16.9919 7.48577 16.8867 7.29936 16.7002C7.11296 16.5138 7.00771 16.2614 7.00651 15.9977C7.00532 15.7341 7.10828 15.4807 7.29299 15.2926L10.5859 11.9996L7.29299 8.70662C7.10828 8.51853 7.00532 8.26511 7.00651 8.0015C7.00771 7.73788 7.11296 7.4854 7.29936 7.299C7.48577 7.11259 7.73825 7.00734 8.00186 7.00615C8.26548 7.00495 8.5189 7.10791 8.70699 7.29262L12 10.5856L15.293 7.29256C15.4809 7.107 15.7346 7.00332 15.9987 7.00416C16.2628 7.00499 16.5158 7.11028 16.7026 7.29703C16.8893 7.48378 16.9946 7.73682 16.9954 8.00092C16.9962 8.26501 16.8926 8.51871 16.707 8.70662L13.414 11.9996L16.707 15.2926Z" fill="#FF212E" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        }
                    </div>
                ))
                }
            </div>
            <div className=' w-full h-[1px] bg-sky-200' />
            <div className="flex-col  items-center overflow-y-scroll scrollbar-hide  h-[480px]  p-2 ">
                {users.map((item: userProps, index) =>
                    !item.dakhal &&
                    <div key={index} className="flex flex-row w-full p-1  h-14 justify-center items-center">
                        <div className='flex space-x-2'>
                            <img className='w-8 h-8 rounded-full' src={item.foto_user}></img>
                            <h1 className='text-lg font-mono'>{item.username}</h1>
                        </div>
                        <div className="flex w-full justify-end">
                            {!item.flag && <button onClick={() => handlSelect(users, true, index)} className=' duration-300 hover:ease-in-  border-2 border-sky-500 w-auto p-3 h-4 flex justify-center items-center text-xs font-mono font-bold text-sky-500 '>
                                Add
                            </button>}
                            {item.flag && <button onClick={() => handlSelect(users, false, index)} className=' border-2 border-lime-500 p-3  text-lime-500 w-auto h-4 flex  text-xs font-mono font-bold justify-center items-center space-x-5'>
                                Added   <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none">
                                    <path d="M18.7099 7.20986C18.617 7.11613 18.5064 7.04174 18.3845 6.99097C18.2627 6.9402 18.132 6.91406 17.9999 6.91406C17.8679 6.91406 17.7372 6.9402 17.6154 6.99097C17.4935 7.04174 17.3829 7.11613 17.29 7.20986L9.83995 14.6699L6.70995 11.5299C6.61343 11.4366 6.49949 11.3633 6.37463 11.3141C6.24978 11.2649 6.11645 11.2408 5.98227 11.2431C5.84809 11.2454 5.71568 11.2741 5.5926 11.3276C5.46953 11.3811 5.35819 11.4583 5.26495 11.5549C5.17171 11.6514 5.0984 11.7653 5.04919 11.8902C4.99999 12.015 4.97586 12.1484 4.97818 12.2825C4.9805 12.4167 5.00923 12.5491 5.06272 12.6722C5.11622 12.7953 5.19343 12.9066 5.28995 12.9999L9.12995 16.8399C9.22291 16.9336 9.33351 17.008 9.45537 17.0588C9.57723 17.1095 9.70794 17.1357 9.83995 17.1357C9.97196 17.1357 10.1027 17.1095 10.2245 17.0588C10.3464 17.008 10.457 16.9336 10.55 16.8399L18.7099 8.67986C18.8115 8.58622 18.8925 8.47257 18.9479 8.34607C19.0033 8.21957 19.0319 8.08296 19.0319 7.94486C19.0319 7.80676 19.0033 7.67015 18.9479 7.54365C18.8925 7.41715 18.8115 7.3035 18.7099 7.20986V7.20986Z" fill="#1ADB50" />
                                </svg>              </button>}
                        </div>
                    </div>
                )}
            </div>

        </div>
    )
}

export default AddPeople