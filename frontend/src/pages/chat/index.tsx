import EditChannel from "@/components/chat/channels/editChannel";
import Conversation from "@/components/chat/conversation";
import ConversationList from "@/components/chat/conversationList";
import Edit from "@/components/chat/direct/edit";
import { Constant } from "@/constants/constant";
import { AppProps, channelData, channelProps, participantsData, participantsProps, userData, userProps } from '@/interface/data';
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { io } from "socket.io-client";

export default function index({ socket, onlineUsersss, amis , users}: AppProps) {
  const [currentUser, setCurrentUser] = useState<userProps>(userData);
  const [Room, setRoom] = useState<channelProps>(channelData);
  const [joinRoom, setJoinRoom] = useState<channelProps>(channelData);
  const [button, setButton] = useState(false);
  const [joinchannel, setjoinchannel] = useState(false);
  const [status_tow_user, setStatus_Tow_User] = useState(false);
  const [chatSocket, setChatSocket] = useState<any>();
  const [password, setPassword] = useState(null)
  const [correct, setcorrcet] = useState(0)
  const [msg2, setMsg2] = useState('')
  const router = useRouter();
  const [receiver, setReceiver] = useState<userProps>(userData)
  const [myStatusInRoom, setMyStatusInRoom] = useState<participantsProps>(participantsData)

  // const [users, setUsers] = useState<userProps[]>([])
  // useEffect(() => {
  //   (
  //     async () => {
  //       try {

  //         const response = await fetch(`${Constant.API_URL}/users/${currentUser.id}`, {
  //           credentials: 'include',
  //         });
  //         if (response.ok) {
  //           const content = await response.json();
  //           setUsers(Array.from(content));
  //         }
  //       } catch (error) {

  //       }
  //     }
  //   )();
  // }, [currentUser]);

  useEffect(() => {
    let id = Number(router.query.user)
    users.map((item) => {
      if (item.id == id) {
        setReceiver(item)
        setButton(false)
      }
    })
    setMyStatusInRoom(participantsData)
  }, [router])

  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch('http://localhost:3333/auth/user', {
            credentials: 'include',
          });
          const content = await response.json();
          setCurrentUser(content)
        } catch (error) {

        }
      }
    )();
  }, []);
  const joinchanle = async () => {
    try {
      const response = await fetch(`http://localhost:3333/chat/joinChannel/${joinRoom.id}/${password}`, {
        method: 'POST',
        credentials: 'include',

      })
      // const content = await response.json();
      if (response.status == 201) {
        setjoinchannel(false)
        setcorrcet(0)
      }
      else {
        setcorrcet(1)

      }
    } catch (error) {

    }
  }
  useEffect(() => {
    (
      async () => {
        try {
          const response = await fetch(`http://localhost:3333/chat/statusChatTwoUser/${receiver.id}`, {
            credentials: 'include',
          });
          const content = await response.json();
          // setstatus(content)
          if (content.status == "accepted" || !content)
            setStatus_Tow_User(false)
          else
            setStatus_Tow_User(true);


        } catch (error) {

        }
      }
    )();

  }, [receiver, status_tow_user]);

  useEffect(() => {
    const socket = io('http://localhost:3333/ChatGateway', {
      query: {
        userId: currentUser.id,
      }
    });

    setChatSocket(socket)
    return () => {
      socket.disconnect();
    };
  }, [currentUser]);

  useEffect(() => {
    setRoom(channelData);
    setReceiver(userData)
    setMyStatusInRoom(participantsData)
    setcorrcet(0)
  }, [button]);
  useEffect(() => {
    // setRoom(channelData);
    // setReceiver(userData)
    setcorrcet(0)
  }, [Room]);


  return (
    <div className="  flex relative w-full h-screen justify-center items-center mt-28">
      <div className="   flex relative flex-col w-full max-w-[1800px] ">
        <div className={` bg-bldack flex-uwrap  ${joinchannel == true ? 'blur-sm' : null} min-w-full mt-6 min-h-screen flex flex-row justify-centder items-csenter dark:bg-black space-x-2 sm:space-x-6`}>
          <ConversationList currentUser={currentUser} msg2={msg2} amis={amis} setButton={setButton} users={users} setRoom={setRoom} setjoinchannel={setjoinchannel} setStatus_Tow_User={setStatus_Tow_User} status_tow_user={status_tow_user} Room={Room} setJoinRoom={setJoinRoom} />
          <Conversation amis={amis} socket={socket} onlineUsersss={onlineUsersss} myStatusInRoom={myStatusInRoom} currentUser={currentUser} setMsg2={setMsg2} users={users} chatSocket={chatSocket} button={button} Room={Room} setStatus_Tow_User={setStatus_Tow_User} status_tow_user={status_tow_user} />
          {
            button == false && receiver.id != 0 &&
            <div className="md:hidaden sm:hidsden hidden  bg-white dark:bg-slate-800 p-2  mt-12  w-[20%] h-[820px]      lg:flex justify-start items-start   border-2  border-sky-400 rounded-xl">
              <div className="  bg-white  w-full h-[547.06px] flex-col justify-start items-center  bg-blwack  gasp-[26px] flex">
                <Edit users={users} currentUser={currentUser} setStatus_Tow_User={setStatus_Tow_User} status_tow_user={status_tow_user} />
              </div>
            </div>
          }
          {button == true && Room.id != 0 &&
            <div className=' lg:flex bg-white  hidden flex-col  w-[20%] h-[820px]  items-center  mt-12 border-2  border-sky-400 rounded-xl  '>
              <EditChannel chatSocket={chatSocket} setMyStatusInRoom={setMyStatusInRoom} users={users} currentUser={currentUser} Room={Room} />
            </div>}
        </div>
        {
          joinchannel == true ?
            (
              <div className=" flex absolute justify-center   h-full w-full  items-center">
                {
                  joinRoom.type === "protected" && < div className="flex   items-center   mdl-12 justify-center min-h-screen    min-w-screen  z-20  bg-sslate-400">

                    <div className=" bg-white md:w-[400px]   flex flex-col  justify-strt items-center  sm:w-[400px]   h-80 w-96  drop-shadow shadow-lg shaddow-black  rounded-xl -mst-[1000px] md:-mst-[700px] z-20 text-blue-600 ml-10 md:mdl-[600px]">
                      {/* <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm logout </div> */}
                      <div className="w-full flex bg-bdlack justify-end items-end ">

                        <button onClick={() => setjoinchannel(false)} className="w-8  mr-2   justify-center items-center bg-white flex shadow-sm  mt-2 mer-4 h-8 shadow-black  bg-bklack  rounded-full">
                          <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="20" height="20" viewBox="0 0 30 30">
                            <path d="M 7 4 C 6.744125 4 6.4879687 4.0974687 6.2929688 4.2929688 L 4.2929688 6.2929688 C 3.9019687 6.6839688 3.9019687 7.3170313 4.2929688 7.7070312 L 11.585938 15 L 4.2929688 22.292969 C 3.9019687 22.683969 3.9019687 23.317031 4.2929688 23.707031 L 6.2929688 25.707031 C 6.6839688 26.098031 7.3170313 26.098031 7.7070312 25.707031 L 15 18.414062 L 22.292969 25.707031 C 22.682969 26.098031 23.317031 26.098031 23.707031 25.707031 L 25.707031 23.707031 C 26.098031 23.316031 26.098031 22.682969 25.707031 22.292969 L 18.414062 15 L 25.707031 7.7070312 C 26.098031 7.3170312 26.098031 6.6829688 25.707031 6.2929688 L 23.707031 4.2929688 C 23.316031 3.9019687 22.682969 3.9019687 22.292969 4.2929688 L 15 11.585938 L 7.7070312 4.2929688 C 7.5115312 4.0974687 7.255875 4 7 4 z"></path>
                          </svg>
                        </button>
                      </div>
                      <div className=" flex justify-center items-center w-16 h-16 rounded-full bg-white  mt-1 drop-shadow shadow-lg shaddow-black ">

                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
                          <g fill="#1437be" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none" > <g transform="scale(8.53333,8.53333)"><path d="M15,2c-3.85433,0 -7,3.14567 -7,7v2h-2c-1.105,0 -2,0.895 -2,2v12c0,1.105 0.895,2 2,2h18c1.105,0 2,-0.895 2,-2v-12c0,-1.105 -0.895,-2 -2,-2h-2v-2c0,-3.72842 -2.96342,-6.73143 -6.64453,-6.92773c-0.11309,-0.04556 -0.23356,-0.07005 -0.35547,-0.07227zM15,4c2.77367,0 5,2.22633 5,5v2h-10v-2c0,-2.77367 2.22633,-5 5,-5z"></path></g></g>
                        </svg>
                      </div>
                      {/* <div className=' w-96 hd-2 border-2 mt-5' > </div> */}
                      <div className='text-black text-xl mt-3  mel-16   flex justify-center items-center w-full font-black' >This groub  is password  protected </div>
                      {
                        correct == 0 && <div className='text-[#9ca3af] text-sm mt-2  mel-16   flex justify-center items-center w-full fontd-black' >Please enter the password to view  this groub</div>

                      }
                      {
                        correct == 1 && <div className='text-red-400 text-sm mt-2  mel-16   flex justify-center items-center w-full fontd-black' > password  is invalid </div>

                      }
                      {/* <div className=""> */}
                      <input required onChange={(e: any) => setPassword(e.target.value)} className="p-2 rounfded-xl text-base  text-blue-600 font-black disabled:opacity-75  mt-6 border-b-4 border-blue-600 w-80 h-10  w-fulgl" type="password" name="password" placeholder="Password" />

                      {/* </div> */}
                      <div className=' w-96 h-16 fbg-black mt-3 flex flex-row justify-center items-center space-x-6 '>
                        <button onClick={() => joinchanle()} className=' text-white  bg-blue-600 w-80  flex justify-center items-center  bordfer-2 bofrder-blue-600 h-10 rounded-full'>
                          <div className=" text-white text-xl font-black">Submit</div>
                        </button>


                      </div>
                    </div>
                  </div>
                }
                {
                  joinRoom.type === "public" && < div className="flex   items-center  justify-center min-h-screen    xl:bg-dblue-600 min-w-screen  z-20  ">

                    <div className=" bg-white md:w-[400px]   flex flex-col  justify-strt items-center  sm:w-[400px]   h-80 w-96  drop-shadow shadow-lg shaddow-black  rounded-xl -mst-[1000px] md:-mst-[700px] z-20 text-blue-600 ml-10 md:mdl-[600px]">
                      {/* <div className='text-blue-500 text-xl mt-8  mr-44  font-black' >Confirm logout </div> */}
                      <div className=" flex justify-center items-center w-16 h-16 rounded-full bg-white  mt-10 drop-shadow shadow-lg shaddow-black ">

                        <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="30" height="30" viewBox="0,0,256,256">
                          <g fill="#1437be" fill-rule="nonzero" stroke="none" stroke-width="1" stroke-linecap="butt" stroke-linejoin="miter" stroke-miterlimit="10" stroke-dasharray="" stroke-dashoffset="0" font-family="none" font-weight="none" font-size="none" text-anchor="none"><g transform="scale(10.66667,10.66667)"><path d="M12,0c-3.30078,0 -6,2.69922 -6,6v2h2v-2c0,-2.21875 1.78125,-4 4,-4c2.21875,0 4,1.78125 4,4v5h-13v13h18v-13h-3v-5c0,-3.30078 -2.69922,-6 -6,-6z"></path></g></g>
                        </svg>
                      </div>
                      <div className='text-black text-xl mt-3  mel-16   flex justify-center items-center w-full font-black' >Confirm {Room.name}</div>
                      <div className='text-[#9ca3af] text-sm mt-2  mel-16   flex justify-center items-center w-full fontd-black' >Are you sure ?</div>

                      <div className=' w-96  fbg-black mt-3 flex flex-col justify-center items-center space-y-3 '>
                        <button onClick={() => setjoinchannel(false)} className=' text-black  bg-[#9ca3af]  w-80  h-12  flex justify-center items-center  bordfer-2 bofrder-blue-600  rounded-full'>
                          <div className=" text-black text-xl    flex justify-center items-center  font-mono">Cancel</div>
                        </button>
                        <button onClick={() => joinchanle()} className=' text-white   h-12 bg-blue-600 w-80  flex justify-center items-center  bordfer-2 bofrder-blue-600  rounded-full'>
                          <div className=" text-white  flex justify-center items-center text-xl font-mono">Accpet</div>
                        </button>


                      </div>
                    </div>
                  </div>
                }
              </div>
            ) : null
        }
      </div >
    </div>
  )
}