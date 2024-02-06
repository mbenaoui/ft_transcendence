'use client'
import Link from "next/link";
import * as z from 'zod';
import { useState } from "react";
import { useRouter } from 'next/navigation';
import { checklogin } from "@/hooks/userHooks";
import { Constant } from "@/constants/constant";
// import LoginFrom from './LoginForm'

// import { Provider } from 'next-auth/client';


// import RegisterForm from '../components/RegisterForm';

// import React from 'react';
// export default LoginForm;
export default function RegisterForm() {

  checklogin();

  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [configPassword, setConfigPassword] = useState("");
  const [error, setError] = useState<any>("");
  const [gender, setGender] = useState('');
  const formData = {
    username: name,
    email: email,
    password: password,
    confirmPassword: configPassword, // Doesn't match 'password123'
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const FormSchema = z
      .object({
        username: z.string().min(1, 'Username is required').max(15),
        email: z.string().min(1, 'Email is required').email('Invalid email'),
        password: z
          .string()
          .min(1, 'Password is required')
          .min(8, 'Password must have than 8 characters'),
        confirmPassword: z.string().min(1, 'Password confirmation is required'),
      })
      .refine((data) => data.password === data.confirmPassword, {
        path: ['confirmPassword'],
        message: 'Password do not match',
      });

    const validationResult = FormSchema.safeParse(formData);

    if (validationResult.success) {
      // Form data is valid
      const validatedData = validationResult.data;
    } else {
      // Form data is invalid
      const validationErrors = validationResult.error.flatten();
      // flattenedErrors.formErrors,
      // flattenedErrors.fieldErrors,
      setError(validationErrors.fieldErrors.username || validationErrors.fieldErrors.email || validationErrors.fieldErrors.password || validationErrors.fieldErrors.confirmPassword);
      console.error('Validation errors:', validationErrors);
      const form = e.target;
      form.reset();
      return;
    }
    try {
      const res = await fetch(`${Constant.API_URL}/auth/signup`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          "email": email,
          "username": name,
          "lastName": name,
          "password": password,
          "foto_user": gender,
          "twoFactorSecret": "",

        }),
      });

      if (res.status == 201) {
        const form = e.target;
        form.reset();
        router.push('/auth/login');
      } else {
        const form = e.target;
        form.reset();
        setError("This user already exists");
      }

    } catch (error) {
      const form = e.target;
      form.reset();
    }
  };
  return (
    <section className="bg-gray-50 min-h-screen flex items-center justify-center">
      {/* login container */}
      <div className="bg-gray-100 flex rounded-2xl shadow-lg max-w-3xl p-5 items-center">
        {/* form */}
        <div className="md:w-1/2 px-8 md:px-16">
          <h2 className="font-bold text-2xl text-[#002D74]">Login</h2>
          <p className="text-xs mt-4 text-[#002D74]">If you are already a member, easily log in</p>

          <form onSubmit={handleSubmit} action="" className="flex flex-col gap-4">
            <input required onChange={(e) => setName(e.target.value)} className="p-2 mt-4 rounded-xl border w-full" type="text" name="text" placeholder="Name" />
            <input required onChange={(e) => setEmail(e.target.value)} className="p-2 mt-2 rounded-xl border w-full" type="email" name="email" placeholder="Email" />
            <div className="relative">
              <input required onChange={(e) => setPassword(e.target.value)} className="p-2  mt-2  rounded-xl border w-full" type="password" name="password" placeholder="Password" />
              <input required onChange={(e) => setConfigPassword(e.target.value)} className="p-2 mt-5 rounded-xl border w-full" type="password" name="password" placeholder="Config Password" />
              {/* <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="gray" className="bi bi-eye absolute top-1/2 right-3 -translate-y-1/2" viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8zM1.173 8a13.133 13.133 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13.133 13.133 0 0 1 14.828 8c-.058.087-.122.183-.195.288-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5c-2.12 0-3.879-1.168-5.168-2.457A13.134 13.134 0 0 1 1.172 8z" />
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5zM4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0z" />
              </svg> */}
              <label>
                <select required value={gender} onChange={(e) => setGender(e.target.value)} className="p-2 mt-5 rounded-xl border w-full" >
                  <option value="">Select gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                </select>
              </label>
            </div>
            <button className="bg-[#002D74] rounded-xl text-white py-2 hover:scale-105 ">Register</button>
            {error && (
              <div className=" bg-[#003D74] text-white w-fit textt-s, py-2 px-2  hover:scale-105 rounded-xl mt-2">
                {error}
              </div>
            )}
          </form>
          <div>
            <Link className="mt-3 text-xs flex justify-between items-center text-[#002D74]" href={"/auth/login"}> Already have an account ? <span className="underline py-2 px-5 bg-white border rounded-xl hover:scale-110 duration-300">Login</span>
            </Link>
          </div>
        </div>

        {/* image */}
        <div className="md:block hidden w-1/2">
          <img className="rounded-2xl" src="https://images.unsplash.com/photo-1616606103915-dea7be788566?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=1887&q=80" alt="Login" />
        </div>
      </div>
    </section>
  );
}