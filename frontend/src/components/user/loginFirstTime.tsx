

import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import {  userProps } from "@/interface/data";
import { Constant } from "@/constants/constant";

const LoginFirstTime = ({ setfrist_login, currentUser }: { setfrist_login: (frist_login: boolean) => void, currentUser: userProps }) => {

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
                handelFirstLogin()
                router.push('/');
            } else {
                handelFirstLogin()
                router.push('/');
            }
        } catch (error) {
            router.push('/');
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
                } catch (error) {
                }
            }
        )();
    }, []);
    useEffect(() => {
        (
            async () => {

                if (!update_foto_user)
                    setupdate_foto_user(foto_user)
                if (!update_email)
                    setupdate_email(email);
                if (!update_name)
                    setupdate_name(username);
            }
        )();
    });
    const handelFirstLogin = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/users/firstTime`, {
                method: 'POST',
                credentials: 'include',
            });
            if (response.ok) {
                setfrist_login(false)
            }
        } catch (error) {

        }
    }
    return (

        <div className='flex   flex-wrap  justify-center  min-h-screen  w-full items-center  '>

            <div className=" hidden relative md:flex  sm:flex-col justify-center items-center md:opacity-150 bg mt-[80px] min-h-[845px]  bg-blue-50  w-[700px] h-16 rounded-2xl  p-6" >
                <button onClick={handelFirstLogin} className=" absolute w-10 h-10 top-4 right-4 flex justify-center items-center">
                    <img src={'/clean.png'} width={40} height={40} alt="clean" />
                </button>
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
                   <div className=" flex justify-center items-center font-bold text-sm   drop-shadow shadow-lg bg-blue-600  h-8 w-44  rounded-lg    text-white">username</div>
                    <input onChange={(e) => setupdate_name(e.target.value)} className="p-2  rounded-lg  drop-shadow shadow-lg -mt-2 text-black  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="text" name="text" placeholder="Name" />
                </div>
                <div className="flex flex-row  mt-12  text-sm  space-x-5  ">
                </div>
                <button className="bg-blue-600  mt-16    drop-shadow shadow-lg    w-80 rounded-lg text-white py-2 hover:scale-105 hover:bg-blue-600 duration-500 " onClick={handleSubmit}>Save Changes</button>
            </div>
            <div className="md:hidden flex-none    flex flex-col justify-center items-center md:opacity-150  min-h-[845px] w-full   sm:min-w-[200px] bg-blue-50 sm:w-[500px] h-16 rounded-2xl  p-6" >
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

                    <div className="  flex drop-shadow shadow-lg  bg-blue-600 h-10 font-bold text-sm  rounded-lg  justify-center items-center text-white">Username</div>
                    <input onChange={(e) => setupdate_name(e.target.value)} className="p-2  rounded-lg  -mt-2 text-black borsder  border-black drop-shadow shadow-lg  rouncursor-pointer bg-white dark:text-black focus:outline-none dark:bg-white dark:border-black h-12 w-96" type="text" name="text" placeholder="Name" />
                </div>
                <button className="bg-blue-700  mt-10     w-72 rounded-lg drop-shadow shadow-lg  text-white py-2 hover:scale-105 " onClick={handleSubmit}>Save Changes</button>
            </div>
        </div>
    )
};

export default LoginFirstTime;
