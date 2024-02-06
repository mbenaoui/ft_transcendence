import { useRouter } from "next/navigation";
import { useState } from "react"
import { checkAuth, checklogin } from "@/hooks/userHooks";import { Constant } from "@/constants/constant";
;


interface LevelBarpros {
  value: number
}
function LevelBar({ value }: LevelBarpros) {

  const progressWidth = `${value}%`;

  return (
    <div className="bg-white h-5  drop-shadow-lg  shadow-indigo-500/40    w-80 rounded-2xl">
      <div className="bg-[#0ea5e9] h-5 rounded-full " style={{ width: progressWidth }}>
        {/* <span className="absolute inset-0 flex items-center justify-center text-white font-bold">
              {`${value}%`} */}
        {/* </span> */}
      </div>
    </div>
  );
}
const YourComponent = ({ currentFileName, currentUser }: any) => {
  checklogin();

  const [TwoFactor, setTwoFactor] = useState("");
  const router = useRouter();

  const handleTwoFactorVerification = async (e: any) => {
    // Call your backend API to verify the 2FA code
    // For example, using fetch or axios
    try {
      const res = await fetch(`${Constant.API_URL}/auth/verify-2fa`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          email: 'example@email.com', // Replace with actual email
          password: 'userPassword',    // Replace with actual password
          username: 'exampleUsername',  // Replace with actual username
          lastName: 'exampleLastName',  // Replace with actual lastName
          foto_user: currentFileName,     // Replace with actual foto_user
          twoFactorSecret: TwoFactor,    // Assuming TwoFactor is the 2FA code entered by the user
        }),
      });
      const content = await res.json();
      if (res.ok) {
        router.push('/');
      }

      else {
        return;
      }

    } catch (error) {

    }

  }
  return (
    <div className=' flex z-10  h-screen w-screen  justify-center items-center '>

      <div className='flex  justify-center flex-col  h-96  w-[500px]  ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-black bg-white '>
        <p className=' text-xl  '> Please Enter Two-Factor Code?</p>
        <input onChange={(e) => setTwoFactor(e.target.value)} className="p-2  rounded-xl mt-6 text-gray-900 border border-gray-900 rouncursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 ml-4 w-72" type="code" name="text" placeholder="code" />
        <button onClick={handleTwoFactorVerification} className=' flex justify-center items-center text-black mt-8 w-56 h-10 rounded-2xl  border-2 bg-white  border-blue-500 hover:scale-110 duration-300' >Enter</button>
      </div>
    </div>
  );

}
export async function getServerSideProps(context: any) {
  // const currentFileName = path.basename(__filename);
  const currentFileName = context.query.user;

  return {
    props: {
      currentFileName,
    },
  };
}
export default YourComponent;