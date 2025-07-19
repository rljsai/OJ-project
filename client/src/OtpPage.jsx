import { useState, useRef } from "react";
import logo from "./utilities/logo.png";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SERVER_URL = import.meta.env.VITE_BACKEND_SERVER_URL;

function OtpPage() {
   const navigate=useNavigate();
    const [otp, setOtp] = useState(["", "", "", "", "", ""]);
    const inputRefs = useRef([]);
    const [errorMessage, set_errorMessage] = useState('');
  


    const handleSubmit = async(e) => {
        e.preventDefault();
        if (otp.some((digit) => digit === "")) {
            set_errorMessage("Please enter the complete 6-digit OTP.");
            return;
        }

        try {
            const email = sessionStorage.getItem("otpEmail");
         
            
              const response=await axios.post(`${SERVER_URL}/forgot-password/verify-otp`,{email:email,otp:otp.join("")});
              if(response.status===200){
                sessionStorage.setItem("otpEmail", email);
                sessionStorage.setItem("otp", otp.join(""));
                navigate("/reset-password", {state:{email:email,otp:otp.join("")}});
              }
        } catch (error) {
            const backendMessage =
                error.response?.data?.message ||
                error.response?.data ||
                error.message;

            set_errorMessage(backendMessage);
        }



    };


    const handleChange = (e, idx) => {

        const value = e.target.value.replace(/\D/, ""); // Only digits
        if (value.length > 1) return;
        const newOtp = [...otp];
        newOtp[idx] = value;
        setOtp(newOtp);

        if (value && idx < 5) {
            inputRefs.current[idx + 1].focus();
        }
    };

    const handleKeyDown = (e, idx) => {
        if (e.key === "Backspace" && !otp[idx] && idx > 0) {
            inputRefs.current[idx - 1].focus();
        }
    };


    return (
        <section className="min-h-screen bg-gray-50 dark:bg-[#0d0315]">
            <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                    <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                        <div className="flex justify-center">
                            <a href="#"
                                className="flex items-center mb-6 text-3xl font-extrabold text-gray-900 dark:text-white">

                                <img
                                    className="w-10 h-10 mr-3"
                                    src={logo}
                                    alt="logo" />

                                codeshuriken

                            </a>
                        </div>

                        <p
                            className="text-sm text-gray-500 dark:text-gray-300 text-center mb-4">
                            Please enter the 6-digit code sent to your email.
                        </p>

                        <form
                            className="space-y-6"
                            onSubmit={handleSubmit}>

                            <div
                                className="flex gap-x-3 justify-center"
                                data-hs-pin-input="">

                                {otp.map((digit, idx) => (
                                    <input
                                        key={idx}
                                        type="text"
                                        inputMode="numeric"
                                        maxLength={1}
                                        className="block w-10 h-12 text-center border-2 border-gray-200 rounded-md sm:text-lg focus:border-[#A020F0] focus:ring-0 focus:outline-none disabled:opacity-50 disabled:pointer-events-none bg-gray-50 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                        value={digit}
                                        onChange={(e) => handleChange(e, idx)}
                                        onKeyDown={(e) => handleKeyDown(e, idx)}
                                        ref={(el) => (inputRefs.current[idx] = el)}
                                        autoFocus={idx === 0}
                                        data-hs-pin-input-item=""
                                    />
                                ))}

                            </div>
                            {/* Error message shown to user */}
                            {errorMessage && (
                                <p className="text-red-500 text-sm text-center">{errorMessage}</p>
                            )}
                            <button
                                type="submit"
                                className="w-full text-white bg-[#A020F0] focus:ring-4 focus:outline-none focus:ring-[#A020F0] font-medium rounded-lg text-sm px-5 py-2.5 text-center"
                            >
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default OtpPage;
