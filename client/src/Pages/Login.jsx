import React, { useState, useEffect } from "react";
import crypto from "crypto-js";

export default function Login({ onLogin }) {
    const [name, setName] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [users, setUsers] = useState([]);

    useEffect(() => {
        fetch("/db/users.json")
            .then((r) => r.json())
            .then(setUsers)
            .catch(() => setMessage("❌ Nelze načíst databázi."));
    }, []);

    const handleLogin = (e) => {
        e.preventDefault();

        const user = users.find((u) => u.name === name);
        if (!user) {
            setMessage("❌ Uživatel neexistuje.");
            return;
        }

        const hash = crypto.SHA256(password).toString(crypto.enc.Hex);

        if (hash === user.password_sha256) {
            setMessage(`✅ Přihlášení úspěšné. Vítej, ${name}!`);
            const isAdmin = user.role === "admin";
            if (onLogin) onLogin(isAdmin);
        } else {
            setMessage("❌ Neplatné heslo.");
        }
    };

    return (
        <div className="screen screen--center">
            <form className="login" onSubmit={handleLogin}>
                <h1 className="h2">Login</h1>
                <input className="input" type="text" placeholder="Uživatel" value={name} onChange={(e) => setName(e.target.value)} required />
                <input className="input" type="password" placeholder="Heslo" value={password} onChange={(e) => setPassword(e.target.value)} required />
                <button className="btn btn--primary" type="submit">Přihlásit se</button>
                <p>{message}</p>
            </form>
        </div>
    );
}
