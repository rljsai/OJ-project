
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LoginPage from './LoginPage.jsx';
import RegisterPage from './RegisterPage.jsx';
import ForgotPasswordPage from './ForgotPasswordPage.jsx';
import ResetPasswordPage from './ResetPasswordPage.jsx';
import ProblemPage from './ProblemPage.jsx';
import ProfilePage from './ProfilePage.jsx';
import UserHome from './UserHome.jsx';
function App() {
    return (
     <Router>
        <Routes>
            <Route path="/" element={<LoginPage/>}/>
            <Route path="/register" element={<RegisterPage/>}/>
            <Route path="/forgot-password" element={<ForgotPasswordPage/>}/>
            <Route path="/reset-password" element={<ResetPasswordPage/>}/>
            <Route path="/problem" element={<ProblemPage/>}/>
            <Route path="/profile" element={<ProfilePage/>}/>
            <Route path="/user-home" element={<UserHome/>}/>
        </Routes>
     </Router>

    )
}

export default App
