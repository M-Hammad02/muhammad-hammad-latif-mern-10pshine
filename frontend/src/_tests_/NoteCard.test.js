import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import NoteCard from "../components/Dashboard/NoteCard"; // adjust path if needed
import { snip } from "../utils/helpers";

// Mock the snip function to simplify output
jest.mock("../utils/helpers", () => ({
  snip: jest.fn((content) => content.slice(0, 20)),
}));

describe("NoteCard Component Critical Tests", () => {
  const mockNote = {
    id: "1",
    title: "Test Note",
    content: "<p>This is a long content that should be snipped</p>",
    createdAt: new Date().toISOString(),
    secret: false,
  };

  const mockOnEdit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnMove = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  const renderNoteCard = () =>
    render(
      <NoteCard
        note={mockNote}
        onEdit={mockOnEdit}
        onDelete={mockOnDelete}
        onMove={mockOnMove}
      />
    );

  test("renders note details correctly", () => {
    renderNoteCard();

    expect(screen.getByText("Test Note")).toBeInTheDocument();
    expect(snip).toHaveBeenCalledWith(mockNote.content);
    expect(screen.getByText("Edit")).toBeInTheDocument();
    expect(screen.getByText("Move")).toBeInTheDocument();
    expect(screen.getByText("Delete")).toBeInTheDocument();
  });

  test("calls onEdit when Edit button is clicked", () => {
    renderNoteCard();

    fireEvent.click(screen.getByText("Edit"));
    expect(mockOnEdit).toHaveBeenCalledTimes(1);
    expect(mockOnEdit).toHaveBeenCalledWith(mockNote);
  });

  test("calls onMove when Move button is clicked", () => {
    renderNoteCard();

    fireEvent.click(screen.getByText("Move"));
    expect(mockOnMove).toHaveBeenCalledTimes(1);
    expect(mockOnMove).toHaveBeenCalledWith(mockNote);
  });

  test("opens confirmation dialog when Delete is clicked", () => {
    renderNoteCard();

    fireEvent.click(screen.getByText("Delete"));
    expect(
      screen.getByText(/delete note “test note”\?/i)
    ).toBeInTheDocument();
    expect(
      screen.getByText(/are you sure you want to delete/i)
    ).toBeInTheDocument();
  });

  test("calls onDelete only after confirming deletion", () => {
   renderNoteCard();

   // open dialog
   fireEvent.click(screen.getByText("Delete"));

   // confirm delete (pick the second Delete button)
   const deleteButtons = screen.getAllByRole("button", { name: "Delete" });
   fireEvent.click(deleteButtons[deleteButtons.length - 1]);

   expect(mockOnDelete).toHaveBeenCalledTimes(1);
   expect(mockOnDelete).toHaveBeenCalledWith("1");
 });


  test("cancels deletion when Cancel is clicked", () => {
    renderNoteCard();

    // open dialog
    fireEvent.click(screen.getByText("Delete"));
    // cancel it
    fireEvent.click(screen.getByRole("button", { name: "Cancel" }));

    expect(mockOnDelete).not.toHaveBeenCalled();
    expect(screen.queryByText(/delete note/i)).not.toBeInTheDocument;
  });
});
