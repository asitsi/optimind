"use client"
import { useRef, useState } from "react";
import { Bot, AlertCircle } from "lucide-react";
import ChatUI from "@/components/ChatUI";
import { useEffect } from "react";
import { chatWithDeepSeek, chatWithGPT, chatWithGemini } from "@/libs/apis";
import BackgroundFX from "@/components/BackgroundFX";
import HeaderBar from "@/components/HeaderBar";
import SelectedBadges from "@/components/SelectedBadges";
import WelcomeModal from "@/components/WelcomeModal";
import PromptInput from "@/components/PromptInput";

export default function Home() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [isWelcomeOpen, setIsWelcomeOpen] = useState(false);
  const [savedOptions, setSavedOptions] = useState([]);
  const [selectedResponses, setSelectedResponses] = useState([]);

  const textareaRef = useRef(null);

  // Auto resize textarea
  useEffect(() => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto'; // Reset height before calculation
      const newHeight = Math.min(textarea.scrollHeight, 400);
      textarea.style.height = `${newHeight}px`;
    }
  }, [input]);

  // Show welcome popup on initial page load
  useEffect(() => {
    try {
      const hasSeen = localStorage.getItem("hasSeenWelcome");
      if (!hasSeen) {
        setIsWelcomeOpen(true);
      }
      const stored = localStorage.getItem("selectedModels");
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed)) setSavedOptions(parsed);
        } catch (_) { }
      }
    } catch (e) {
      setIsWelcomeOpen(true);
    }
  }, []);

  const onStartSelection = (opts) => {
    setSavedOptions(opts);
    setIsWelcomeOpen(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (!isLoading && input.trim()) {
        handleSubmit(input);
        setInput('');
      }
    }
  };

  const handleSubmit = async (e) => {
    if (!input.trim()) return;

    try {
      setIsLoading(true);
      setError("");
      setSelectedResponses(["", ""]);

      const models =
        savedOptions && savedOptions.length === 2
          ? savedOptions
          : ["ChatGPT", "DeepSeek"];

      const fns = {
        ChatGPT: () => chatWithGPT(input),
        DeepSeek: () => chatWithDeepSeek(input),
        Gemini: () => chatWithGemini(input),
      };

      const calls = models.map((m) => (fns[m] ? fns[m]() : Promise.resolve("")));
      const results = await Promise.all(calls);

      setSelectedResponses(results);

      const historyItem = {
        timestamp: new Date().toISOString(),
        question: input,
        selections: models,
        responses: results,
        chatGPTResponse: models.includes("ChatGPT")
          ? results[models.indexOf("ChatGPT")]
          : undefined,
        deepSeekResponse: models.includes("DeepSeek")
          ? results[models.indexOf("DeepSeek")]
          : undefined,
        geminiResponse: models.includes("Gemini")
          ? results[models.indexOf("Gemini")]
          : undefined,
      };

      const existingHistory = JSON.parse(
        localStorage.getItem("chatHistory") || "[]"
      );
      localStorage.setItem(
        "chatHistory",
        JSON.stringify([historyItem, ...existingHistory])
      );
    } catch (err) {
      setError("Failed to get response. Please try again.");
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      <BackgroundFX />

      {/* Main content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <WelcomeModal isOpen={isWelcomeOpen} onStart={onStartSelection} />

        <HeaderBar />
        <SelectedBadges options={savedOptions} onChangeClick={() => setIsWelcomeOpen(true)} />

        {error && (
          <div className="mx-auto mb-6 max-w-2xl px-6">
            <div className="flex items-center gap-3 p-4 backdrop-blur-xl bg-red-500/20 border border-red-500/30 rounded-xl text-red-200">
              <AlertCircle className="w-5 h-5" />
              <span>{error}</span>
            </div>
          </div>
        )}

        <main className="flex-1 px-6 pb-32">
          <div className="max-w-10xl mx-auto">
            <div className="grid lg:grid-cols-2 gap-8">
              <ChatUI
                response={selectedResponses[0] || ""}
                isLoading={isLoading}
                title={savedOptions?.[0] || "ChatGPT"}
                icon={Bot}
                gradient="bg-gradient-to-br from-blue-500 to-cyan-500"
              />
              <ChatUI
                response={selectedResponses[1] || ""}
                isLoading={isLoading}
                title={savedOptions?.[1] || "DeepSeek"}
                icon={Bot}
                gradient="bg-gradient-to-br from-purple-500 to-pink-500"
              />
            </div>
          </div>
        </main>

        <PromptInput
          textareaRef={textareaRef}
          input={input}
          setInput={setInput}
          isLoading={isLoading}
          onKeyDown={handleKeyDown}
          onSubmit={() => handleSubmit()}
        />

      </div>
    </div>
  );
}
