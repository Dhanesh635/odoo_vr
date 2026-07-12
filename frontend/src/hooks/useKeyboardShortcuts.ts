import { useEffect } from "react";

type ShortcutOptions = {
  key: string;
  ctrlKey?: boolean;
  metaKey?: boolean;
  shiftKey?: boolean;
  preventDefault?: boolean;
};

export function useKeyboardShortcut(
  options: ShortcutOptions | ShortcutOptions[],
  callback: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      // Don't trigger if user is typing in an input/textarea (unless it's Esc)
      if (
        (event.target instanceof HTMLInputElement ||
          event.target instanceof HTMLTextAreaElement) &&
        event.key !== "Escape"
      ) {
        return;
      }

      const shortcuts = Array.isArray(options) ? options : [options];

      const isMatch = shortcuts.some((shortcut) => {
        const keyMatch = event.key.toLowerCase() === shortcut.key.toLowerCase();
        const ctrlMatch = shortcut.ctrlKey ? event.ctrlKey : !event.ctrlKey;
        const metaMatch = shortcut.metaKey ? event.metaKey : !event.metaKey;
        const shiftMatch = shortcut.shiftKey ? event.shiftKey : !event.shiftKey;

        // Allow matching either Ctrl OR Meta for Cmd/Ctrl shortcuts
        if (shortcut.ctrlKey || shortcut.metaKey) {
          return keyMatch && (event.ctrlKey || event.metaKey) && shiftMatch;
        }

        return keyMatch && ctrlMatch && metaMatch && shiftMatch;
      });

      if (isMatch) {
        if (shortcuts.find((s) => s.preventDefault !== false)) {
          event.preventDefault();
        }
        callback(event);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [options, callback]);
}
