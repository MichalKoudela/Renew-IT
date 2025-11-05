import React, { useEffect, useState } from "react";
const API_URL = process.env.REACT_APP_API_URL;

export default function QuizPage() {
    const [quiz, setQuiz] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/quiz`)
            .then((res) => res.json())
            .then(setQuiz)
            .catch((err) => console.error("Chyba při načítání kvízu:", err));
    }, []);

    if (quiz.length === 0) return <p>Načítám otázky...</p>;

    const current = quiz[currentIndex];

    const handleAnswer = (key) => {
        if (selected !== null) return;
        const correct = Number(key) === current.correct;
        setSelected(key);
        setIsCorrect(correct);
        setTimeout(() => {
            setSelected(null);
            setIsCorrect(null);
            setCurrentIndex((prev) => (prev + 1) % quiz.length);
        }, 1200);
    };

    const handleJump = (e) => {
        e.preventDefault();
        const n = parseInt(inputValue, 10);
        if (n > 0 && n <= quiz.length) setCurrentIndex(n - 1);
        setInputValue("");
    };

    return (
        <div className="quiz-ui">
            <button className="quiz-ui__arrow" onClick={() => setCurrentIndex((currentIndex - 1 + quiz.length) % quiz.length)}>◀</button>

            <div className="quiz-ui__content">
                <h2 className="quiz-ui__question">{current.question}</h2>
                {["1","2","3","4"].map((k) => (
                    <button key={k} className={`quiz-ui__btn ${selected===k ? (isCorrect ? "is-correct" : "is-wrong") : ""}`} onClick={() => handleAnswer(k)} disabled={selected !== null}>
                        {current[k]}
                    </button>
                ))}
                <div className="quiz-ui__index">{currentIndex + 1}/{quiz.length}</div>
                <form className="quiz-ui__jump" onSubmit={handleJump}>
                    <input className="input" type="number" min="1" max={quiz.length} value={inputValue} onChange={e => setInputValue(e.target.value)} placeholder="Zadat číslo otázky" />
                    <button className="btn" type="submit">OK</button>
                </form>
            </div>

            <button className="quiz-ui__arrow" onClick={() => setCurrentIndex((currentIndex + 1) % quiz.length)}>▶</button>
        </div>
    );
}
