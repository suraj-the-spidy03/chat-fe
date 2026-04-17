/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { RefreshCcw } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:4444");

export default function Home() {
  const [message, setMessage] = useState("");
  const [messageList, setMessageList] = useState<any[]>([]);
  const [userId] = useState(() => Math.random().toString(36).substring(7));

  const bottomRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = () => {
    if (!message.trim()) return;

    socket.emit("post_message", {
      userId,
      text: message,
    });

    setMessage("");
  };

  useEffect(() => {
    socket.on("get_message", (data) => {
      setMessageList((prev) => [...prev, data]);
    });

    return () => {
      socket.off("get_message");
    };
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-zinc-900 to-black flex items-center justify-center p-3">
      <div className="w-full max-w-md h-[90vh] flex flex-col rounded-3xl overflow-hidden shadow-2xl border border-zinc-800 bg-zinc-950">
        <div className="bg-zinc-900 px-4 py-4 flex items-center justify-between border-b border-zinc-800">
          <h1 className="text-white font-semibold text-lg">Chat</h1>
          <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
        </div>

        {messageList.length >= 100 && (
          <div className="flex justify-center my-2">
            <button
              onClick={() => window.location.reload()}
              className="flex items-center gap-2 bg-red-500 hover:bg-red-600 
    text-white px-4 py-2 rounded-full shadow-lg
    transition-all duration-300 hover:scale-105 active:scale-95"
            >
              <RefreshCcw className="w-4 h-4 animate-spin-slow" />
              Refresh Chat
            </button>
          </div>
        )}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3">
          {messageList.map((meg: any, ind) => {
            const isMe = meg.userId === userId;

            return (
              <div
                key={ind}
                className={`flex ${isMe ? "justify-end" : "justify-start"}`}
              >
                <div
                  className={`px-4 py-2 rounded-2xl text-sm max-w-[75%] break-words shadow-md
                  ${
                    isMe
                      ? "bg-yellow-400 text-black rounded-br-sm"
                      : "bg-zinc-800 text-white rounded-bl-sm"
                  }`}
                >
                  {meg.text}
                </div>
              </div>
            );
          })}

          <div ref={bottomRef} />
        </div>

        <div className="p-3 border-t border-zinc-800 bg-zinc-900 flex gap-2">
          <input
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Send a snap..."
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage();
              }
            }}
            className="flex-1 px-4 py-2 rounded-full bg-zinc-800 text-white placeholder-gray-400
            focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          <button
            onClick={sendMessage}
            className="bg-yellow-400 hover:bg-yellow-500 text-black font-semibold px-5 py-2 rounded-full transition"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
