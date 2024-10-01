import { EditorProvider, useCurrentEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { BoldIcon, Italic } from "lucide-react";
import React, { useEffect } from "react";

function MenuBar() {
  const { editor } = useCurrentEditor();

  if (!editor) {
    return null;
  }

  return (
    <div className="flex gap-2 mb-2">
      <button
        onClick={() => editor.chain().focus().toggleBold().run()}
        className={`flex gap-2 border-slate-300 border items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive("bold") ? "bg-primary-blue/40 text-black" : ""
        }`}
      >
        <BoldIcon className="w-4 h-4" />
        Bold
      </button>
      <button
        onClick={() => editor.chain().focus().toggleItalic().run()}
        className={`flex gap-2 border-slate-300 border items-center justify-center rounded-lg px-2 py-1 ${
          editor.isActive("italic") ? "bg-primary-blue/40 text-black" : ""
        }`}
      >
        <Italic className="w-4 h-4" />
        Italic
      </button>
    </div>
  );
}

const RichTextEditor = ({ content, setContent }) => {
  const extensions = [StarterKit];

  return (
    <div className="">
      <EditorProvider
        slotBefore={<MenuBar />}
        extensions={extensions}
        content={content}
        editorProps={{
          attributes: {
            class:
              "prose rounded-md border border-slate-300 py-2 px-4 text-small-regular bg-white outline-none focus:border-primary-light",
          },
        }}
        onUpdate={({ editor }) => setContent(editor.getHTML())}
      ></EditorProvider>
    </div>
  );
};

export default RichTextEditor;
