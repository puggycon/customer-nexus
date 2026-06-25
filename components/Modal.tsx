"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Modal({
  children,
  widthClassName = "max-w-md",
}: {
  children: React.ReactNode;
  widthClassName?: string;
}) {
  const router = useRouter();

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") router.back();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [router]);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 backdrop-blur-sm"
      onClick={() => router.back()}
    >
      <div
        role="dialog"
        aria-modal="true"
        onClick={(e) => e.stopPropagation()}
        className={`w-full ${widthClassName} rounded-xl bg-white p-6 shadow-xl`}
      >
        {children}
      </div>
    </div>
  );
}
