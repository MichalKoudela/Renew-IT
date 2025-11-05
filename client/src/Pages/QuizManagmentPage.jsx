import React, { useState, useEffect } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function QuizManagmentPage() {
    const [quiz, setQuiz] = useState([]);
    const [newQ, setNewQ] = useState({ question: "", 1: "", 2: "", 3: "", 4: "", correct: 1 });

    useEffect(() => {
        fetch(`${API_URL}/api/quiz`)
            .then(res => res.json())
            .then(setQuiz)
            .catch(err => console.error("Chyba načtení kvízu:", err));
    }, []);

    const addQuestion = async () => {
        if (!newQ.question) return alert("Vyplň otázku!");
        await fetch(`${API_URL}/api/quiz`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(newQ)
        });
        const updated = await fetch(`${API_URL}/api/quiz`).then(r => r.json());
        setQuiz(updated);
        setNewQ({ question: "", 1: "", 2: "", 3: "", 4: "", correct: 1 });
    };

    const deleteQuestion = async (id) => {
        await fetch(`${API_URL}/api/quiz/${id}`, { method: "DELETE" });
        setQuiz(quiz.filter(q => q._id !== id));
    };

    return (
        <div className="screen">
            <h2 className="section-title">Správa kvízu</h2>
            <div className="card-panel">
                <input className="input" placeholder="Otázka" value={newQ.question} onChange={e => setNewQ({ ...newQ, question: e.target.value })} />
                {[1,2,3,4].map(n => (
                    <input key={n} className="input" placeholder={`Odpověď ${n}`} value={newQ[n]} onChange={e => setNewQ({ ...newQ, [n]: e.target.value })} />
                ))}
                <input className="input" type="number" min="1" max="4" value={newQ.correct} onChange={e => setNewQ({ ...newQ, correct: parseInt(e.target.value) })} />
                <button className="btn btn--primary" onClick={addQuestion}>Přidat otázku</button>
            </div>

            <table className="admin-table">
                <thead>
                <tr>
                    <th>Otázka</th>
                    <th>Správná odpověď</th>
                    <th>Akce</th>
                </tr>
                </thead>
                <tbody>
                {quiz.map(q => (
                    <tr key={q._id}>
                        <td>{q.question}</td>
                        <td>{q.correct}</td>
                        <td><button className="btn btn--danger" onClick={() => deleteQuestion(q._id)}>🗑️</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </div>
    );
}
