import type { Editor } from "@tiptap/react";
import { useCallback } from "react";

export function useLinkToggle(editor: Editor | null) {
  return useCallback(() => {
    if (!editor) return;

    const currentUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Nhập URL liên kết", currentUrl ?? "");

    if (url === null) return;

    if (!url.trim()) {
      editor.chain().focus().unsetLink().run();
      return;
    }

    editor.chain().focus().setLink({ href: url.trim() }).run();
  }, [editor]);
}