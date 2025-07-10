import {Link,useNavigate } from 'react-router-dom';
import { useState } from 'react';
import logo from "./utilities/logo.png"
import axios from 'axios';

const SERVER_URL=import.meta.env.VITE_BACKEND_SERVER_URL;

function LoginPage() {
     const navigate=useNavigate();
    const [email,set_email]=useState('');
    const [password,set_password]=useState('');
    const [errorMessage,set_errorMessage]=useState('');

     const handleSignin = async(e)=>{
        e.preventDefault();
        try{
          const response= await  axios.post(`${SERVER_URL}/login`,{
            email:email,
            password:password,
        });
        if(response.status===200){

            const token = response.data.token;

           
            localStorage.setItem("authToken", token);
            navigate('/user-home');
        }
        }catch(error){
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message;
            set_errorMessage(backendMessage);
            console.error("Sign In failed:", backendMessage);
        }
}
    return (

        <section className="min-h-screen bg-gray-50 dark:bg-[#0D0315]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">


                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex justify-center">
                            <a href="#" className="flex items-center mb-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                                <img className="w-10 h-10 mr-3" src={logo} alt="logo" />
                                CodeShiruken
                            </a>
                        </div>

                        <form
                        className="space-y-4 md:space-y-6"
                        action="#"
                        onSubmit={handleSignin}>

                            <div>
                                <label
                                htmlFor="email"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Your email
                                    </label>
                                <input
                                type="email"
                                name="email"
                                id="email"
                                value={email}
                            onChange={(e) => set_email(e.target.value)}
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                placeholder="name@company.com" required="" />
                            </div>
                            <div>
                                <label
                                htmlFor="password"
                                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">
                                    Password
                                    </label>
                                <input
                                type="password"
                                name="password"
                                id="password"
                                 value={password}
                            onChange={(e) => set_password(e.target.value)}
                                placeholder="••••••••"
                                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                required="" />
                            </div>

{/* Error message shown to user */}
                            {errorMessage && (
                                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full text-white bg-[#A020F0] focus:ring-4 focus:outline-none focus:ring-[#A020F0] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Sign In
                            </button>

                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                Does not have account?{" "}
                                <Link to="/register" className="font-medium text-[#A020F0] hover:underline">
                                    Sign Up
                                </Link>
                            </p>
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                                <Link to="/forgot-password" className="font-medium text-[#A020F0] hover:underline ">
                                    Forgot Password?
                                </Link>

                            </p>

                        </form>
                    </div>
                </div>
            </div>
        </section>


    )
}

export default LoginPage