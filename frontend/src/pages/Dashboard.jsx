import React, { useContext, useEffect, useState, createContext } from "react";
import Sidebar from "../components/Dashboard/Sidebar";
import NotesList from "../components/Dashboard/NotesList";
import NoteEditor from "../components/Editor/NoteEditor";
import { AuthContext } from "../context/AuthContext";
import { apiClient } from "../utils/api";

export const SearchContext = createContext();

export default function DashboardPage({ query, setQuery, filterBy, setFilterBy }) {
  const { user } = useContext(AuthContext);
  const [notes, setNotes] = useState([]);
  const [folders, setFolders] = useState([]);
  const [activeFolder, setActiveFolder] = useState("all");
  const [showEditor, setShowEditor] = useState(false);
  const [editingNote, setEditingNote] = useState(null);
  const [sortBy, setSortBy] = useState("latest");
  const [refreshFolders, setRefreshFolders] = useState(false);

  // ✅ Move dialog states
  const [moveDialog, setMoveDialog] = useState(null); // holds note object
  const [targetFolder, setTargetFolder] = useState("");

  // ✅ Fetch folders
  const fetchFolders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get("/api/folders", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setFolders(res.data || []);
      localStorage.setItem("note_folders", JSON.stringify(res.data || []));
    } catch (err) {
      console.error("Failed to fetch folders:", err);
    }
  };

  // ✅ Fetch notes
  const fetchNotes = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await apiClient.get("/api/notes", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setNotes(res.data || []);
    } catch (err) {
      console.error("Failed to fetch notes:", err);
    }
  };

  useEffect(() => {
    if (user) {
      fetchFolders();
      fetchNotes();
    }
  }, [user, refreshFolders]);

  const openEditor = (n = null) => {
    setEditingNote(n);
    setShowEditor(true);
  };

  const closeEditor = () => {
    setEditingNote(null);
    setShowEditor(false);
  };

  const saveNote = async (note) => {
    try {
      const token = localStorage.getItem("token");
      if (note.id) {
        await apiClient.put(`/api/notes/${note.id}`, note, {
          headers: { Authorization: `Bearer ${token}` },
        });
      } else {
        await apiClient.post("/api/notes", note, {
          headers: { Authorization: `Bearer ${token}` },
        });
      }
      await fetchNotes();
      closeEditor();
    } catch (err) {
      console.error("Error saving note:", err);
    }
  };

  const deleteNote = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await apiClient.delete(`/api/notes/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      await fetchNotes();
    } catch (err) {
      console.error("Error deleting note:", err);
    }
  };

  // ✅ Move Note handlers
  const handleMove = (note) => {
    setTargetFolder(note.folderId || "");
    setMoveDialog(note);
  };

  const confirmMove = async () => {
  if (targetFolder === undefined) return alert("Please select a folder");

  try {
    const token = localStorage.getItem("token");

    console.log("🟡 Moving note:", moveDialog.id, "➡ Folder:", targetFolder);

    const res = await apiClient.patch(
      `/api/notes/${moveDialog.id}/move`,
      { folderId: targetFolder || null },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    console.log("✅ Move response:", res.data);

    await fetchNotes(); // Refresh UI
    setMoveDialog(null); // Close dialog
  } catch (err) {
    console.error("❌ Error moving note:", err.response?.data || err.message);
    alert("Move failed — check console for details");
  }
};


  // ✅ Filter + Sort
  const filtered = notes.filter((n) => {
    if (activeFolder === "secret" && !n.secret) return false;
    if (activeFolder !== "all" && activeFolder !== "secret" && n.folderId !== activeFolder)
      return false;
    if (!query) return true;
    const q = query.toLowerCase();
    if (filterBy === "title") return (n.title || "").toLowerCase().includes(q);
    if (filterBy === "description") return (n.content || "").toLowerCase().includes(q);
    return (n.title || "").toLowerCase().includes(q) || (n.content || "").toLowerCase().includes(q);
  });

  filtered.sort((a, b) => {
    const da = new Date(a.updatedAt || a.createdAt || 0);
    const db = new Date(b.updatedAt || b.createdAt || 0);
    return sortBy === "latest" ? db - da : da - db;
  });

  return (
    <SearchContext.Provider
      value={{ query, setQuery, filterBy, setFilterBy, sortBy, setSortBy }}
    >
      <div className="flex flex-1 min-h-screen bg-primary">
        <Sidebar
          folders={folders}
          activeFolder={activeFolder}
          setActiveFolder={setActiveFolder}
          setSortBy={setSortBy}
          sortBy={sortBy}
          refreshFolders={() => setRefreshFolders((prev) => !prev)}
        />

        <main className="flex-1 p-4">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Notes</h1>
            <div className="flex gap-2">
              <button
                onClick={() => openEditor()}
                className="px-3 py-1 bg-secondary text-primary rounded"
              >
                + New Note
              </button>
              <button
                onClick={() => setActiveFolder("all")}
                className="px-3 py-1 border rounded bg-primary text-secondary"
              >
                All
              </button>
            </div>
          </div>

          {/* ✅ Pass move handler */}
          <NotesList notes={filtered} onEdit={openEditor} onDelete={deleteNote} onMove={handleMove} />
        </main>

        {showEditor && (
          <NoteEditor
            note={editingNote}
            onClose={closeEditor}
            onSave={saveNote}
            folders={folders}
          />
        )}

        {/* ✅ Move Note Dialog */}
        {moveDialog && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-xl shadow-lg text-center max-w-sm">
              <h3 className="text-lg font-semibold mb-4">
                Move Note “{moveDialog.title || "Untitled"}”
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                Choose a folder to move this note into:
              </p>
              <select
                className="w-full p-2 border rounded mb-4"
                value={targetFolder}
                onChange={(e) => setTargetFolder(e.target.value)}
              >
                <option value="">All Notes</option>
                {folders.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>

              <div className="flex justify-center gap-4">
                <button
                  onClick={() => setMoveDialog(null)}
                  className="px-4 py-1 border rounded hover:bg-gray-100"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmMove}
                  className="px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Move
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </SearchContext.Provider>
  );
}
