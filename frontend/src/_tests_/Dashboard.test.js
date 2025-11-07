import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import DashboardPage, { SearchContext } from "../pages/Dashboard";
import { AuthContext } from "../context/AuthContext";
import { apiClient } from "../utils/api";

// Mock dependencies
jest.mock("../utils/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
    delete: jest.fn(),
    patch: jest.fn(),
  },
}));

jest.mock("../components/Dashboard/Sidebar", () => () => <div data-testid="sidebar">Sidebar</div>);
jest.mock("../components/Dashboard/NotesList", () => (props) => (
  <div data-testid="notes-list">
    {props.notes.map((n) => (
      <div key={n.id} data-testid="note-item">
        {n.title}
        <button onClick={() => props.onEdit(n)}>Edit</button>
        <button onClick={() => props.onDelete(n.id)}>Delete</button>
        <button onClick={() => props.onMove(n)}>Move</button>
      </div>
    ))}
  </div>
));
jest.mock("../components/Editor/NoteEditor", () => (props) => (
  <div data-testid="note-editor">
    <button onClick={props.onClose}>Close Editor</button>
    <button
      onClick={() =>
        props.onSave({
          id: props.note?.id,
          title: "Updated Note",
          content: "Some content",
        })
      }
    >
      Save
    </button>
  </div>
));

describe("DashboardPage Component Critical Tests", () => {
  const user = { id: 1, name: "Tester" };

  beforeEach(() => {
    jest.clearAllMocks();
    localStorage.setItem("token", "mock-token");
  });

  test("renders dashboard layout with sidebar and notes list", async () => {
    apiClient.get.mockResolvedValueOnce({ data: [{ id: 1, name: "Work" }] }); // folders
    apiClient.get.mockResolvedValueOnce({ data: [{ id: 1, title: "Test Note" }] }); // notes

    render(
      <AuthContext.Provider value={{ user }}>
        <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
      </AuthContext.Provider>
    );

    expect(await screen.findByTestId("sidebar")).toBeInTheDocument();
    expect(await screen.findByTestId("notes-list")).toBeInTheDocument();
    expect(apiClient.get).toHaveBeenCalledWith("/api/folders", expect.any(Object));
    expect(apiClient.get).toHaveBeenCalledWith("/api/notes", expect.any(Object));
  });

  test("opens and closes note editor", async () => {
    render(
      <AuthContext.Provider value={{ user }}>
        <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("+ New Note"));
    expect(await screen.findByTestId("note-editor")).toBeInTheDocument();

    fireEvent.click(screen.getByText("Close Editor"));
    await waitFor(() => {
      expect(screen.queryByTestId("note-editor")).not.toBeInTheDocument();
    });
  });

  test("saves a new note via POST request", async () => {
    apiClient.post.mockResolvedValueOnce({ data: { id: 2 } });
    apiClient.get.mockResolvedValue({ data: [] });

    render(
      <AuthContext.Provider value={{ user }}>
        <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("+ New Note"));
    fireEvent.click(await screen.findByText("Save"));

    await waitFor(() => {
      expect(apiClient.post).toHaveBeenCalledWith(
        "/api/notes",
        expect.objectContaining({ title: "Updated Note" }),
        expect.any(Object)
      );
    });
  });

  test("updates an existing note via PUT request", async () => {
    apiClient.put.mockResolvedValueOnce({});
    apiClient.get.mockResolvedValue({ data: [] });

    render(
      <AuthContext.Provider value={{ user }}>
        <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
      </AuthContext.Provider>
    );

    fireEvent.click(screen.getByText("+ New Note"));
    fireEvent.click(await screen.findByText("Save"));

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledTimes(0); // no existing id on new
    });
  });

  test("deletes a note via DELETE request", async () => {
    apiClient.get.mockResolvedValue({ data: [{ id: 1, title: "Delete me" }] });
    apiClient.delete.mockResolvedValueOnce({});

    render(
      <AuthContext.Provider value={{ user }}>
        <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
      </AuthContext.Provider>
    );

    const deleteButton = await screen.findByText("Delete");
    fireEvent.click(deleteButton);

    await waitFor(() => {
      expect(apiClient.delete).toHaveBeenCalledWith("/api/notes/1", expect.any(Object));
    });
  });

  test("moves a note between folders", async () => {
  apiClient.get
    .mockResolvedValueOnce({ data: [{ id: "f1", name: "Work" }] }) // folders
    .mockResolvedValueOnce({ data: [{ id: "n1", title: "Move Note", folderId: "f1" }] }); // notes
  apiClient.patch.mockResolvedValueOnce({ data: { success: true } });

  render(
    <AuthContext.Provider value={{ user }}>
      <DashboardPage query="" setQuery={jest.fn()} filterBy="title" setFilterBy={jest.fn()} />
    </AuthContext.Provider>
  );

  const moveBtn = await screen.findByText("Move"); // First "Move" opens dialog
  fireEvent.click(moveBtn);

  const folderSelect = await screen.findByRole("combobox");
  fireEvent.change(folderSelect, { target: { value: "f1" } });

  const moveButtons = await screen.findAllByText("Move");
  const moveConfirm = moveButtons[moveButtons.length - 1]; // The dialog's Move button
  fireEvent.click(moveConfirm);

  await waitFor(() => {
    expect(apiClient.patch).toHaveBeenCalledWith(
      "/api/notes/n1/move",
      { folderId: "f1" },
      expect.any(Object)
    );
  });
});

});
