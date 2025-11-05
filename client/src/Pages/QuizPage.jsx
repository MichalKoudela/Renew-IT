import React, { useEffect, useState } from "react";

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5050";
export default function QuizPage() {
    const [quiz, setQuiz] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [selected, setSelected] = useState(null);
    const [isCorrect, setIsCorrect] = useState(null);
    const [inputValue, setInputValue] = useState("");

    useEffect(() => {
        fetch(`${API_URL}/api/quiz`)
            .then((res) => res.json())
            .then((data) => setQuiz(data))
            .catch((err) => console.error("Chyba při načítání kvízu:", err));
    }, []);

    if (quiz.length === 0) return <p>Načítám otázky...</p>;

    const currentQuestion = quiz[currentIndex];

    const handleAnswer = (key) => {
        if (selected !== null) return;
        const correct = Number(key) === currentQuestion.correct;
        setSelected(key);
        setIsCorrect(correct);
        setTimeout(() => {
            setSelected(null);
            setIsCorrect(null);
            setCurrentIndex((prev) => (prev + 1) % quiz.length);
        }, 1200);
    };

    const jumpTo = (n) => setCurrentIndex((n + quiz.length) % quiz.length);

    const handleSubmit = (e) => {
        e.preventDefault();
        const n = parseInt(inputValue, 10);
        if (!isNaN(n) && n > 0 && n <= quiz.length) {
            setCurrentIndex(n - 1);
            setSelected(null); setIsCorrect(null);
        }
        setInputValue("");
    };

    return (
        <div className="quiz-ui">
            <button className="quiz-ui__arrow" onClick={() => jumpTo(currentIndex - 1)}>◀</button>

            <div className="quiz-ui__content">
                <h2 className="quiz-ui__question">{currentQuestion.question}</h2>

                <div className="quiz-ui__answers">
                    {["1","2","3","4"].map((k) => (
                        <button
                            key={k}
                            className={`quiz-ui__btn ${selected===k ? (isCorrect ? "is-correct" : "is-wrong") : ""}`}
                            onClick={() => handleAnswer(k)}
                            disabled={selected !== null}
                        >
                            {currentQuestion[k]}
                        </button>
                    ))}
                </div>

                <div className="quiz-ui__index">{currentIndex + 1}/{quiz.length}</div>

                <form className="quiz-ui__jump" onSubmit={handleSubmit}>
                    <input className="input" type="number" min="1" max={quiz.length} value={inputValue}
                           onChange={(e)=>setInputValue(e.target.value)} placeholder="Zadat číslo otázky"/>
                    <button className="btn" type="submit">OK</button>
                </form>
            </div>

            <button className="quiz-ui__arrow" onClick={() => jumpTo(currentIndex + 1)}>▶</button>
        </div>
    );

}
