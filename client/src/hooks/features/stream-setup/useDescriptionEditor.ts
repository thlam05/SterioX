import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect, useId } from "react";

type UseDescriptionEditorParams = {
  value: string;
  onChange: (html: string) => void;
  label: string;
};

export function useDescriptionEditor({
  value,
  onChange,
  label,
}: UseDescriptionEditorParams) {
  const editorId = useId();

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        link: {
          openOnClick: false,
          autolink: true,
          linkOnPaste: true,
        },
      }),
    ],
    content: value,
    editorProps: {
      attributes: {
        id: editorId,
        class:
          "min-h-28 rounded-lg bg-background/80 px-3 py-2 text-sm text-foreground outline-none [&_a]:text-primary [&_a]:underline",
        "aria-label": label,
      },
    },
    onUpdate: ({ editor: updatedEditor }) => onChange(updatedEditor.getHTML()),
  });

  useEffect(() => {
    if (editor && value !== editor.getHTML()) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [editor, value]);

  return { editor, editorId };
}