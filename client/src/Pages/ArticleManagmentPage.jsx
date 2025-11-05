import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function ArticleManagmentPage() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: "", tldr: "", text: "", author: "", img: "", date: ""
    });

    useEffect(() => {
        fetch(`${API_URL}/api/articles`)
            .then(res => res.json())
            .then(data => setArticles(data))
            .catch(err => console.error("Chyba načtení článků:", err));
    }, []);

    const addArticle = async () => {
        await fetch(`${API_URL}/api/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newArticle)
        });
        setArticles([...articles, newArticle]);
        setNewArticle({ title: "", tldr: "", text: "", author: "", img: "", date: "" });
    };

    const deleteArticle = async (id) => {
        await fetch(`${API_URL}/api/articles/${id}`, { method: "DELETE" });
        setArticles(articles.filter(a => a._id !== id));
    };

    return (
        <div className="screen">
            <h2>Správa článků</h2>
            <div className="card-panel">
                <input className="input" placeholder="Název" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} />
                <input className="input" placeholder="Shrnutí" value={newArticle.tldr} onChange={e => setNewArticle({ ...newArticle, tldr: e.target.value })} />
                <textarea className="input" placeholder="Text článku" value={newArticle.text} onChange={e => setNewArticle({ ...newArticle, text: e.target.value })} />
                <input className="input" placeholder="Autor" value={newArticle.author} onChange={e => setNewArticle({ ...newArticle, author: e.target.value })} />
                <button className="btn btn--primary" onClick={addArticle}>Přidat článek</button>
            </div>

            <ul>
                {articles.map(a => (
                    <li key={a._id}>{a.title} <button onClick={() => deleteArticle(a._id)}>🗑️</button></li>
                ))}
            </ul>
        </div>
    );
}
