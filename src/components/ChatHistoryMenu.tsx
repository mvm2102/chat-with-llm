import { useState } from "react";

interface ChatSession {
    id: string;
    title: string;
    timestamp: number;
}

interface ChatHistoryMenuProps {
    sessions: ChatSession[];
    onSelectSession: (id: string) => void;
    onCreateSession: () => void;
    onDeleteSession: (id: string) => void;
    onRenameSession: (id: string, newTitle: string) => void;
}

export default function ChatHistoryMenu({
                                            sessions,
                                            onSelectSession,
                                            onCreateSession,
                                            onDeleteSession,
                                            onRenameSession,
                                        }: ChatHistoryMenuProps) {
    const [selectedSession, setSelectedSession] = useState<string | null>(sessions[0]?.id || null);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [editTitle, setEditTitle] = useState("");

    const handleSelect = (id: string) => {
        setSelectedSession(id);
        onSelectSession(id);
    };

    const startEditing = (id: string, currentTitle: string) => {
        setEditingId(id);
        setEditTitle(currentTitle);
    };

    const saveEdit = (id: string) => {
        if (editTitle.trim()) {
            onRenameSession(id, editTitle.trim());
        }
        setEditingId(null);
    };

    return (
        <div className="w-72 bg-gray-900 text-gray-200 p-6 flex flex-col h-full border-r border-gray-800">
            <h2 className="text-2xl font-semibold mb-6">Lịch sử Chat</h2>
            <button
                onClick={onCreateSession}
                className="mb-6 px-4 py-2 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 transition duration-200"
            >
                + Phiên mới
            </button>
            <div className="flex-1 overflow-y-auto space-y-3">
                {sessions.map((session) => (
                    <div
                        key={session.id}
                        className={`p-3 rounded-lg cursor-pointer transition duration-200 ${
                            selectedSession === session.id
                                ? "bg-indigo-600 text-white"
                                : "bg-gray-800 hover:bg-gray-700"
                        }`}
                    >
                        {editingId === session.id ? (
                            <div className="flex items-center gap-2">
                                <input
                                    type="text"
                                    value={editTitle}
                                    onChange={(e) => setEditTitle(e.target.value)}
                                    onBlur={() => saveEdit(session.id)}
                                    onKeyPress={(e) => e.key === "Enter" && saveEdit(session.id)}
                                    className="flex-1 p-1 bg-gray-700 text-white rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    autoFocus
                                />
                                <button
                                    onClick={() => saveEdit(session.id)}
                                    className="px-2 py-1 bg-green-600 rounded hover:bg-green-700"
                                >
                                    Lưu
                                </button>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <div onClick={() => handleSelect(session.id)}>
                                    <p className="font-medium">{session.title}</p>
                                    <p className="text-xs text-gray-400">
                                        {new Date(session.timestamp).toLocaleString()}
                                    </p>
                                </div>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => startEditing(session.id, session.title)}
                                        className="px-2 py-1 bg-gray-600 rounded hover:bg-gray-500 text-xs"
                                    >
                                        Sửa
                                    </button>
                                    <button
                                        onClick={() => onDeleteSession(session.id)}
                                        className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-xs"
                                    >
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
}