// pages/history.js
"use client"
import React, { useEffect, useState } from 'react';
import { Bot, Zap } from "lucide-react";
import ChatResponse from '@/components/ChatResponse';
import ChatUI from '@/components/ChatUI';

const History = () => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("chatHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzRmNDZlNSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTM2IDM0djEwaC0yVjM0aDJ6TTIwIDMwdjEwaC0yVjMwaDJ6TTQ0IDMydjEwaC0yVjMyaDJ6TTI4IDM2djEwaC0yVjM2aDJ6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-30"></div>
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col">
        <header className="text-center py-12">
          <div className="inline-flex items-center gap-3 px-6 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl mb-6">
            <div className="flex gap-2">
              <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
              <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
              <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
            </div>
            <Bot className="w-6 h-6 text-blue-400" />
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
              AI Chat History
            </h1>
          </div>
          <p className="text-gray-300 text-lg">Chat History</p>
        </header>

        <div className="px-6 pb-10">
          {history.length === 0 ? (
            <p className="text-gray-400">No history available.</p>
          ) : (
            history.map((item, index) => (
              <div key={index} className="mb-12">
                <p className="text-sm text-white mb-2">{new Date(item.timestamp).toLocaleString()}</p>
                <p className="mb-4 text-white"><strong>Q:</strong> {item.question}</p>
                <div className="grid lg:grid-cols-2 gap-8">
                  <ChatUI
                    response={item.chatGPTResponse}
                    isLoading={false}
                    title="ChatGPT"
                    icon={Bot}
                    gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
                  />
                  <ChatUI
                    response={item.deepSeekResponse}
                    isLoading={false}
                    title="DeepSeek"
                    icon={Zap}
                    gradient="bg-gradient-to-br from-purple-500 to-pink-500"
                  />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
