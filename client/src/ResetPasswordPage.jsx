import { useState } from "react"
import { useNavigate } from "react-router-dom";
import logo from "./utilities/logo.png"
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;


function ResetPasswordPage() {
    const navigate = useNavigate();
    const [password, set_password] = useState("");
    const [confirm_password, set_confirm_password] = useState("");
    const [errorMessage, set_errorMessage] = useState("");


    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const email = sessionStorage.getItem("otpEmail");
            const otp = sessionStorage.getItem("otp");
            const response = await axios.post(`${SERVER_URL}/forgot-password/reset`, {
                email: email,
                otp: otp,
                newPassword: password,
                confirmPassword:confirm_password

            });

            if(response.status===200){
                navigate("/");
            }

        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message;

            set_errorMessage(backendMessage);
        }
    }
    return (
        <section className="min-h-screen bg-gray-50 dark:bg-[#0d0315]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">

                        <div
                            className="flex justify-center">
                             <a
                                href="#"
                                className="flex items-center mb-6 text-3xl font-extrabold text-gray-900 dark:text-white"
                            >

                                <img
                                    className="w-10 h-10 mr-3"
                                    src={logo}
                                    alt="logo"
                                />

                                codeshuriken

                            </a>
                        </div>

                        <form
                            className="space-y-4 md:space-y-6"
                            action="#"
                            onSubmit={handleSubmit}>

                            <div>

                                <label
                                    for="password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >New Password
                                </label>

                                <input
                                    type="password"
                                    name="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) => set_password(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""
                                />

                            </div>

                            <div>

                                <label
                                    for="confirm-password"
                                    className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                                >Confirm New password
                                </label>

                                <input
                                    type="password"
                                    name="confirm-password"
                                    id="confirm-password"
                                    value={confirm_password}
                                    onChange={(e) => set_confirm_password(e.target.value)}
                                    placeholder="••••••••"
                                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-600 focus:border-primary-600 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                                    required=""
                                />

                            </div>
                            {/* Error message shown to user */}
                            {errorMessage && (
                                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full text-white bg-[#A020F0] focus:ring-4 focus:outline-none focus:ring-[#A020F0] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Reset Password
                            </button>


                        </form>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default ResetPasswordPage
