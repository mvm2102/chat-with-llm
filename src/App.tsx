import { useState } from "react";
import Chat from "./components/Chat";
import ChatHistoryMenu from "./components/ChatHistoryMenu";
import Login from "./components/Login";

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
}

function App() {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState("");
    const [sessions, setSessions] = useState<ChatSession[]>(() => {
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        const sessionList = Object.keys(savedSessions).map((id) => ({
            id,
            title: savedSessions[id].title || `Phiên ${id.slice(-4)}`,
            timestamp: parseInt(id),
        }));
        return sessionList.length
            ? sessionList
            : [{ id: Date.now().toString(), title: "Phiên 1", timestamp: Date.now() }];
    });
    const [currentSessionId, setCurrentSessionId] = useState<string>(sessions[0].id);

    const handleLogin = (user: string) => {
        setUsername(user);
        setIsLoggedIn(true);
    };

    const handleSelectSession = (id: string) => {
        setCurrentSessionId(id);
    };

    const handleCreateSession = () => {
        const newId = Date.now().toString();
        const newSession: ChatSession = { id: newId, title: `Phiên ${newId.slice(-4)}`, timestamp: Date.now() };
        setSessions((prev) => [...prev, newSession]);
        setCurrentSessionId(newId);
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        savedSessions[newId] = [
            { id: 1, text: `Xin chào ${username}! Gõ 'vẽ biểu đồ' để thử nhé!`, sender: "bot" },
        ];
        savedSessions[newId].title = newSession.title;
        localStorage.setItem("chatSessions", JSON.stringify(savedSessions));
    };

    const handleDeleteSession = (id: string) => {
        const updatedSessions = sessions.filter((session) => session.id !== id);
        setSessions(updatedSessions);
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        delete savedSessions[id];
        localStorage.setItem("chatSessions", JSON.stringify(savedSessions));
        if (currentSessionId === id && updatedSessions.length) {
            setCurrentSessionId(updatedSessions[0].id);
        } else if (!updatedSessions.length) {
            handleCreateSession();
        }
    };

    const handleRenameSession = (id: string, newTitle: string) => {
        const updatedSessions = sessions.map((session) =>
            session.id === id ? { ...session, title: newTitle } : session
        );
        setSessions(updatedSessions);
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        savedSessions[id].title = newTitle;
        localStorage.setItem("chatSessions", JSON.stringify(savedSessions));
    };

    if (!isLoggedIn) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="h-screen w-screen flex overflow-hidden bg-gray-900">
            <ChatHistoryMenu
                sessions={sessions}
                onSelectSession={handleSelectSession}
                onCreateSession={handleCreateSession}
                onDeleteSession={handleDeleteSession}
                onRenameSession={handleRenameSession}
            />
            <Chat sessionId={currentSessionId} />
        </div>
    );
}

export default App;