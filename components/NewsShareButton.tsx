"use client";

import { Share2, Check } from "lucide-react";
import { useState } from "react";

export default function NewsShareButton({
  title,
  text,
}: {
  title: string;
  text: string;
}) {
  const [copied, setCopied] = useState(false);

  const handleShare = async () => {
    const url = window.location.href;

    // Если браузер поддерживает нативный шеринг (мобилки)
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: "Check this out on FindMini!",
          url: url,
        });
      } catch (err) {
        console.log("Share canceled");
      }
    } else {
      // Иначе копируем в буфер (десктоп)
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <button
      onClick={handleShare}
      className={`p-3 rounded-full transition-all duration-300 ${
        copied
          ? "bg-green-500 text-white hover:bg-green-600"
          : "bg-blue-500 text-white hover:bg-blue-600"
      }`}
    >
      {copied ? <Check size={20} /> : <Share2 size={20} />}
    </button>
  );
}
