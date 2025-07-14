import { Bot, Loader2 } from "lucide-react";
import ChatResponse from "./ChatResponse";

 const ChatUI = ({ response, isLoading, title, icon: Icon, gradient }) => {
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

export default ChatUI