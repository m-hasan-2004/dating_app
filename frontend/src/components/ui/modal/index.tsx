"use client";
import React, { useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { twMerge } from "tailwind-merge";
import { useTranslation } from "@/context/LanguageContext";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
  children: React.ReactNode;
  showCloseButton?: boolean;
  isFullscreen?: boolean;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className,
  showCloseButton = true,
  isFullscreen = false,
}) => {
  const modalRef = useRef<HTMLDivElement>(null);
  const [mounted, setMounted] = useState(false);
  const { isRTL } = useTranslation();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen, onClose]);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      const activeModals = document.querySelectorAll(".app-modal-root");
      if (activeModals.length <= 1) {
        document.body.style.overflow = "unset";
      }
    }

    return () => {
      const activeModals = document.querySelectorAll(".app-modal-root");
      if (activeModals.length <= 1) {
        document.body.style.overflow = "unset";
      }
    };
  }, [isOpen]);

  if (!isOpen || !mounted) return null;

  const contentClasses = isFullscreen
    ? "w-full h-full min-h-screen"
    : twMerge(
        "relative w-full max-w-lg rounded-3xl bg-white dark:bg-gray-900 shadow-2xl overflow-hidden border border-slate-200/90 dark:border-gray-700 ring-1 ring-slate-900/5 dark:ring-white/10 mx-auto text-start",
        className
      );

  return createPortal(
    <div
      className="fixed inset-0 z-[99999] overflow-y-auto app-modal-root"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {!isFullscreen && (
        <div
          className="fixed inset-0 h-full w-full bg-black/60 dark:bg-black/80 backdrop-blur-md modal-backdrop transition-opacity duration-300"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Centering wrapper */}
      <div className="flex min-h-full items-center justify-center p-4 sm:p-6 text-center">
        <div
          ref={modalRef}
          className={contentClasses}
          onClick={(e) => e.stopPropagation()}
        >
          {showCloseButton && (
            <button
              onClick={onClose}
              type="button"
              className={`absolute ${
                isRTL ? "left-4" : "right-4"
              } top-4 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition-colors hover:bg-slate-200 hover:text-slate-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white cursor-pointer`}
              title={isRTL ? "بستن" : "Close"}
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  fillRule="evenodd"
                  clipRule="evenodd"
                  d="M6.04289 16.5413C5.65237 16.9318 5.65237 17.565 6.04289 17.9555C6.43342 18.346 7.06658 18.346 7.45711 17.9555L11.9987 13.4139L16.5408 17.956C16.9313 18.3466 17.5645 18.3466 17.955 17.956C18.3455 17.5655 18.3455 16.9323 17.955 16.5418L13.4129 11.9997L17.955 7.4576C18.3455 7.06707 18.3455 6.43391 17.955 6.04338C17.5645 5.65286 16.9313 5.65286 16.5408 6.04338L11.9987 10.5855L7.45711 6.0439C7.06658 5.65338 6.43342 5.65338 6.04289 6.0439C5.65237 6.43442 5.65237 7.06759 6.04289 7.45811L10.5845 11.9997L6.04289 16.5413Z"
                  fill="currentColor"
                />
              </svg>
            </button>
          )}
          <div className="w-full">{children}</div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default Modal;

