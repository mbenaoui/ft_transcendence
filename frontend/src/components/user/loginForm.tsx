
import Link from "next/link";
import {  useState } from "react";
import * as z from 'zod';
import {  checklogin } from "@/hooks/userHooks";
import { Constant } from "@/constants/constant";
import { useRouter } from "next/router";

export default function LoginForm() {
  checklogin();

  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [TwoFactor, setTwoFactor] = useState("");
  const [validationErrors, setvalidationErrors] = useState<any>("");
  const [tfofocot, settfofocot] = useState(0);
  const [error, seterror] = useState(0);
 
  const formData = {
    email: email,
    password: password
  };
  const handleIntraLogin = () => {
  
    const how = window.location.replace(`${Constant.API_URL}/auth/42`);
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    const FormSchema = z
      .object({
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
          .string()
          .min(1, 'Password is required')
          .min(8, 'Password must have than 8 characters'),
      })
    const validationResult = FormSchema.safeParse(formData);

    if (validationResult.success) {
      // Form data is valid
      const validatedData = validationResult.data;
    } else {
      // Form data is invalid
      const validationErrors = validationResult.error.flatten();
      seterror(1);
      console.error('Validation errors:', validationErrors);
      const form = e.target;
      form.reset();
      return;
    }

    try {
      const res = await fetch(`${Constant.API_URL}/auth/signin`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          "email": email,
          "username": "",
          "lastName": "",
          "password": password,
          foto_user: "",
          twoFactorSecret: TwoFactor
        }),
      });
      const content = await res.json();

      if (content.status == 200 && res.ok) {

        router.push('/');
      }
      else if (content.status == 201 && res.ok) {
        settfofocot(1);
      }
      else {
        seterror(1);
        const form = e.target;
        form.reset();
        return;
      }

    } catch (error) {
      seterror(1);
      const form = e.target;
    }
  }
  return (
    <>
      {

        tfofocot == 0 ?
          (<section className="bg-gray-50 min-h-screen flex font-semibold justify-center">
            {/* login container */}
            <div className={`bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center`}>
              {/* form */}
              <div className="md:w-1/2 px-8 md:px-16">
                <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
                {
                  error == 0 && <p className="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

                }
                {
                  error == 1 &&
                  <div className=" bg-red-600 mt-4 drop-shadow-md  flex justify-center items-center     rounded-md  w-60 h-10">
                    <p className="text-md mdt-4 text-white">Login or password  is invalid </p>
                  </div>

                }

                <form onSubmit={handleSubmit} className="flex -mt-3 flex-col gap-4">
                  <input required onChange={(e) => setEmail(e.target.value)} className="p-2 mt-8 rounded-xl border w-full" type="email" name="email" placeholder="Email" />
                  <div className="relative">
                    <input required onChange={(e) => setPassword(e.target.value)} className="p-2 rounded-xl border w-full" type="password" name="password" placeholder="Password" />
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                      <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                      <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
                    </svg>
                  </div>
                  <button className="bg-[#002D74] transition-all active:scale-100 rounded-xl text-white py-2 hover:scale-105 ">Login</button>
                </form>

                <div className="mt-6 grid grid-cols-3 items-center text-gray-400">
                  <hr className="border-gray-400" />
                  <p className="text-center text-sm">OR</p>
                  <hr className="border-gray-400" />
                </div>
                <button onClick={handleIntraLogin} className="bg-white border py-2 w-full rounded-xl mt-5 flex justify-center items-center text-sm hover:scale-105 duration-300 text-[#002D74]">
                  Login with Intra
                  <svg xmlns="http://www.w3.org/2000/svg" width="25px" height="25px" viewBox="0 0 48 48">
                    <text x="10" y="36" fontFamily="Arial, sans-serif " fontSize="30" fill="black" >
                      <tspan fill="blue font-semibold">4</tspan>
                      <tspan fill="green font-semibold">2</tspan>
                    </text>
                  </svg>

                </button>
                <div>
                  <Link className="mt-3 text-xs flex justify-between items-center text-[#002D74]" href={"/register"}> Don't have an account ? <span className="underline py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Register</span>
                  </Link>
                </div>
              </div>
              <div className="md:block hidden w-1/2">
                <img className="rounded-2xl w-[1000px] h-[500px]" src="https://i.pinimg.com/originals/95/bf/ae/95bfae2de987bf5694a00092142a3dd6.gif" alt="Login" />
              </div>
            </div>
          </section>) :
          (
            <div className=' flex z-10  bg-[/game/click-to-start-3.gif]  h-screen w-full  justify-center bg-bldack items-center ' >

              <div className='flex  justify-center flex-col  h-80  w-[500px]  -ml-12 z-20  drop-shadow-2xl  border-2 border-blue-500 rounded-2xl  items-center text-black bg-white '>
                <p className=' text-xl  '> Please Enter Two-Factor Code?</p>
                <input onChange={(e) => setTwoFactor(e.target.value)} className="p-2  rounded-xl mt-6 text-gray-900 border border-gray-900 rouncursor-pointer bg-gray-50 dark:text-gray-400 focus:outline-none dark:bg-gray-700 dark:border-gray-600 ml-4 w-72" type="code" name="text" placeholder="code" />
                <button onClick={handleSubmit} className=' flex justify-center items-center text-black mt-8 w-56 h-10 rounded-2xl  border-2 bg-white  border-blue-500 hover:scale-110 duration-300' >Enter</button>

              </div>
            </div>

          )
      }
    </>
  );
}

