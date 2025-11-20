"use client"

import { Pencil } from "lucide-react";

export default function SelectedBadges({ options, onChangeClick }) {
  if (!options || options.length !== 2) return null;
  return (
    <div className="mx-auto -mt-6 mb-6 max-w-2xl px-6">
      <div className="flex items-center justify-center gap-3">
        <div className="flex items-center gap-2">
          {options.map((opt) => (
            <span
              key={opt}
              className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm text-white"
            >
              {opt}
            </span>
          ))}
        </div>
        <button
          type="button"
          aria-label="Change selection"
          onClick={onChangeClick}
          className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/10 p-2 text-white hover:bg-white/20 transition"
        >
          <Pencil className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}


