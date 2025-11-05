import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";
export default function ArticleManagmentPage() {
    const [articles, setArticles] = useState([]);
    const [newArticle, setNewArticle] = useState({
        title: "",
        tldr: "",
        text: "",
        img: "",
        author: ""
    });
    const [deleteId, setDeleteId] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/articles`)
            .then(res => res.json())
            .then(setArticles);
    }, []);

    const addArticle = async () => {
        if (!newArticle.title || !newArticle.text) return alert("Vyplň název a text!");
        const article = { ...newArticle, date: new Date().toISOString().split("T")[0] };
        await fetch(`${API_URL}/api/articles`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(article)
        });
        setArticles([...articles, article]);
        setNewArticle({ title: "", tldr: "", text: "", img: "", author: "" });
    };

    const deleteArticle = async () => {
        const index = Number(deleteId);
        if (Number.isNaN(index)) return;
        await fetch(`${API_URL}/api/articles/${index}`, { method: "DELETE" });
        setArticles(articles.filter((_, i) => i !== index));
        setDeleteId("");
    };

    return (
        <div className="screen">
            <div className="admin__tabs" style={{border:'0', paddingTop:0}}>
                <h2 className="h2">Správa článků</h2>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'28px', alignItems:'start'}}>
                <div className="card-panel">
                    <input className="input" placeholder="Nadpis" value={newArticle.title} onChange={e => setNewArticle({ ...newArticle, title: e.target.value })} />
                    <div style={{height:10}} />
                    <input className="input" placeholder="Shrnutí" value={newArticle.tldr} onChange={e => setNewArticle({ ...newArticle, tldr: e.target.value })} />
                    <div style={{height:10}} />
                    <textarea className="input" style={{minHeight:220}} placeholder="Text" value={newArticle.text} onChange={e => setNewArticle({ ...newArticle, text: e.target.value })} />
                    <div style={{height:10}} />
                    <input className="input" placeholder="Cesta k obrázku: /img/'Jméno Obrázku'" value={newArticle.img} onChange={e => setNewArticle({ ...newArticle, img: e.target.value })} />
                    <div style={{height:10}} />
                    <input className="input" placeholder="Autor" value={newArticle.author} onChange={e => setNewArticle({ ...newArticle, author: e.target.value })} />
                    <div style={{height:14}} />
                    <div style={{display:'flex', justifyContent:'flex-end'}}>
                        <button className="btn btn--primary" onClick={addArticle}>Vytvořit článek</button>
                    </div>
                </div>

                <div>
                    <div className="card-panel">
                        <input className="input" placeholder="ID" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
                        <div style={{height:12}} />
                        <button className="btn" onClick={deleteArticle}>Smazat článek</button>
                    </div>

                    <ul style={{marginTop:20, paddingLeft:18}}>
                        {articles.map((a, i) => (
                            <li key={i}><b>{i}.</b> {a.title} — {a.author} ({a.date})</li>
                        ))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
