import React from "react";
import {useState} from "react";



function Login({ setRole }) {
    const [email, setEmail] = useState('');
    const [pass, setPass] = useState('');
    const [msg, setMsg] = useState('');

    const handleLogin = async () => {
        if (!email || !pass) {
            setMsg('Email and password are required');
            return;
        }
    
        try {
            const response = await fetch('http://localhost:3001/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, pass }),
            });
    
            const data = await response.json();
    
            if (response.ok) {
                setMsg(data.message);
                setRole(data.role);
            } else {
                setMsg(data.message);
            }
        } catch (error) {
            setMsg('Server error');
        }
    };

    return (
        <div className="login_form">
            <h1>Login</h1>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={pass}
                onChange={(e) => setPass(e.target.value)}
            />
            <button onClick={handleLogin}>Login</button>
            <div>{msg}</div>
        </div>
    );
}

export default Login;