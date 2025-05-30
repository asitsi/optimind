import React, { useState } from "react";
import { Send, Bot, Zap, Loader2, AlertCircle } from "lucide-react";
import ChatResponse from "./ChatResponse";
import { chatWithGPT, chatWithDeepSeek } from "./api";

const ChatResponses = ({ response, isLoading, title, icon: Icon, gradient }) => {
  return (
    <div className="group relative">
      <div className={`relative backdrop-blur-xl  border border-white/20 rounded-2xl p-6 shadow-2xl transition-all duration-500 hover:scale-[1.02] hover:shadow-3xl ${gradient}`}>
        {/* Animated border gradient */}
        <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
        
        <div className="flex items-center gap-3 mb-4">
          <div className={`p-2 rounded-xl ${gradient} shadow-lg`}>
            <Icon className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">{title}</h3>
        </div>
        
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 text-blue-400 animate-spin" />
              <div className="absolute inset-0 rounded-full bg-blue-400/20 animate-ping"></div>
            </div>
            <span className="ml-3 text-blue-200 animate-pulse">Generating response...</span>
          </div>
        ) : response ? (
          
            <ChatResponse response={response}/>
        ) : (
          <div className="text-center py-12 text-gray-400">
            <Bot className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p>Response will appear here...</p>
          </div>
        )}
      </div>
    </div>
  );
};

const App = () => {
  const [input, setInput] = useState("");
  const [response, setResponse] = useState("");
  const [deepSeekResponse, setDeepSeekResponse] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setResponse("");
      setDeepSeekResponse("");

      const [reply, deepSeekReply] = await Promise.all([
        chatWithGPT(input),
        chatWithDeepSeek(input),
      ]);

      setResponse(reply);
      setDeepSeekResponse(deepSeekReply);
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgZmlsbD0ibm9uZSIgZmlsbC1ydWxlPSJldmVub2RkIj4KPGcgZmlsbD0iIzRmNDZlNSIgZmlsbC1vcGFjaXR5PSIwLjA1Ij4KPHBhdGggZD0iTTM2IDM0djEwaC0yVjM0aDJ6TTIwIDMwdjEwaC0yVjMwaDJ6TTQ0IDMydjEwaC0yVjMyaDJ6TTI4IDM2djEwaC0yVjM2aDJ6Ii8+CjwvZz4KPC9nPgo8L3N2Zz4=')] opacity-30"></div>
        
        {/* Floating orbs */}
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/30 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 right-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-pink-500/20 rounded-full blur-3xl animate-pulse delay-2000"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
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
          <p className="text-gray-300 text-lg">Compare responses from ChatGPT and DeepSeek</p>
        </header>

        {/* Error display */}
        {error && (
          <div className="mx-auto mb-6 max-w-2xl px-6">
            <div className="flex items-center gap-3 p-4 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        {/* Chat responses */}
        <main className="flex-1 px-6 pb-32">
          <div className="max-w-7xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <ChatResponses
                response={response}
                isLoading={isLoading}
                title="ChatGPT"
                icon={Bot}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
              <ChatResponses
                response={deepSeekResponse}
                isLoading={isLoading}
                title="DeepSeek"
                icon={Zap}
                gradient="bg-gradient-to-br from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </main>

        {/* Input form */}
        <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur-sm">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="relative group">
                {/* Animated border */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
                
                <div className="relative flex items-center backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSubmit(e)}
                    placeholder="Ask something amazing..."
                    disabled={isLoading}
                    className="flex-1 bg-transparent text-white placeholder-gray-400 px-6 py-4 focus:outline-none text-lg"
                  />
                  <button
                    onClick={handleSubmit}
                    disabled={isLoading || !input.trim()}
                    className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl"
                  >
                    {isLoading ? (
                      <Loader2 className="w-6 h-6 animate-spin" />
                    ) : (
                      <Send className="w-6 h-6 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
                    )}
                    
                    {/* Button shine effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;