import React, { useEffect, useState } from "react";
import "react-quill/dist/quill.snow.css";
import ReactQuill from "react-quill";

export default function NoteEditor({ note: initial, onClose, onSave, folders = [] }) {
  const [title, setTitle] = useState(initial?.title || "");
  const [content, setContent] = useState(initial?.content || "");
  const [secret, setSecret] = useState(initial?.secret || false);
  const [folderId, setFolderId] = useState(initial?.folderId || null);
  const [file, setFile] = useState(null);

  useEffect(() => {
    if (initial) {
      setTitle(initial.title || "");
      setContent(initial.content || "");
      setSecret(initial.secret || false);
      setFolderId(initial.folderId || null);
    } else if (folders.length > 0) {
      // ✅ default to first folder if any
      setFolderId(folders[0].id);
    }
  }, [initial, folders]);

  const save = async () => {
    const payload = {
      id: initial?.id,
      title,
      content,
      secret,
      folderId: folderId || null,
      updatedAt: new Date().toISOString(),
      createdAt: initial?.createdAt || new Date().toISOString(),
      attachments: file
        ? [{ name: file.name, size: file.size }]
        : initial?.attachments || [],
    };
    await onSave(payload);
  };

  const onFileChange = (e) => setFile(e.target.files?.[0] || null);

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4 z-50">
      <div className="w-full max-w-4xl bg-white rounded shadow p-4">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-lg font-semibold">
            {initial ? "Edit Note" : "New Note"}
          </h3>
          <div className="flex gap-2">
            <button className="px-3 py-1 border rounded bg-primary text-secondary" onClick={onClose}>
              Cancel
            </button>
            <button
              className="px-3 py-1 bg-secondary text-primary rounded"
              onClick={save}
            >
              Save
            </button>
          </div>
        </div>

        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Title"
          className="w-full p-2 border rounded mb-2"
        />

        <div className="flex gap-2 mb-2 items-center">
          <select
            value={folderId || ""}
            onChange={(e) => setFolderId(e.target.value || null)}
            className="p-2 border rounded w-48 bg-primary"
          >
            <option value="">No Folder</option>
            {folders.map((f) => (
              <option key={f.id} value={f.id}>
                {f.name}
              </option>
            ))}
          </select>

          {/* <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={secret}
              onChange={(e) => setSecret(e.target.checked)}
            />
            Secret
          </label> */}

          <input type="file" onChange={onFileChange} />
        </div>

        <div className="mb-2">
          <ReactQuill
            theme="snow"
            value={content}
            onChange={setContent}
            placeholder="Write your note..."
            modules={{
              toolbar: [
                [{ header: [1, 2, false] }],
                ["bold", "italic", "underline", "strike"],
                [{ list: "ordered" }, { list: "bullet" }],
                ["link", "image"],
                ["clean"],
              ],
            }}
          />
        </div>

        <div className="text-xs text-gray-500 mt-2">
          Tip: Use toolbar to format. First non-empty line used in previews.
        </div>
      </div>
    </div>
  );
}
