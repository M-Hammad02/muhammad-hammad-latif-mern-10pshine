import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Sidebar({
  folders: propFolders,
  activeFolder,
  setActiveFolder,
  setSortBy,
  sortBy,
  refreshFolders,
}) {
  const [folders, setFolders] = useState([]);
  const [newName, setNewName] = useState("");
  const [confirmDialog, setConfirmDialog] = useState(null); // ✅ holds folder to delete

  // ✅ Sync folders from parent
  useEffect(() => {
    if (Array.isArray(propFolders)) setFolders(propFolders);
  }, [propFolders]);

  // ✅ Create folder
  const addFolder = async () => {
    const name = newName.trim();
    if (!name) return;
    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in again.");

      const res = await axios.post(
        "http://localhost:5001/api/folders",
        { name },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setFolders([...folders, res.data]);
      setNewName("");
    } catch (err) {
      console.error("❌ Folder creation failed:", err);
      alert("Failed to create folder. Check console.");
    }
  };

  // ✅ Trigger delete confirmation
  const handleDeleteClick = (folder) => {
    setConfirmDialog(folder);
  };

  // ✅ Confirm deletion
  const confirmDelete = async () => {
    if (!confirmDialog) return;

    try {
      const token = localStorage.getItem("token");
      if (!token) return alert("Please log in again.");

      await axios.delete(`http://localhost:5001/api/folders/${confirmDialog.id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setConfirmDialog(null);
      await refreshFolders();
    } catch (err) {
      console.error("❌ Folder deletion failed:", err);
      alert("Failed to delete folder. Check console.");
    }
  };

  return (
    <>
      {/* ✅ Sidebar UI */}
      <aside className="w-60 p-4 border-r hidden md:block relative">
        <div className="mb-4">
          <h4 className="font-semibold text-secondary">Folders</h4>
          <ul className="mt-2 space-y-2">
            <li
              className={`cursor-pointer text-secondary ${
                activeFolder === "all" ? "font-bold" : ""
              }`}
              onClick={() => setActiveFolder("all")}
            >
              All Notes
            </li>

            {folders.map((f) => (
              <li
                key={f.id}
                className={`flex justify-between items-center text-secondary ${
                  activeFolder === f.id ? "font-bold" : ""
                }`}
              >
                <span
                  className="cursor-pointer"
                  onClick={() => setActiveFolder(f.id)}
                >
                  {f.name}
                </span>
                <button
                  className="text-xs text-red-500 ml-2"
                  onClick={() => handleDeleteClick(f)}
                >
                  Delete
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="mb-4">
          <input
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            placeholder="New folder"
            className="w-full p-1 border rounded mb-2 text-secondary"
          />
          <div className="flex gap-2">
            <button
              onClick={addFolder}
              className="px-2 py-1 bg-secondary text-primary rounded"
            >
              Add
            </button>
            <button
              onClick={() => setNewName("")}
              className="px-2 py-1 border border-black rounded bg-primary text-secondary"
            >
              Clear
            </button>
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-secondary">Sort</h4>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="mt-2 p-1 w-full border rounded text-secondary bg-primary"
          >
            <option value="latest">Latest</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </aside>

      {/* ✅ Confirmation Dialog */}
      {confirmDialog && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
            <h3 className="text-lg font-semibold mb-4">
              Delete Folder “{confirmDialog.name}”?
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Deleting this folder will also delete all notes inside it.
              <br />
              Are you sure you want to continue?
            </p>
            <div className="flex justify-center gap-4">
              <button
                onClick={() => setConfirmDialog(null)}
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
