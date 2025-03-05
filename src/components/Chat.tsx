import {useEffect, useRef, useState} from "react";
import BarChart from "./BarChart";

interface Message {
    id: number;
    text?: string;
    chart?: { data: number[]; labels: string[]; title: string };
    sender: "user" | "bot";
}

interface ChatProps {
    sessionId: string;
}

export default function Chat({ sessionId }: ChatProps) {
    const [messages, setMessages] = useState<Message[]>(() => {
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        return (
            savedSessions[sessionId] || [
                { id: 1, text: "Xin chào! Tôi là bot LLM. Gõ 'vẽ biểu đồ' để thử nhé!", sender: "bot" },
            ]
        );
    });
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages]);

    useEffect(() => {
        const savedSessions = JSON.parse(localStorage.getItem("chatSessions") || "{}");
        savedSessions[sessionId] = messages;
        localStorage.setItem("chatSessions", JSON.stringify(savedSessions));
    }, [messages, sessionId]);

    const handleSend = async () => {
        if (!input.trim()) return;
        const userMessage: Message = { id: Date.now(), text: input, sender: "user" };
        setMessages((prev) => [...prev, userMessage]);
        setInput("");
        setIsLoading(true);

        try {
            await new Promise((resolve) => setTimeout(resolve, 1000));
            let botMessage: Message;
            if (input.toLowerCase().includes("vẽ biểu đồ")) {
                botMessage = {
                    id: Date.now() + 1,
                    chart: {
                        data: [12, 19, 3, 5],
                        labels: ["Tháng 1", "Tháng 2", "Tháng 3", "Tháng 4"],
                        title: "Doanh thu mẫu",
                    },
                    sender: "bot",
                };
            } else {
                botMessage = {
                    id: Date.now() + 1,
                    text: `Bạn vừa nói: "${input}". Đây là phản hồi từ bot!`,
                    sender: "bot",
                };
            }
            setMessages((prev) => [...prev, botMessage]);
        } catch (error) {
            console.error("Lỗi khi gọi API:", error);
            const errorMessage: Message = {
                id: Date.now() + 1,
                text: "Có lỗi xảy ra, thử lại nhé!",
                sender: "bot",
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === "Enter" && !isLoading) handleSend();
    };

    return (
        <div className="flex-1 flex flex-col h-full bg-gray-900">
            <div className="p-4 bg-gray-800 border-b border-gray-700 text-gray-200">
                <h2 className="text-xl font-semibold">Chat - {sessionId}</h2>
            </div>
            <div className="flex-1 p-6 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                    <div
                        key={msg.id}
                        className={`p-4 rounded-lg shadow-md max-w-[70%] ${
                            msg.sender === "user"
                                ? "ml-auto bg-indigo-600 text-white"
                                : "mr-auto bg-gray-700 text-gray-200"
                        }`}
                    >
                        {msg.text && <p>{msg.text}</p>}
                        {msg.chart && (
                            <div className="mt-2">
                                <BarChart data={msg.chart.data} labels={msg.chart.labels} title={msg.chart.title} />
                            </div>
                        )}
                    </div>
                ))}
                {isLoading && (
                    <div className="p-4 rounded-lg max-w-[70%] mr-auto bg-gray-600 text-gray-400 shadow-md">
                        Đang tải...
                    </div>
                )}
                <div ref={messagesEndRef} />
            </div>
            <div className="p-6 bg-gray-800 border-t border-gray-700">
                <div className="flex gap-3">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        onKeyPress={handleKeyPress}
                        disabled={isLoading}
                        className="flex-1 p-3 bg-gray-700 text-gray-200 rounded-lg border border-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-gray-600"
                        placeholder="Nhập tin nhắn (gõ 'vẽ biểu đồ' để thử)..."
                    />
                    <button
                        onClick={handleSend}
                        disabled={isLoading}
                        className="px-6 py-3 bg-indigo-600 text-white rounded-lg shadow-md hover:bg-indigo-700 disabled:bg-gray-500 transition duration-200"
                    >
                        {isLoading ? "..." : "Gửi"}
                    </button>
                </div>
            </div>
        </div>
    );
}