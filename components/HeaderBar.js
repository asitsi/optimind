"use client"
import Link from "next/link";
import { Bot } from "lucide-react";

export default function HeaderBar() {
  return (
    <header className="text-center py-12">
      <div className="inline-flex items-center gap-3 px-6 py-3 backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl shadow-2xl mb-6">
        <div className="flex gap-2">
          <div className="w-3 h-3 bg-red-400 rounded-full animate-pulse"></div>
          <div className="w-3 h-3 bg-yellow-400 rounded-full animate-pulse delay-100"></div>
          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse delay-200"></div>
        </div>
        <Bot className="w-6 h-6 text-blue-400" />
        <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
          AI Chat Comparison
        </h1>
      </div>
      <p className="text-gray-300 text-lg">Compare responses</p>
      <Link href="/history" className="text-blue-400 hover:underline">
        View History
      </Link>
    </header>
  );
}


