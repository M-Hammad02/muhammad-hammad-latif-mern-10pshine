import React from "react";
import NoteEditor from "../components/Editor/NoteEditor";
import { useNavigate } from "react-router-dom";

export default function EditorPage(){
  const nav = useNavigate();
  const handleSave = () => nav("/");
  return (
    <div className="p-8">
      <div className="max-w-3xl mx-auto">
        <NoteEditor note={null} onClose={() => nav("/")} onSave={handleSave} folders={['General']} />
      </div>
    </div>
  );
}
