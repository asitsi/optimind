"use client"
import { Loader2, Send } from "lucide-react";

export default function PromptInput({ textareaRef, input, setInput, isLoading, onSubmit, onKeyDown }) {
  return (
    <div className="fixed bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-900/90 to-transparent backdrop-blur-sm">
      <div className="max-w-4xl mx-auto">
        <div className="relative group">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-2xl opacity-75 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>

          <div className="relative flex items-end backdrop-blur-xl bg-white/10 border border-white/20 rounded-2xl p-2 shadow-2xl">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={onKeyDown}
              placeholder="Ask something amazing..."
              disabled={isLoading}
              rows={1}
              style={{ maxHeight: '300px', overflowY: 'auto' }}
              className="flex-1 resize-none bg-transparent text-white placeholder-gray-400 px-6 py-4 focus:outline-none text-lg scrollbar-thin scrollbar-thumb-white/30 scrollbar-track-transparent"
            />

            <button
              onClick={() => {
                if (!isLoading && input.trim()) {
                  onSubmit();
                  setInput('');
                }
              }}
              disabled={isLoading || !input.trim()}
              className="group/btn relative overflow-hidden bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 disabled:from-gray-600 disabled:to-gray-700 text-white p-4 rounded-xl transition-all duration-300 hover:scale-105 disabled:scale-100 disabled:opacity-50 shadow-lg hover:shadow-xl"
            >
              {isLoading ? (
                <Loader2 className="w-6 h-6 animate-spin" />
              ) : (
                <Send className="w-6 h-6 group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-transform duration-200" />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-1000"></div>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}


