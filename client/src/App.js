import { useState, useEffect } from 'react';
import Quiz from "./Pages/QuizPage.jsx";
import ArticleManagmentPage from "./Pages/ArticleManagmentPage.jsx";
import QuizManagmentPage from "./Pages/QuizManagmentPage.jsx";
import UserManagmentPage from "./Pages/UserManagmentPage.jsx";
import "./App.css";
const API_URL = process.env.REACT_APP_API_URL;


/* ---------- helpers ---------- */
async function sha256(text) {
    const encoder = new TextEncoder();
    const data = encoder.encode(text);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
}

/* ---------- pages ---------- */
function LoginPage({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!username || !password) return alert("Vyplň jméno i heslo!");

        try {
            const res = await fetch(`${API_URL}/api/users`);
            const users = await res.json();
            const hash = await sha256(password);
            const found = users.find(u => u.name === username && u.password_sha256 === hash);

            if (found) {
                onLogin(found.role === "admin");
            } else {
                alert("Neplatné přihlašovací údaje!");
            }
        } catch (err) {
            console.error("Chyba při přihlašování:", err);
            alert("Nelze ověřit uživatele.");
        }
    };

    return (
        <div className="screen screen--center">
            <form className="login" onSubmit={handleSubmit}>
                <h1 className="h2">Login</h1>
                <input className="input" type="text" placeholder="Jméno:" value={username} onChange={(e) => setUsername(e.target.value)} />
                <input className="input" type="password" placeholder="Heslo:" value={password} onChange={(e) => setPassword(e.target.value)} />
                <button className="btn btn--primary" type="submit">Login</button>
            </form>
        </div>
    );
}

/* ---------- layout ---------- */
function NavigationMenu({ setStateHome, children }) {
    return (
        <div className="app">
            <header className="site-header">
                <nav className="nav">
                    <button className="nav__item" onClick={() => setStateHome(0)}>Úvod</button>
                    <button className="nav__item" onClick={() => setStateHome(1)}>Články</button>
                    <button className="nav__item" onClick={() => setStateHome(2)}>Kniha a kvíz</button>
                    <button className="nav__item" onClick={() => setStateHome(3)}>Autor</button>
                    <button className="nav__item nav__item--right" onClick={() => setStateHome(4)}>Login</button>
                </nav>
            </header>
            <main className="main">{children}</main>
            <footer className="site-footer">@Michal Koudela 2025</footer>
        </div>
    );
}


/* ---------- cards ---------- */
const ArticleCard = ({ article, onClick, compact = false, className = "" }) => (
    <article className={`card ${compact ? "card--compact" : ""} ${className}`} onClick={onClick} role="button">
        <div className="card__thumb" aria-hidden="true">
            {article?.img && <img src={article.img} alt="" />}
        </div>
        <div className="card__body">
            <small className="card__date">{article.date}</small>
            <h3 className="card__title">{article.title}</h3>
            <p className="card__lead">{article.tldr}</p>
            {!compact && <p className="card__text">{(article.text || "").slice(0, 200)}…</p>}
        </div>
    </article>
);

