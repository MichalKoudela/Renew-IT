import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function ArticleManagmentPage() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({ title: "", tldr: "", author: "", img: "", text: "" });

    useEffect(() => {
        fetch(`${API_URL}/api/articles`)
            .then(res => res.json())
            .then(setArticles)
            .catch(err => console.error("Chyba načtení článků:", err));
    }, []);

    const addArticle = async () => {
        if (!newArticle.title || !newArticle.text) return alert("Vyplň název a text!");
        await fetch(`${API_URL}/api/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...newArticle, date: new Date().toISOString().split("T")[0] })
        });
        const refreshed = await fetch(`${API_URL}/api/articles`).then(r => r.json());
        setArticles(refreshed);
        setNewArticle({ title: "", tldr: "", author: "", img: "", text: "" });
    };

    const deleteArticle = async (id) => {
        await fetch(`${API_URL}/api/articles/${id}`, { method: "DELETE" });
        setArticles(articles.filter(a => a._id !== id));
    };

    return (
        <div className="screen">
            <h2 className="section-title">Správa článků</h2>
            <div className="card-panel">
                <input className="input" placeholder="Název" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} />
                <input className="input" placeholder="Shrnutí" value={newArticle.tldr} onChange={e => setNewArticle({ ...newArticle, tldr: e.target.value })} />
                <input className="input" placeholder="Autor" value={newArticle.author} onChange={e => setNewArticle({ ...newArticle, author: e.target.value })} />
                <input className="input" placeholder="Obrázek (URL)" value={newArticle.img} onChange={e => setNewArticle({ ...newArticle, img: e.target.value })} />
                <textarea className="input" rows="5" placeholder="Text článku" value={newArticle.text} onChange={e => setNewArticle({ ...newArticle, text: e.target.value })}></textarea>
                <button className="btn btn--primary" onClick={addArticle}>Přidat článek</button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Název</th>
                    <th>Autor</th>
                    <th>Datum</th>
                    <th>Akce</th>
                </tr>
                </thead>
                <tbody>
                {articles.map(a => (
                    <tr key={a._id}>
                        <td>{a.title}</td>
                        <td>{a.author}</td>
                        <td>{a.date}</td>
                        <td><button className="btn btn--danger" onClick={() => deleteArticle(a._id)}>🗑️</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
