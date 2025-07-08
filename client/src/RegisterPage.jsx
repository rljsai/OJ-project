import {Link } from 'react-router-dom';
import logo from "./utilities/logo.png"
import axios from 'axios';
import dotenv from 'dotenv';
dotenv.config();

const SERVER_URL=process.env.BACKEND_SERVER_URL;

function RegisterPage() {
    const handleRegister = async()=>{
        axios.post(`${SERVER_URL}/register`,{
            username:username,
            email:email,
            password:password,
            confirm_password:confirm_password
        });
    }

    return (
        <section class="min-h-screen bg-gray-50 dark:bg-[#0d0315]">
        <div class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">


            <div class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                <div class="p-6 space-y-4 md:space-y-6 sm:p-8">

                    <div className="flex justify-center">
                        <a href="#" className="flex items-center mb-6 text-3xl font-extrabold text-gray-900 dark:text-white">
                            <img className="w-10 h-10 mr-3" src={logo} alt="logo" />
                            CodeShiruken
                        </a>
                    </div>

                    <form class="space-y-4 md:space-y-6" action="#">
                        <div>
                            <label for="username" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Username</label>
                            <input type="text" name="username" id="username" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Create Username" required="" />
                        </div>
                        <div>
                            <label for="email" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Your email</label>
                            <input type="email" name="email" id="email" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="name@company.com" required="" />
                        </div>
                        <div>
                            <label for="password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                            <input type="password" name="password" id="password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>
                        <div>
                            <label for="confirm-password" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Confirm password</label>
                            <input type="confirm-password" name="confirm-password" id="confirm-password" placeholder="••••••••" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" required="" />
                        </div>

                        <button
                            type="submit"
                            className="w-full text-white bg-[#A020F0] focus:ring-4 focus:outline-none focus:ring-[#A020F0] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            onClick={handleRegister}
                        >
                            Sign Up
                        </button>

                        <p className="text-sm font-light text-gray-500 dark:text-gray-400 text-center">
                            Already have an account?{" "}
                            <Link to="/" className="font-medium text-[#A020F0] hover:underline">
                                Login here
                            </Link>
                        </p>

                    </form>
                </div>
            </div>
        </div>
    </section>

    )
}

export default RegisterPage