/* ---------- content pages ---------- */
function HomePage({ setSelectedArticle }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/articles`)
            .then((r) => r.json())
            .then((data) => setArticles(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
            .catch((e) => console.error(e));
    }, []);

    const top = articles.slice(0, 6);
    if (top.length === 0) return <p>Načítám články…</p>;

    return (
        <div className="screen">
            <h1 className="hero-title">IT (RE)NEWS TODAY</h1>
            <h2 className="section-title">Nejnovější články:</h2>
            {top[0] && (
                <div className="feature-row">
                    <ArticleCard article={top[0]} onClick={() => setSelectedArticle(top[0])} className="card--featured" />
                    <div className="feature-row__side">
                        {top.slice(1, 3).map((a, i) => <ArticleCard key={i} article={a} onClick={() => setSelectedArticle(a)} compact />)}
                    </div>
                </div>
            )}
            <div className="articles-grid">
                {top.slice(3, 6).map((a, i) => (
                    <ArticleCard key={i} article={a} onClick={() => setSelectedArticle(a)} compact />
                ))}
            </div>
        </div>
    );
}



function ArticlesPage({ setSelectedArticle }) {
    const [articles, setArticles] = useState([]);

    useEffect(() => {
        fetch(`${API_URL}/api/articles`)
            .then((r) => r.json())
            .then((data) => setArticles(data.sort((a, b) => new Date(b.date) - new Date(a.date))))
            .catch((e) => console.error(e));
    }, []);

    return (
        <div className="screen">
            <div className="articles-grid articles-grid--tight">
                {articles.map((a, i) => (
                    <ArticleCard key={i} article={a} onClick={() => setSelectedArticle(a)} compact />
                ))}
            </div>
        </div>
    );
}

function SingleArticle({ article, onClose }) {
    return (
        <div className="modal">
            <div className="modal__content">
                <button className="modal__close" onClick={onClose} aria-label="Zavřít">✕</button>
                <h1 className="modal__title">{article.title}</h1>
                <p className="modal__subtitle">{article.tldr}</p>
                <div className="modal__layout">
                    <div className="modal__text">
                        {article.text
                            .split(/\n+/)
                            .filter(para => para.trim())
                            .map((para, i) => (
                                <p key={i} dangerouslySetInnerHTML={{ __html: para.trim() }} />
                            ))}
                    <p className="modal__meta"><i>Autor: {article.author} • {article.date}</i></p>
                </div>

                <div className="modal__image">
                        {article.img && <img src={article.img} alt={article.title} />}
                    </div>
                </div>
            </div>
        </div>
    );
}

function BookAndQuizPage() {
    const handleDownload = () => {
        const fileUrl = '/book/historie-it.pdf';
        const a = document.createElement('a');
        a.href = fileUrl;
        a.download = 'Historie-IT.pdf';
        a.click();
    };

    return (
        <div className="screen screen--book">
            <div className="book">
                <h2 className="h2">Kniha verze 1.0</h2>
                <div className="book__cover">
                    <img src="https://res.cloudinary.com/dlwvf5h4t/image/upload/v1762379735/renewit/fohdwtkt9ld1pyuvzz68.png" alt="Úvodní stránka knihy 1.0"/>
                </div>
                <button className="btn btn--primary book__btn" onClick={handleDownload}>Stáhnout</button>
            </div>
            <div className="quiz">
                <Quiz />
            </div>
        </div>
    );
}

function AuthorPage() {
    return (
        <div className="screen screen--author">
            <div className="author__image">
                <img src="https://res.cloudinary.com/dlwvf5h4t/image/upload/v1762379822/renewit/a8wgjuefvqmztpj5r1sx.jpg" alt="Michal Koudela"/>
            </div>
            <div className="author__bio">
                <h1 className="h1">Michal Koudela</h1>
                <p className="author__date">*28.06.2006</p>
                <p>
                    Narodil jsem se v Hořovicích, ale vyrůstal jsem ve vesničce nedaleko Dobříše. Narodil jsem se v době, kdy už počítače vládnou světu a práce v IT je lépe placená než u průměrného lékaře, jehož přínos je však mnohem důležitější než přínos počítačů. K počítačům jsem se dostal přes videohry, jak je tomu u většiny dnešních dětí. Pamatuji si, jak jsem s tátou hrál LEGO hry na jeho počítači – známé značky jako Batman, Indiana Jones či Harry Potter. Přibližně v šesti letech jsem dostal svůj první počítač. Táta mi ho daroval, abych na něm mohl hrát hry. Také na něm byla nainstalovaná jedna hra, která změnila život milionům lidí.</p>
                <p>
                    Teď byste možná čekali, že budu vyprávět, jak jsem se skrze Minecraft naučil programovat a stal se výborným „ajťákem“. Není tomu však tak – naopak, začal jsem hrát více počítačových her než kdy dřív. Nejen na počítači, ale i na herních konzolích. Samozřejmě to vedlo k částečnému sociálnímu odříznutí, ale zároveň jsem si tím výrazně zlepšil angličtinu. Jediné technické zkušenosti, které jsem v té době získal, byly ty, jak funguje operační systém Windows. Musel jsem totiž občas počítač spravovat a orientovat se ve struktuře souborů, abych mohl instalovat módy do her a zprovoznit pirátské kopie.</p>
                <p>
                    Když přišel čas vybrat si střední školu, měl jsem poměrně jasno. Chtěl jsem se dostat na Smíchovskou průmyslovou školu, která se prezentovala jako nejlepší IT škola v České republice. Přijímací řízení však nebylo snadné – byl velký převis uchazečů. Kromě klasických zkoušek jsem musel dodat také portfolio a motivační dopis. A protože jsem si školu vyhlédl už v sedmé třídě, měl jsem spoustu času na práci na svém portfoliu. Začal jsem se učit programovat v jazyce C# a účastnil jsem se různých olympiád, abych zaujal. Také jsem vytvořil malou počítačovou hru v konzoli, která sice nebyla nijak zvlášť kvalitní, ale využívala principy objektově orientovaného programování (OOP), a tak mohla komisi zaujmout.</p>
                <p>
                    Přihlášku jsem podal na dva obory – Informační technologie a Kybernetická bezpečnost. Byl jsem přijat na oba, a protože Kybernetická bezpečnost byla novější a náročnější na přijetí, zvolil jsem právě ji. Učil jsem se programování, počítačové sítě, hardware, procesory, výkresové aplikace a spoustu dalších témat. Největší důraz byl však kladen na naše vlastní samostudium. A zde přichází zásadní dovednost každého člověka – sebeprosazení. Během studia jsem absolvoval pokročilé kurzy zaměřené na počítačové sítě, chvíli jsem pracoval na IT oddělení naší školy a podílel jsem se na pořádání letních škol pro uchazeče.
                </p>
                <p>
                    Nyní, na konci studia, musím vytvořit projekt, který bude reprezentovat znalosti, jež jsem během studia nabyl. Protože jsem zároveň fanouškem humanitních oborů a mám rád historii, zvolil jsem variantu, ve které napíšu knihu o historii oboru, který studuji.
                </p>
            </div>
        </div>
    );
}

/* ---------- admin shell ---------- */
function AdminNavigationMenu({ setAdminPage, children, isAdmin }) {
    return (
        <div className="admin">
            <div className="admin__tabs">
                {isAdmin && <button className="admin__tab" onClick={() => setAdminPage(1)}>Správa uživatelů</button>}
                <button className="admin__tab" onClick={() => setAdminPage(3)}>Nahrát obrázek</button>
                <button className="admin__tab" onClick={() => setAdminPage(4)}>Správa otázek</button>
                <button className="admin__tab" onClick={() => setAdminPage(2)}>Správa článků</button>
            </div>
            <div className="admin__body">{children}</div>
        </div>
    );
}

function PictureManagmentPage() {
    const [selectedFile, setSelectedFile] = useState(null);
    const [uploadedImage, setUploadedImage] = useState(null);
    const [status, setStatus] = useState("");

    const handleFileChange = (e) => {
        setSelectedFile(e.target.files[0]);
        setUploadedImage(null);
    };

    const handleUpload = async () => {
        if (!selectedFile) return alert("Nejprve vyber obrázek!");

        const formData = new FormData();
        formData.append("image", selectedFile);

        try {
            const res = await fetch(`${API_URL}/api/upload`, {
                method: "POST",
                body: formData,
            });
            const data = await res.json();

            if (data.success) {
                setStatus("✅ Obrázek byl úspěšně nahrán!");
                setUploadedImage(data.imageUrl);
            } else {
                setStatus("❌ Nahrávání selhalo.");
            }
        } catch (err) {
            console.error("Chyba při nahrávání obrázku:", err);
            setStatus("❌ Chyba při komunikaci se serverem.");
        }
    };

    return (
        <div className="picture-upload">
        <div className="card-panel">
            <h3 className="h3">Nahrát obrázek</h3>
            <div className="u-stack">
                <input className="input" type="file" accept="image/*" onChange={handleFileChange} />
                <button className="btn" onClick={handleUpload}>Nahrát</button>
            </div>
            {status && <p>{status}</p>}
            {uploadedImage && (
                <div className="upload-preview">
                    <img src={uploadedImage} alt="Nahraný soubor" />
                </div>
            )}
        </div>
        </div>
    );
}

/* ---------- App root ---------- */
export default function App() {
    const [state, setState] = useState(0);
    const [selectedArticle, setSelectedArticle] = useState(null);
    const [adminpage, setAdmin] = useState(0);
    const [isAdmin, setIsAdmin] = useState(false);

    function setStateHome(x = 0) {
        setState(x);
        setSelectedArticle(null);
    }
    function setAdminPage(page = 0) {
        setAdmin(page);
    }
    function handleLogin(isAdminUser) {
        setIsAdmin(isAdminUser);
        setState(4);
        setAdminPage(isAdminUser ? 1 : 2); // neadmin nesmí do správy uživatelů
    }

    if (selectedArticle) {
        return <SingleArticle article={selectedArticle} onClose={() => setSelectedArticle(null)} />;
    }

    if (state === 0) return <NavigationMenu setStateHome={setStateHome}><HomePage setSelectedArticle={setSelectedArticle} /></NavigationMenu>;
    if (state === 1) return <NavigationMenu setStateHome={setStateHome}><ArticlesPage setSelectedArticle={setSelectedArticle} /></NavigationMenu>;
    if (state === 2) return <NavigationMenu setStateHome={setStateHome}><BookAndQuizPage /></NavigationMenu>;
    if (state === 3) return <NavigationMenu setStateHome={setStateHome}><AuthorPage /></NavigationMenu>;

    if (state === 4 && adminpage === 0)
        return (
            <NavigationMenu setStateHome={setStateHome}>
                <LoginPage onLogin={handleLogin} />
            </NavigationMenu>
        );

    if (state === 4 && adminpage >= 1)
        return (
            <NavigationMenu setStateHome={setStateHome}>
                <AdminNavigationMenu setAdminPage={setAdminPage} isAdmin={isAdmin}>
                    {adminpage === 1 && isAdmin && <UserManagmentPage />}
                    {adminpage === 2 && <ArticleManagmentPage />}
                    {adminpage === 3 && <PictureManagmentPage />}
                    {adminpage === 4 && <QuizManagmentPage />}
                </AdminNavigationMenu>
            </NavigationMenu>
        );

    return <p>ERROR in the server :3</p>;
}
