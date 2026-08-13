import { useDescriptionEditor } from "@/hooks/features/stream-setup/useDescriptionEditor";
import { useLinkToggle } from "@/hooks/features/stream-setup/useLinkToggle";
import { EditorContent } from "@tiptap/react";
import DOMPurify from "dompurify";
import {
  Bold as BoldIcon,
  Italic as ItalicIcon,
  Link as LinkIcon,
  type LucideIcon,
} from "lucide-react";

type DescriptionEditorProps = {
  value: string;
  onChange: (html: string) => void;
  label?: string;
  placeholder?: string;
};

type ToolbarAction = {
  key: string;
  title: string;
  icon: LucideIcon;
  isActive: boolean;
  onClick: () => void;
};

export default function DescriptionEditor({
  value,
  onChange,
  label = "Description",
  placeholder = "Nhập mô tả...",
}: DescriptionEditorProps) {
  const { editor, editorId } = useDescriptionEditor({ value, onChange, label });
  const toggleLink = useLinkToggle(editor);

  if (!editor) {
    // Tiptap chưa sẵn sàng ở lần render đầu (SSR / lazy init)
    return null;
  }

  const toolbarActions: ToolbarAction[] = [
    {
      key: "bold",
      title: "Bold",
      icon: BoldIcon,
      isActive: editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      key: "italic",
      title: "Italic",
      icon: ItalicIcon,
      isActive: editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      key: "link",
      title: "Insert or edit link",
      icon: LinkIcon,
      isActive: editor.isActive("link"),
      onClick: toggleLink,
    },
  ];

  return (
    <div className="space-y-2">
      <label
        htmlFor={editorId}
        className="flex items-center justify-between text-xs font-semibold text-secondary"
      >
        <span>{label}</span>
        <span className="text-[10px] text-secondary">
          Bold, italic, and link supported
        </span>
      </label>

      <div className="rounded-xl border border-border bg-accent p-2">
        <div className="flex items-center gap-1 border-b border-border/60 pb-2">
          {toolbarActions.map(
            ({ key, title, icon: Icon, isActive, onClick }) => (
              <button
                key={key}
                type="button"
                onClick={onClick}
                title={title}
                aria-label={title}
                aria-pressed={isActive}
                className={[
                  "rounded-md p-2 transition-colors",
                  isActive
                    ? "bg-primary text-white"
                    : "text-secondary hover:bg-background hover:text-foreground",
                ].join(" ")}
              >
                <Icon className="h-4 w-4" />
              </button>
            ),
          )}
        </div>

        <div className="relative pt-2">
          {!editor.getText().trim() && (
            <span className="pointer-events-none absolute left-3 top-4 text-sm text-secondary">
              {placeholder}
            </span>
          )}
          <EditorContent editor={editor} />
        </div>
      </div>

      <div className="rounded-lg border border-border/60 bg-background/60 p-3">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-secondary">
          Preview
        </p>
        <div
          className="mt-2 text-sm text-foreground [&_a]:text-primary [&_a]:underline"
          dangerouslySetInnerHTML={{
            __html: value ? DOMPurify.sanitize(value) : "<p>...</p>",
          }}
        />
      </div>
    </div>
  );
}
