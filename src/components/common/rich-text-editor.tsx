"use client";

import { useEffect } from "react";
import { useTranslations } from "next-intl";
import { EditorContent, useEditor, useEditorState } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import TextAlign from "@tiptap/extension-text-align";
import { TableKit } from "@tiptap/extension-table";
import {
  AlignCenter,
  AlignLeft,
  AlignRight,
  Bold,
  Code2,
  Italic,
  Link2,
  Link2Off,
  List,
  ListOrdered,
  Quote,
  Redo2,
  Strikethrough,
  Table2,
  Underline,
  Undo2,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";

import "./tiptap.css";

interface ToolbarButtonProps {
  label: string;
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}

function ToolbarButton({ label, active, onClick, children }: ToolbarButtonProps) {
  return (
    <Button
      type="button"
      variant={active ? "secondary" : "ghost"}
      size="icon"
      aria-label={label}
      aria-pressed={active}
      title={label}
      onClick={onClick}
    >
      {children}
    </Button>
  );
}

interface RichTextEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export function RichTextEditor({
  value,
  onChange,
  placeholder,
}: RichTextEditorProps) {
  const t = useTranslations("Editor");

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: { levels: [1, 2, 3] },
        link: { openOnClick: false },
      }),
      Placeholder.configure({ placeholder: placeholder ?? "" }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TableKit.configure({ table: { resizable: false } }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate: ({ editor: instance }) => onChange(instance.getHTML()),
  });

  // Reset the document when the caller swaps content (e.g. reopening the
  // editor after a refresh) without stomping on in-progress typing.
  useEffect(() => {
    if (!editor || editor.isFocused) return;
    if (value === editor.getHTML()) return;
    editor.commands.setContent(value, { emitUpdate: false });
  }, [editor, value]);

  const state = useEditorState({
    editor,
    selector: ({ editor: current }) => ({
      heading: current?.isActive("heading", { level: 1 })
        ? "h1"
        : current?.isActive("heading", { level: 2 })
          ? "h2"
          : current?.isActive("heading", { level: 3 })
            ? "h3"
            : "p",
      bold: current?.isActive("bold") ?? false,
      italic: current?.isActive("italic") ?? false,
      underline: current?.isActive("underline") ?? false,
      strike: current?.isActive("strike") ?? false,
      bulletList: current?.isActive("bulletList") ?? false,
      orderedList: current?.isActive("orderedList") ?? false,
      blockquote: current?.isActive("blockquote") ?? false,
      codeBlock: current?.isActive("codeBlock") ?? false,
      alignLeft: current?.isActive({ textAlign: "left" }) ?? false,
      alignCenter: current?.isActive({ textAlign: "center" }) ?? false,
      alignRight: current?.isActive({ textAlign: "right" }) ?? false,
      link: current?.isActive("link") ?? false,
      canUndo: current?.can().undo() ?? false,
      canRedo: current?.can().redo() ?? false,
    }),
  });

  if (!editor) {
    return (
      <div
        className="tiptap-editor min-h-80 animate-pulse"
        role="status"
        aria-busy="true"
        aria-label={t("loading")}
      />
    );
  }

  const headingValue = state?.heading ?? "p";
  const headingLabels: Record<string, string> = {
    p: t("paragraph"),
    h1: t("heading1"),
    h2: t("heading2"),
    h3: t("heading3"),
  };

  const setHeading = (value: string) => {
    if (value === "p") {
      editor.chain().focus().setParagraph().run();
      return;
    }

    editor
      .chain()
      .focus()
      .toggleHeading({ level: Number(value.slice(1)) as 1 | 2 | 3 })
      .run();
  };

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt(t("linkPrompt"), previousUrl ?? "https://");

    if (url === null) return;

    if (url.trim() === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor
      .chain()
      .focus()
      .extendMarkRange("link")
      .setLink({ href: url.trim() })
      .run();
  };

  return (
    <div className="tiptap-editor">
      <div className="flex flex-wrap items-center gap-1 border-b p-1.5">
        <Select value={headingValue} onValueChange={(next) => next && setHeading(next)}>
          <SelectTrigger size="sm" aria-label={t("textStyle")} className="w-36">
            <SelectValue>
              {(selected) => headingLabels[selected ?? "p"] ?? t("paragraph")}
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="p">{t("paragraph")}</SelectItem>
            <SelectItem value="h1">{t("heading1")}</SelectItem>
            <SelectItem value="h2">{t("heading2")}</SelectItem>
            <SelectItem value="h3">{t("heading3")}</SelectItem>
          </SelectContent>
        </Select>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("bold")}
          active={state?.bold ?? false}
          onClick={() => editor.chain().focus().toggleBold().run()}
        >
          <Bold />
        </ToolbarButton>
        <ToolbarButton
          label={t("italic")}
          active={state?.italic ?? false}
          onClick={() => editor.chain().focus().toggleItalic().run()}
        >
          <Italic />
        </ToolbarButton>
        <ToolbarButton
          label={t("underline")}
          active={state?.underline ?? false}
          onClick={() => editor.chain().focus().toggleUnderline().run()}
        >
          <Underline />
        </ToolbarButton>
        <ToolbarButton
          label={t("strikethrough")}
          active={state?.strike ?? false}
          onClick={() => editor.chain().focus().toggleStrike().run()}
        >
          <Strikethrough />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("bulletList")}
          active={state?.bulletList ?? false}
          onClick={() => editor.chain().focus().toggleBulletList().run()}
        >
          <List />
        </ToolbarButton>
        <ToolbarButton
          label={t("orderedList")}
          active={state?.orderedList ?? false}
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
        >
          <ListOrdered />
        </ToolbarButton>
        <ToolbarButton
          label={t("blockquote")}
          active={state?.blockquote ?? false}
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
        >
          <Quote />
        </ToolbarButton>
        <ToolbarButton
          label={t("codeBlock")}
          active={state?.codeBlock ?? false}
          onClick={() => editor.chain().focus().toggleCodeBlock().run()}
        >
          <Code2 />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("alignLeft")}
          active={state?.alignLeft ?? false}
          onClick={() => editor.chain().focus().setTextAlign("left").run()}
        >
          <AlignLeft />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignCenter")}
          active={state?.alignCenter ?? false}
          onClick={() => editor.chain().focus().setTextAlign("center").run()}
        >
          <AlignCenter />
        </ToolbarButton>
        <ToolbarButton
          label={t("alignRight")}
          active={state?.alignRight ?? false}
          onClick={() => editor.chain().focus().setTextAlign("right").run()}
        >
          <AlignRight />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("link")}
          active={state?.link ?? false}
          onClick={setLink}
        >
          <Link2 />
        </ToolbarButton>
        <ToolbarButton
          label={t("removeLink")}
          active={false}
          onClick={() => editor.chain().focus().extendMarkRange("link").unsetLink().run()}
        >
          <Link2Off />
        </ToolbarButton>
        <ToolbarButton
          label={t("table")}
          active={false}
          onClick={() =>
            editor
              .chain()
              .focus()
              .insertTable({ rows: 3, cols: 3, withHeaderRow: true })
              .run()
          }
        >
          <Table2 />
        </ToolbarButton>

        <Separator orientation="vertical" className="mx-1 h-6" />

        <ToolbarButton
          label={t("undo")}
          active={false}
          onClick={() => editor.chain().focus().undo().run()}
        >
          <Undo2 />
        </ToolbarButton>
        <ToolbarButton
          label={t("redo")}
          active={false}
          onClick={() => editor.chain().focus().redo().run()}
        >
          <Redo2 />
        </ToolbarButton>
      </div>

      <EditorContent editor={editor} className="tiptap-content" />
    </div>
  );
}
