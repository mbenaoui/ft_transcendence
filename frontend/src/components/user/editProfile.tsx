import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { AppProps, userProps } from "@/interface/data";
import { Constant } from "@/constants/constant";
import Image from "next/image";
import { getTheGrad } from "../game/listOfFriends";

interface LevelBarpros {
    value: String
}
function LevelBar({ value }: LevelBarpros) {
    let progressWidth;
    if (value.length > 1)
        progressWidth = `${value}%`;
    else
        progressWidth = `${value}0%`;
    return (
        <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80 rounded-lg">
            <div className="bg-[#0ea5e9] h-5 rounded-lg " style={{ width: progressWidth }}>
            </div>
        </div>
    );
}
export const getLevel = (level: number | any): string => {
    if (!level)
        return '0'
    return level.toString().slice(0, level.toString().indexOf('.') + 3)
}
export const extractdecimalNumberFromLevel = (_level: number) => {
    if (!_level)
        return '0'
    var level: string = _level.toString() + '0'
    const ret = level.toString().indexOf('.') == -1 ? 0 : level.toString().slice(level.toString().indexOf('.') + 1, level.toString().indexOf('.') + 3)
    return Number(ret) > 2 ? ret : 0
}

const EditProfile = ({ currentUser }: { currentUser: userProps }) => {
    const [level, setlevel] = useState();
    const [id, setid] = useState(0);
    const [email, setEmail] = useState("");
    const [foto_user, setFoto_user] = useState("");
    const [username, setUsername] = useState("");
    const [update_email, setupdate_email] = useState("");
    const [update_gender, setupdate_gender] = useState("");
    const [update_name, setupdate_name] = useState("");
    const [update_foto_user, setupdate_foto_user] = useState("");
    const router = useRouter()
    const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const selectedFile = event.target.files?.[0];
        if (selectedFile) {
            const reader = new FileReader();
            reader.onload = (event) => {
                const base64Image = event.target?.result;
                if (typeof base64Image === 'string') {
                    setupdate_foto_user(base64Image);
                } else {
                    setupdate_foto_user('');
                }
            };

            reader.readAsDataURL(selectedFile);
        }
    };
    const handleSubmit = async (e: any) => {
        try {
            const res = await fetch(`${Constant.API_URL}/users/update_info`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    "email": update_email,
                    "username": update_name,
                    "foto_user": update_foto_user
                }),
            });
            if (res.status == 200) {
                const form = e.target;
                router.push('/profile');
            } else {
                router.push('/profile');
            }

        } catch (error) {
            router.push('/profile');
        }
    };
    useEffect(() => {
        (
            async () => {
                try {
                    const response = await fetch(`${Constant.API_URL}/auth/user`, {
                        credentials: 'include',
                    });
                    const content = await response.json();
                    setFoto_user(content.foto_user);
                    setid(content.id);
                    setEmail(content.email);
                    setUsername(content.username)
                    setlevel(content.level)


                } catch (error) {

                }
            }
        )();
    });
    useEffect(() => {
        (
            async () => {
                if (!update_foto_user)
                    setupdate_foto_user(foto_user)
                setupdate_gender(foto_user)
                if (!update_email)
                    setupdate_email(email);
                if (!update_name)
                    setupdate_name(username);
            }
        )();
    });
    return (
        <div className='flex  flex-wrap  justify-center  min-h-screen  w-full items-center  ps-6 '>
            <div className='   flex-none smr-6 sm:mr-0  z-20  sm:w-[408px]   w-auto mt-[120px] mb-10  h-[100%] drop-shadow-2xl   items-center justify-center bg-gradient-to-r from-cyan-500 to-blue-500 rounded-[40px] p-6  text-white'>
                <div className=" w-full flex-col justify-center items-center text-center">
                    <span>My Profile</span>
                    <div className="mt-6 w-full justify-center flex bg-dblack items-center">
                        {foto_user && (
                            <img
                                src={foto_user}
                                alt="Your Image Alt Text"
                                className=" w-52 h-52   border-2 border-[#E3E8EC]  drop-shadow shadow-md shadow-black rounded-[40px] " // Adjust the width as needed
                            />
                        )}
                    </div>
                    <div className='mt-6 w-full flex justify-center items-center flex-col'>
                        <h1 className="text-xl font-bold">{(username)}</h1>
                        <span className="text-sm  font-serif italic flex justify-center mt-3">{email}</span>
                    </div>
                    <div className="mt-8 bg-bflack justify-center flex items-center flex-col w-full  mdl-6">
                        <LevelBar value={String(extractdecimalNumberFromLevel(currentUser.level))} />
                        <p className=' mt-4 text-white shadow-sm shadow-black   w-28   uppercasej'>level : {getLevel(currentUser.level)}</p>

                    </div>
                    <div className=" hidden md:flex  bg  flex-col   items-center ">
                        <div className='mt-6 flex  flex-col items-center'>
                            <Link className="text-base font-bold flex justify-center items-center ml-4 text-blue-600" href={"/profile"}><span className=" py-2 px-32 bg-white  shadow-sm shadow-black   border rounded-xl hover:scale-110 duration-300">Profile</span>
                            </Link>
                            <h1 className="flex  mt-[40px] ">Recent Activities</h1>
                            <div className={` ${(currentUser.level) < 5 ? `w-80` : 'w-60'} mt-6 h-60   flex items-center justify-center relative`}>
                                <Image fill style={{ objectFit: "cover" }} className='' src={getTheGrad(currentUser.level)} alt='grad'></Image>
                            </div>
                        </div>
                    </div>
                    <div className=" md:hidden flex  justify-center w-full items-center flex-col mdl-6 ">
                        <Link className="text-base font-bold flex justify-center mt-6 mdr-8 items-center  bg-bslack w-80 h-12 msl-4 text-blue-600" href={"/profile"}><span className=" w-full flex  justify-center items-center  h-full sm:py-2 sm:px-32 bg-white  shadow-sm shadow-black   border rounded-xl hover:scale-110 duration-300">Profile</span>
                        </Link>
                        <div className='mt-6 w-full justify-center   flex-col flex bg-blarck items-center'>
                            <p className="     text-2xl  dmr-52">Settings</p>
                            <Link className=" mt-6   w-80   rounded-xl  h-12  flex justify-center  items-center bg-blue-600  hover:scale-110 drop-shadow shadow-md shadow-black  duration-300 text-white text-sm border border-white font-bold" href={"/editProfile"}> <span className=" flex flex-row  " >Profile Settings</span></Link>
                            <Link className="text-base w-80  h-12 font-bold flex justify-center items-center text-blue-600" href={"/listblocked"}><span className=" flex justify-center items-center  mt-10    w-full h-full  border-white  rounded-xl bg-white  drop-shadow shadow-md shadow-black border  hover:scale-110 duration-300">Blocked</span>
                            </Link>
                            <Link className="text-base font-bold w-80 mt-5  h-12  flex justify-center items-center text-blue-600" href={"/code_QR"}><span className="  mt-10 bg-white flex justify-center items-center w-full h-full     border-white rounded-xl border drop-shadow shadow-md shadow-black hover:scale-110 duration-300">Code_OR</span>
                            </Link>
                        </div>
                    </div>
                    <div className="mt-10 w-full ">
                    </div>
                </div>
            </div>
            <div className="z-10 hidden md:flex">
                <div className=" flex flex-col gap-8     h-full w-64 items-center   drop-shadow-[0_35px_35px_rgba(0,0,0,0.25)] bg-[#f9fafb]  mt-[80px] min-h-[845px] rounded-r-[0px] rounded-[0px]">
                    <p className="  text-[25px]  font-bold mt-44  mr-28">Settings</p>
                    <Link className=" mt-5   py-2  w-[257px] h-10  flex justify-center  bg-[#3b82f6] hover:scale-110   duration-300 text-white text-base border border-blue-600 font-bold" href={"/EditProfile"}> <span className="">Profile Settings</span></Link>
                    <Link className="text-base font-bold flex justify-center items-center  text-blue-600" href={"/listblocked"}><span className=" py-2 px-[96px] mt-10 bg-white border   hover:scale-110 duration-300">Blocked</span>
                    </Link>
                    <Link className="text-base font-bold flex justify-center items-center  text-blue-600" href={"/code_QR"}><span className=" py-2 px-[92px] mt-10 bg-white border   hover:scale-110 duration-300">Code_OR</span>
                    </Link>
                </div>
            </div>
            <div className=" hidden  md:flex  sm:flex-col justify-center items-center md:opacity-150 bg mt-[80px] min-h-[845px]  bg-blue-50  w-[700px] h-16 rounded-2xl rounded-s-[1px] p-6" >
                <div className="h-10   flex  bg-blue-600 drop-shadow shadow-lg  rounded-lg  w-auto">
                    <span className=" py-2 px-[102px] font-bold flex  text-sm text-white">Edit Your Personal Setting</span>
                </div>
                <div>
                </div>
                <div className=" flex flex-row  mt-28  space-x-5   ">
                    <div className="  flex justify-center items-center font-bold text-sm  drop-shadow shadow-lg bg-blue-600  h-8 w-44  rounded-lg    text-white">Choose photo</div>
                    <form>

                        <input onChange={handleFileChange}

                            className=" p-2   bg-white rounded-lg  -mt-2   drop-shadow shadow-lg  dark:text-gray-900  dark:white  mb-4  h-12 flex justify-center items-center  w-96 borser border-black
                                file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                             file:bg-blue-600 file:h-8 file:text-white 
                                             hover:file:bg-violet-100"
                            type="File" accept="/image/*" name="File" placeholder="Name" />
                    </form>
                </div>
                <div className="flex flex-row space-x-5 mt-8    ">
                    <div className=" flex justify-center items-center font-bold text-sm   drop-shadow shadow-lg bg-blue-600  h-8 w-44  rounded-lg    text-white">Full Name</div>
                    <input onChange={(e) => setupdate_name(e.target.value)} className="p-2  rounded-lg  drop-shadow shadow-lg -mt-2 text-black  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="text" name="text" placeholder="Name" />
                </div>
                <div className="flex flex-row mt-12  space-x-5   ">
                    <div className="  flex justify-center items-center font-bold text-sm   drop-shadow shadow-lg bg-blue-600  h-8 w-44  rounded-lg    text-white ">Email</div>
                    <input onChange={(e) => setupdate_email(e.target.value)} className="p-2  rounded-lg  drop-shadow shadow-lg -mt-2 text-black  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="Email" name="Email" placeholder="Email" />
                </div>

                <div className="flex flex-row  mt-12  text-sm  space-x-5  ">
                </div>
                <button className="bg-blue-600  mt-16    drop-shadow shadow-lg    w-80 rounded-lg text-white py-2 hover:scale-105 hover:bg-blue-600 duration-500 " onClick={handleSubmit}>Save Changes</button>
            </div>
            <div className="md:hidden flex-none    flex flex-col justify-center items-center md:opacity-150  min-h-[845px] w-full  ml-5 sm:min-w-[200px] bg-blue-50 sm:w-[500px] h-16 rounded-2xl  p-6" >
                <div className="h-10   flex  bg-blue-600 drop-shadow shadow-lg  mt-20 rounded-lg  w-auto">
                    <span className=" py-2 px-[102px] font-bold flex  text-sm text-white ">Edit Your Personal Setting</span>
                </div>
                <div>
                </div>
                <div className=" flex flex-col   mt-16  space-y-10   ">
                    <div className="   font-bold text-sm  drop-shadow shadow-lg bg-blue-600  h-10 mt-1 rounded-lg    flex justify-center items-center  text-white">Choose photo</div>
                    <form>
                        <input onChange={handleFileChange}
                            className=" p-2   bg-white rounded-lg  -mt-4   drop-shadow shadow-lg  dark:text-gray-900  dark:white  mb-4  h-12 flex justify-center items-center  w-96 borser border-black
                                file:rounded-full file:border-0
                                    file:text-sm file:font-semibold
                             file:bg-blue-600 file:h-8 file:text-white 
                                             hover:file:bg-violet-100"
                            type="File" accept="/image/*" name="File" placeholder="Name" />
                    </form>
                </div>
                <div className="flex flex-col space-y-5 mt-6   ">
                    <div className="  flex drop-shadow shadow-lg  bg-blue-600 h-10 font-bold text-sm  rounded-lg  justify-center items-center text-white">Full Name</div>
                    <input onChange={(e) => setupdate_name(e.target.value)} className="p-2  rounded-lg  -mt-2 text-black borsder  border-black drop-shadow shadow-lg  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="text" name="text" placeholder="Name" />
                </div>
                <div className="flex flex-col mt-10  space-y-5   ">
                    <div className="  flex drop-shadow shadow-lg  bg-blue-600   h-10 font-bold text-sm  rounded-lg  justify-center items-center text-white">Email</div>
                    <input onChange={(e) => setupdate_email(e.target.value)} className="p-2  rounded-lg   text-black borsder  border-black drop-shadow shadow-lg  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="Email" name="Email" placeholder="Email" />
                </div>
                <button className="bg-blue-700  mt-10     w-72 rounded-lg drop-shadow shadow-lg  text-white py-2 hover:scale-105 " onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    );
};

export default EditProfile;