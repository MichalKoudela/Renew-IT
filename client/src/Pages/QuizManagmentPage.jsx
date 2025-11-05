import React, { useState, useEffect } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";
export default function QuizManagmentPage() {
    const [quiz, setQuiz] = useState([]);
    const [newQ, setNewQ] = useState({ question: "", 1: "", 2: "", 3: "", 4: "", correct: 1 });
    const [deleteId, setDeleteId] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/quiz/`)
            .then(res => res.json())
            .then(data => setQuiz(data));
    }, []);

    const addQuestion = async () => {
        if (!newQ.question) return alert("Zadej otázku!");
        await fetch(`${API_URL}/api/quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQ)
        });
        setQuiz([...quiz, newQ]);
        setNewQ({ question: "", 1: "", 2: "", 3: "", 4: "", correct: 1 });
    };

    const deleteQuestion = async () => {
        const index = Number(deleteId);
        if (Number.isNaN(index)) return;
        await fetch(`${API_URL}/api/quiz/${index}`, { method: "DELETE" });
        setQuiz(quiz.filter((_, i) => i !== index));
        setDeleteId("");
    };

    return (
        <div className="screen">
            <div className="admin__tabs" style={{border:'0', paddingTop:0}}>
                <h2 className="h2">Správa otázek</h2>
            </div>

            <div style={{display:'grid', gridTemplateColumns:'1fr 320px', gap:'28px'}}>
                <div className="card-panel">
                    <input className="input" placeholder="Otázka" value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} />
                    {[1,2,3,4].map(n => (
                        <div key={n} style={{display:'grid', gridTemplateColumns:'28px 1fr', gap:'10px', marginTop:'10px'}}>
                            <input type="checkbox" checked={newQ.correct===n} onChange={() => setNewQ({...newQ, correct:n})} />
                            <input className="input" placeholder={`Odpověď ${n}`} value={newQ[n]} onChange={e => setNewQ({ ...newQ, [n]: e.target.value })} />
                        </div>
                    ))}
                    <div style={{height:14}} />
                    <button className="btn btn--primary" onClick={addQuestion}>Vytvořit otázku</button>
                </div>

                <div>
                    <div className="card-panel">
                        <input className="input" placeholder="ID" value={deleteId} onChange={e => setDeleteId(e.target.value)} />
                        <div style={{height:12}} />
                        <button className="btn" onClick={deleteQuestion}>Smazat otázku</button>
                    </div>
                    <ul style={{marginTop:20, paddingLeft:18}}>
                        {quiz.map((q, i) => (<li key={i}><b>{i}.</b> {q.question}</li>))}
                    </ul>
                </div>
            </div>
        </div>
    );
}
