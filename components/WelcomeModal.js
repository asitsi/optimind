"use client"
import { useState } from "react";

export default function WelcomeModal({ isOpen, onStart }) {
  const [selectedOptions, setSelectedOptions] = useState([]);
  const [selectionError, setSelectionError] = useState("");
  const modelOptions = ["ChatGPT", "DeepSeek", "Claude", "Gemini"];

  if (!isOpen) return null;

  const toggleOption = (option) => {
    setSelectionError("");
    setSelectedOptions((prev) => {
      if (prev.includes(option)) {
        return prev.filter((o) => o !== option);
      }
      if (prev.length >= 2) {
        setSelectionError("You can select only 2 options.");
        return prev;
      }
      return [...prev, option];
    });
  };

  const start = () => {
    if (selectedOptions.length !== 2) {
      setSelectionError("Please select exactly 2 options to start.");
      return;
    }
    try {
      localStorage.setItem("selectedModels", JSON.stringify(selectedOptions));
      localStorage.setItem("hasSeenWelcome", "1");
    } catch (_) {}
    onStart?.(selectedOptions);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="w-full max-w-md rounded-2xl border border-white/20 bg-white/10 p-6 text-white shadow-2xl">
        <h3 className="mb-2 text-xl font-semibold">Welcome to Optimind</h3>
        <p className="text-gray-200">Choose your AI model and start chatting with it!</p>

        <div className="mt-4 grid grid-cols-2 gap-3">
          {modelOptions.map((opt) => {
            const active = selectedOptions.includes(opt);
            return (
              <button
                key={opt}
                onClick={() => toggleOption(opt)}
                aria-pressed={active}
                className={`rounded-lg border px-3 py-2 text-sm transition ${
                  active
                    ? "border-blue-400 bg-blue-500/20"
                    : "border-white/20 bg-white/5 hover:bg-white/10"
                }`}
              >
                {opt}
              </button>
            );
          })}
        </div>

        <div className="mt-3 text-sm">
          <span className="text-gray-300">Chosen:</span>{" "}
          {selectedOptions.length > 0 ? (
            <span className="text-white">{selectedOptions.join(", ")}</span>
          ) : (
            <span className="text-gray-400">None</span>
          )}
        </div>
        {selectionError && <div className="mt-2 text-sm text-red-300">{selectionError}</div>}

        <div className="mt-6 flex justify-end">
          <button
            onClick={start}
            disabled={selectedOptions.length !== 2}
            className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 px-4 py-2 transition hover:from-blue-600 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Start
          </button>
        </div>
      </div>
    </div>
  );
}


