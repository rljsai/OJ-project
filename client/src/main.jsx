import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import LoginPage from './LoginPage.jsx'
import RegisterPage from './RegisterPage.jsx'
import ForgotPasswordPage from './ForgotPasswordPage.jsx'
import ResetPasswordPage from './ResetPasswordPage.jsx'
import HomePage from './HomePage.jsx'
createRoot(document.getElementById('root')).render(

    <HomePage/>

)
