import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";

export default function UserManagmentPage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", password_sha256: "", role: "user" });
    const [deleteName, setDeleteName] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/users`)
            .then(res => res.json())
            .then(data => setUsers(data));
    }, []);

    const addUser = async () => {
        if (!newUser.name || !newUser.password_sha256) return alert("Zadej jméno a heslo (hash)!");
        await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        setUsers([...users, newUser]);
        setNewUser({ name: "", password_sha256: "", role: "user" });
    };

    const deleteUser = async () => {
        const index = users.findIndex(u => u.name === deleteName);
        if (index < 0) return;
        await fetch(`${API_URL}/api/users${index}`, { method: "DELETE" });
        setUsers(users.filter((_, i) => i !== index));
        setDeleteName("");
    };

    return (
        <div className="screen">
            <div className="admin__tabs" style={{border:'0', paddingTop:0}}>
                <h2 className="h2">Správa uživatelů</h2>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 1fr', gap:'40px'}}>
                {/* create user */}
                <div className="card-panel" style={{borderColor:'#9dc0ff'}}>
                    <h3 className="h3">Vytvořit uživatele</h3>
                    <input className="input" placeholder="Jméno uživatele" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                    <div style={{height:8}} />
                    <input className="input" placeholder="Heslo (sha256)" value={newUser.password_sha256} onChange={e => setNewUser({ ...newUser, password_sha256: e.target.value })} />
                    <div style={{height:8}} />
                    <select className="input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                        <option value="user">User</option>
                        <option value="admin">Admin</option>
                    </select>
                    <div style={{height:12}} />
                    <button className="btn btn--primary" onClick={addUser}>Vytvořit uživatele</button>
                </div>

                {/* delete user */}
                <div className="card-panel" style={{borderColor:'#ffc1c1'}}>
                    <h3 className="h3" style={{color:'#d62d2d'}}>Smazat uživatele</h3>
                    <input className="input" placeholder="Jméno uživatele" value={deleteName} onChange={e => setDeleteName(e.target.value)} />
                    <div style={{height:8}} />
                    <button className="btn" onClick={deleteUser}>Smazat</button>
                </div>
            </div>

            <ul style={{marginTop:24, paddingLeft:18}}>
                {users.map((u, i) => (<li key={i}>{u.name} ({u.role})</li>))}
            </ul>
        </div>
    );
}
