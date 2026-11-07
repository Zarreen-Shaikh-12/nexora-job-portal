import { useEffect, useRef } from "react";

export default function Modal({ title, onClose, children }) {
  const panelRef = useRef(null);
  const closeRef = useRef(onClose);

  // Always call the latest onClose without re-running the effect below
  useEffect(() => {
    closeRef.current = onClose;
  });

  useEffect(() => {
    const previouslyFocused = document.activeElement;
    const onKeyDown = (e) => e.key === "Escape" && closeRef.current();

    document.addEventListener("keydown", onKeyDown);
    document.body.style.overflow = "hidden"; // stop the page scrolling behind the modal
    panelRef.current?.focus();

    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused?.focus?.(); // give focus back to the button that opened it
    };
  }, []);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-ink/40 p-4"
      onMouseDown={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        tabIndex={-1}
        className="max-h-[90vh] w-full max-w-lg overflow-y-auto border border-line bg-white p-6 outline-none"
      >
        <div className="flex items-start justify-between gap-4">
          <h2 id="modal-title" className="text-xl">{title}</h2>
          <button type="button" onClick={onClose} aria-label="Close dialog" className="text-stone-500 hover:text-ink">
            ✕
          </button>
        </div>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
