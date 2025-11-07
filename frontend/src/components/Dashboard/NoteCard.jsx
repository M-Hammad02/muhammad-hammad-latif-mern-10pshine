import React, { useState } from "react";
import { snip } from "../../utils/helpers";

export default function NoteCard({ note, onEdit, onDelete, onMove }) {
  const [confirmDialog, setConfirmDialog] = useState(false);

  const handleDelete = () => {
    setConfirmDialog(true);
  };

  const confirmDelete = () => {
    onDelete(note.id);
    setConfirmDialog(false);
  };

  return (
    <>
      <article className="bg-primary p-4 rounded shadow-[0_0_15px_rgba(0,0,0,0.2)] border-2 border-secondary cursor-pointer hover:shadow-[0_0_15px_rgba(0,0,0,0.4)]">
        <header className="flex justify-between items-start gap-2">
          <h3 className="font-semibold">{note.title || "Untitled"}</h3>
          <div className="text-xs text-secondary">{note.secret ? "🔒" : ""}</div>
        </header>
        <p
          className="mt-2 text-sm text-secondary line-clamp-3"
          dangerouslySetInnerHTML={{
            __html: snip(note.content || ""),
          }}
        />
        <div className="mt-3 flex items-center justify-between">
          <small className="text-xs text-secondary">
            {new Date(
              note.updatedAt || note.createdAt || note.id
            ).toLocaleString()}
          </small>
          <div className="flex gap-2">
            <button
              className="text-sm text-secondary"
              onClick={() => onEdit(note)}
            >
              Edit
            </button>
            {/* <button className="text-sm text-blue-600" onClick={() => onMove(note)}>Move</button> */}
            <button
  onClick={() => onMove && onMove(note)}
  className="text-blue-500 hover:text-blue-700 text-sm"
>
  Move
</button>
            <button
              className="text-sm text-red-600"
              onClick={handleDelete}
            >
              Delete
            </button>
          </div>
        </div>
      </article>

      {/* ✅ Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Delete Note “{note.title || "Untitled"}”?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Are you sure you want to delete this note? This action
              cannot be undone.
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDialog(false)}
                className="px-4 py-1 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
