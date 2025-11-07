import React from "react";
import NoteCard from "./NoteCard";

export default function NotesList({ notes, onEdit, onDelete, onMove }) {
  if (!notes.length)
    return (
      <div className="p-6 text-center text-gray-500">
        No notes yet. Add one.
      </div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
      {notes.map((n) => (
        <NoteCard
          key={n.id}
          note={n}
          onEdit={onEdit}
          onDelete={onDelete}
          onMove={onMove}   
        />
      ))}
    </div>
  );
}
