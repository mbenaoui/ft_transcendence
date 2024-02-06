import Link from "next/link";
import React, { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";
import { userProps } from "@/interface/data";
import QRCode from 'qrcode.react';
import { Constant } from "@/constants/constant";
import { extractdecimalNumberFromLevel, getLevel } from "./editProfile";
import Image from "next/image";
import { getTheGrad } from "../game/listOfFriends";

interface LevelBarpros {
    value: string
}
function LevelBar({ value }: LevelBarpros) {
    let progressWidth;
    if (value.length > 1)
        progressWidth = `${value}%`;
    else
        progressWidth = `${value}0%`;
    return (
        <div className="bg-white h-5  drop-shadow shadow-md shadow-black    w-80 rounded-2xl">
            <div className="bg-[#0ea5e9] h-5 rounded-full " style={{ width: progressWidth }}>
            </div>
        </div>
    );
}

const Code_QR = () => {
    const [email, setEmail] = useState("");
    const [foto_user, setFoto_user] = useState("");
    const [username, setUsername] = useState("");
    const [twoFactorSecret1, settwoFactorSecret1] = useState("");
    const [level, setlevel] = useState();
    const [level1, setlevel1] = useState("");
    const [level2, setlevel2] = useState("");
    const [id, setid] = useState(0);
    const [twoFactorSecret, setTwoFactorSecret] = useState('');
    const [TwoFactor, setTwoFactor] = useState("");
    const [success, setSuccess] = useState(0);
    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${Constant.API_URL}/auth/user`, {
                    credentials: 'include',
                });
                const content = await response.json();
                setFoto_user(content.foto_user);
                setid(content.id);
                setEmail(content.email);
                setUsername(content.username)
                settwoFactorSecret1(content.twoFactorSecret);
                setlevel(content.level)
                const stringValue2: string = String(level);
                const level3 = stringValue2.split('.');
                if (level3[1])
                    setlevel1(level3[1]);
                else
                    setlevel1("0");
                setlevel2(level3[0]);
            }
        )();
    });

    useEffect(() => {
        (
            async () => {
                const response = await fetch(`${Constant.API_URL}/users/enable-2fa`, {
                    method: 'POST',
                    credentials: 'include',
                    headers: {
                        'Content-Type': 'application/json',
                    }
                })
                const counte = await response.json();

                setTwoFactorSecret(counte.secret);
            }
        )();
    }, [id]);

    const handleEnable2FA = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/users/enable-2fa`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const counte = await response.json();
            setTwoFactorSecret(counte.secret);
        } catch (error) {
            console.error('Error enabling 2FA:', error);
        }
    };
    const DeactivateTwoFactor = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/users/DeactivateTwoFactor`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            if (response.ok) {
                const counte = await response.json();
                setSuccess(2)

            }
        } catch (error) {
            console.error('Error enabling 2FA:', error);
        }
    };
    const handleEnable2FA1 = async () => {
        try {
            const response = await fetch(`${Constant.API_URL}/auth/set-2fa/${id}/${TwoFactor}`, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                }
            })
            const counte = await response.json();
            if (response.ok) {
                setSuccess(1);
            }
        } catch (error) {
            console.error('Error enabling 2FA:', error);
        }
    };
    return (
        <div className='flex  flex-wrap  justify-center  min-h-screen  bg-blfack w-full items-center   '>
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
                        <LevelBar value={String(extractdecimalNumberFromLevel(Number(level)))} />
                        <p className=' mt-4 text-white shadow-sm shadow-black   w-28   uppercasej'>level : {getLevel(Number(level))}</p>
                    </div>
                    <div className=" hidden md:flex  bg  flex-col   items-center ">
                        <div className='mt-6 flex  flex-col items-center'>
                            <Link className="text-base font-bold flex justify-center items-center ml-4 text-blue-600" href={"/profile"}><span className=" py-2 px-32 bg-white  shadow-sm shadow-black   border rounded-xl hover:scale-110 duration-300">Profile</span>
                            </Link>
                            <h1 className="flex  mt-[40px] ">Recent Activities</h1>
                            <div className={`${Number(level) < 5 ? `w-80` : 'w-60'} mt-6 h-60   flex items-center justify-center relative`}>
                                <Image fill style={{ objectFit: "cover" }} className='' src={getTheGrad(Number(level))} alt='grad'></Image>
                            </div>
                        </div>
                    </div>
                    <div className=" md:hidden flex  justify-center w-full items-center flex-col mdl-6 ">
                        <Link className="text-base font-bold flex justify-center mt-6 mdr-8 items-center  bg-bslack w-80 h-12 msl-4 text-blue-600" href={"/profile"}><span className=" w-full flex  justify-center items-center  h-full sm:py-2 sm:px-32 bg-white  shadow-sm shadow-black   border rounded-xl hover:scale-110 duration-300">Profile</span>
                        </Link>

                        <div className='mt-6 w-full justify-center   flex-col flex bg-blarck items-center'>
                            <p className="     text-2xl  dmr-52">Settings</p>
                            <Link className=" mt-6   w-80   rounded-xl  h-12  flex justify-center  items-center bg-white hover:scale-110 drop-shadow shadow-md shadow-black  duration-300 text-blue-600 text-sm font-bold" href={"/editProfile"}> <span className=" flex flex-row  " >Profile_Settings</span></Link>
                            <Link className="text-base w-80  h-12 font-bold flex justify-center items-center text-blue-600" href={"/listblocked"}><span className=" flex justify-center items-center  mt-10    w-full h-full  border-white  rounded-xl bg-white drop-shadow shadow-md shadow-black border  hover:scale-110 duration-300">Blocked</span>
                            </Link>
                            <Link className="text-base font-bold w-80 mt-5  h-12  flex justify-center items-center text-blue-600" href={"/code_QR"}><span className="  mt-10 bg-blue-600 flex justify-center text-white items-center w-full h-full      border-white rounded-xl border drop-shadow shadow-md shadow-black hover:scale-110 duration-300">Code_OR</span>
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
                    <Link className=" mt-5   py-2  w-[257px] h-10  flex justify-center   bg-white hover:scale-110   duration-300 border text-blue-600  text-base font-bold" href={"/editProfile"}> <span className="">Profile Settings</span></Link>
                    <Link className="text-base font-bold flex justify-center items-center text-blue-600" href={"/listblocked"}><span className=" py-2 px-[96px] mt-10 bg-white border  hover:scale-110 duration-300">Blocked</span>
                    </Link>
                    <Link className=" mt-5   py-2  w-[257px] h-10  flex justify-center  bg-[#3b82f6] hover:scale-110   duration-300 text-white text-base border border-blue-600 font-bold" href={"/code_QR"}> <span className="">Code_QR</span></Link>
                </div>
            </div>
            <div className=" flex  flex-col justify-center items-center md:opacity-150 bg xl:mt-[80px] min-h-[845px]  xl:bg-blue-50 w-full  sm:w-[700px] h-16 rounded-r-2xl rounded-s-[1px] p-2 sm:p-6" >
                <div className="flex shrink  flex-col overflow-y-scroll  scrollbar-hide drop-shadow shadow-md shadow-black rounded-lg  border-e border-black items-center bg-white   w-full sm:w-[500px] h-[800px]">
                    <div className=' flex justify-center flex-col items-center w-[500px] h-[500px]'>
                        <div className="  flex items-center justify-center flex-col  mt-32 w-96">
                            <div>
                                {success == 1 &&
                                    <div className=" npm bg-blue-600 w-80   flex justify-center items-center text-sm rounded-md h-10 text-white drop-shadow shadow-md shadow-black">Two-Factor active successfully!</div>
                                }
                                {
                                    success == 0 &&
                                    <div className=" flex text-blue-600 rounded-md bg-white w-80  drop-shadow shadow-md shadow-black h-10 justify-center items-center">Setting Two-Factor Authentication...</div>
                                }
                                {
                                    success == 2 &&
                                    <div className=" flex text-white rounded-md  bg-red-600 w-80  drop-shadow shadow-md shadow-black h-10 justify-center items-center">Two-Factor Deactivate successfully ..!</div>
                                }
                            </div>
                            <div className='flex  float-none justify-center items-center  w-[200px] h-[200px] drop-shadow shadow-md shadow-black bg-white border-2 border-black rounded-md mt-10 '>
                                {twoFactorSecret && <QRCode className="" value={twoFactorSecret} />}
                            </div>
                        </div>
                        <input onChange={(e) => setTwoFactor(e.target.value)} type="text" id="error" className="bg-red-50 border border-black   drop-shadow shadow-md   placeholder-red-700 text-sm rounded-lg focus:ring-red-500 dark:bg-white focus:border-blue-600 block w-20 p-2.5 mt-5 dark:text-black dark:placeholder-blue-600 dark:border-blue-600 dark:w-20" placeholder="code" />
                        <div>
                            <button className=' mt-8 bg-blue-600 h-10  w-80 rounded-lg text-white  hover:scale-110 duration-500  border  border-white  drop-shadow shadow-md shadow-black' onClick={handleEnable2FA}>Upadate Two-Factor</button>
                        </div>
                        <button onClick={handleEnable2FA1}>
                            <div className='flex justify-center  drop-shadow shadow-md shadow-black rounded-md  items-center mt-6 w-80 bg-blue-600 border hover:scale-110 duration-500  border-white text-white   h-10'>Enter</div>
                        </button>
                    </div>
                    {
                        twoFactorSecret1 && <button onClick={DeactivateTwoFactor} >
                            <div className="  flex justify-center items-center  w-80 drop-shadow shadow-md shadow-black rounded-md hover:scale-110 duration-500  text-red-600 h-10 mt-36">Deactivate two-factor</div>
                        </button>
                    }
                </div>
            </div>
        </div>


    );
};

export default Code_QR;