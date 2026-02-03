import React, { useState } from "react";
import "./Login.css";
import loginImage from "../assets/img7.png";
import { ToastContainer, toast } from 'react-toastify';
import { useNavigate } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';

export function Login() {
    
    const [MobileNo, setMobileNo] = useState("");
    const [role, setRole] = useState("");
    const [otp, setOtp] = useState("");
    const [GenerateOtp, setGenerateOtp] = useState("");
    const [loading, setLoading] = useState(false);

    const [MobileNovalidation, setMobileNovalidation] = useState("");
    const [roleValidation, setRoleValidation] = useState("");
    const [otpValidation, setOtpValidation] = useState("");

    const navigate = useNavigate();

    const handleGenerateOtp = (event) => {
        event.preventDefault();
        const random = Math.floor(1000 + Math.random() * 9000).toString();
        setGenerateOtp(random);
        setOtp(random); 
        alert("One Time Password: " + random);
    };

    const handleMobileNochange = (event) => {
        setMobileNo(event.target.value);
        setMobileNovalidation("");
    };

    const handleRolechange = (event) => {
        setRole(event.target.value);
        setRoleValidation("");
    };

    const handleOtpChange = (event) => {
        setOtp(event.target.value);
        setOtpValidation("");
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        let isValid = true;
        if (!MobileNo) { setMobileNovalidation("Mobileno is required"); isValid = false; }
        if (!role) { setRoleValidation("Role is required"); isValid = false; }
        if (!otp) { setOtpValidation("otp is required"); isValid = false; }

        if (!isValid) return;

        if (GenerateOtp !== otp) {
            toast.error("Invalid OTP");
            return;
        }

        try {
            setLoading(true);
            // ખાતરી કરજો કે આ URL સાચું છે અને MockAPI માં 'users' રિસોર્સ બનેલો છે.
            const url = 'https://696b4a91624d7ddccaa0b716.mockapi.io/users';

            const getRes = await fetch(url);
            
            if (!getRes.ok) {
                throw new Error("API URL error or Resource not found (404)");
            }

            const users = await getRes.json();
            
            const existingUser = Array.isArray(users) && users.find(
                (u) => u.mobilenumber === MobileNo && u.role === role
            );

            if (existingUser) {
                toast.success("Login Successfully");
                localStorage.setItem("logindata", JSON.stringify(existingUser));
                setLoading(false);
                navigate("/");
                return;
            }

            const formData = {
                mobilenumber: MobileNo,
                role: role,
                otp: otp,
            };

            const response = await fetch(url, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                toast.error("Invalid Request");
                setLoading(false);
                return;
            }

            const data = await response.json();
            toast.success("Login Successfully");
            localStorage.setItem("logindata", JSON.stringify(data));
            setLoading(false);
            navigate("/");

        } catch (error) {
            console.error("Error:", error);
            toast.error("Something went wrong! API issue.");
            setLoading(false);
        }
    };

    return (
        <div className="login-container">
            <div className="login-left">
                <img src={loginImage} alt="LoginIllustration" />
            </div>
            <div className="login-right">
                <h2>Hello Again,</h2>
                <p className="subtitle">Welcome back, let's get started!👋</p>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Mobile Number"
                        className="input-field"
                        maxLength={10}
                        onChange={handleMobileNochange}
                        value={MobileNo}
                    />
                    {MobileNovalidation && <p className="error-text">{MobileNovalidation}</p>}

                    <select
                        className="input-field"
                        value={role}
                        onChange={handleRolechange}
                    >
                        <option value="">Select a Role</option>
                        <option value="admin">Admin</option>
                        <option value="user">User</option>
                    </select>
                    {roleValidation && <p className="error-text">{roleValidation}</p>}

                    <button className="btn primary" type="button" onClick={handleGenerateOtp} disabled={loading}>
                        Generate OTP
                    </button>

                    <input
                        type="text"
                        placeholder="Enter OTP"
                        className="input-field"
                        maxLength={4}
                        value={otp}
                        onChange={handleOtpChange}
                    />
                    {otpValidation && <p className="error-text">{otpValidation}</p>}

                    <button className="btn secondary" type="submit" disabled={loading}>
                        {loading ? "Logging in..." : "Login"}
                    </button>
                    <ToastContainer />
                </form>
            </div>
        </div>
    );
}

export default Login;