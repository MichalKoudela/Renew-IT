import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function UserManagmentPage() {
    const [users, setUsers] = useState([]);
    const [newUser, setNewUser] = useState({ name: "", password_sha256: "", role: "user" });

    useEffect(() => {
        fetch(`${API_URL}/api/users`)
            .then(res => res.json())
            .then(setUsers)
            .catch(err => console.error("Chyba načtení uživatelů:", err));
    }, []);

    const addUser = async () => {
        if (!newUser.name || !newUser.password_sha256) return alert("Vyplň jméno i heslo!");
        await fetch(`${API_URL}/api/users`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newUser)
        });
        setNewUser({ name: "", password_sha256: "", role: "user" });
        const refreshed = await fetch(`${API_URL}/api/users`).then(r => r.json());
        setUsers(refreshed);
    };

    const deleteUser = async (id) => {
        await fetch(`${API_URL}/api/users/${id}`, { method: "DELETE" });
        setUsers(users.filter(u => u._id !== id));
    };

    return (
        <div className="screen">
            <h2 className="section-title">Správa uživatelů</h2>
            <div className="card-panel">
                <input className="input" placeholder="Jméno" value={newUser.name} onChange={e => setNewUser({ ...newUser, name: e.target.value })} />
                <input className="input" placeholder="Heslo (sha256)" value={newUser.password_sha256} onChange={e => setNewUser({ ...newUser, password_sha256: e.target.value })} />
                <select className="input" value={newUser.role} onChange={e => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                </select>
                <button className="btn btn--primary" onClick={addUser}>Přidat uživatele</button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Jméno</th>
                    <th>Role</th>
                    <th>Akce</th>
                </tr>
                </thead>
                <tbody>
                {users.map(u => (
                    <tr key={u._id}>
                        <td>{u.name}</td>
                        <td>{u.role}</td>
                        <td><button className="btn btn--danger" onClick={() => deleteUser(u._id)}>🗑️</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
