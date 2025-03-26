"use client"
import React, { useState } from 'react'
import { Button } from '../ui/button'

  

const LoginModal = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ name, setName ] = useState('');

    const handleLogin = async () => {
        try {
            const res = await fetch("http://localhost:8000/api/auth/signup", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();
            if (res.ok) {
                console.log("Login successful:", data);
                alert("Logged in successfully!");
                localStorage.setItem("token", data.user.token);
            } else {
                alert(data.message || "Login failed");
            }
        } catch (error) {
            console.error("Error logging in:", error);
        }
    };
    // console.log(LOGIN_URL);
    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-300">
            <div className='rounded-xl flex flex-col bg-white p-5 w-lg'>
                <input
                        className='p-2 m-3 outline-2 rounded-md'
                        placeholder='Name'
                        type="name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                />
                <input
                    className='p-2 m-3 outline-2 rounded-md'
                    placeholder='Email'
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    className='p-2 m-3 outline-2 rounded-md'
                    placeholder='Password'
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Button onClick={handleLogin}>Sign In</Button>
            </div>
        </div>
    )
}

export default LoginModal
