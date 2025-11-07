import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import NoteEditor from "../components/Editor/NoteEditor"; // adjust path if needed

// Mock ReactQuill (since it uses a browser API not available in Jest)
jest.mock("react-quill", () => (props) => (
  <textarea
    data-testid="react-quill"
    value={props.value}
    onChange={(e) => props.onChange(e.target.value)}
    placeholder={props.placeholder}
  />
));

describe("NoteEditor Component Critical Tests", () => {
  const mockOnClose = jest.fn();
  const mockOnSave = jest.fn();
  const folders = [
    { id: "1", name: "Work" },
    { id: "2", name: "Personal" },
  ];

  const baseNote = {
    id: "123",
    title: "Existing Note",
    content: "<p>Old content</p>",
    secret: false,
    folderId: "2",
    createdAt: "2025-11-05T10:00:00Z",
    attachments: [],
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("renders correctly in 'New Note' mode", () => {
    render(<NoteEditor onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);
    expect(screen.getByText("New Note")).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/title/i)).toBeInTheDocument();
    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("renders correctly in 'Edit Note' mode", () => {
    render(<NoteEditor note={baseNote} onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);
    expect(screen.getByText("Edit Note")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Existing Note")).toBeInTheDocument();
  });

  test("updates title input", () => {
    render(<NoteEditor note={baseNote} onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);

    const titleInput = screen.getByPlaceholderText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Title" } });
    expect(titleInput.value).toBe("Updated Title");
  });

  test("changes folder selection", () => {
    render(<NoteEditor onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);

    const select = screen.getByRole("combobox");
    fireEvent.change(select, { target: { value: "2" } });
    expect(select.value).toBe("2");
  });

  test("calls onSave with correct payload", async () => {
    render(<NoteEditor note={baseNote} onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);

    const titleInput = screen.getByPlaceholderText(/title/i);
    fireEvent.change(titleInput, { target: { value: "Updated Note" } });

    fireEvent.click(screen.getByText("Save"));

    await waitFor(() => {
      expect(mockOnSave).toHaveBeenCalledTimes(1);
      const payload = mockOnSave.mock.calls[0][0];
      expect(payload.title).toBe("Updated Note");
      expect(payload.id).toBe("123");
      expect(payload.folderId).toBe("2");
      expect(payload.content).toBe("<p>Old content</p>");
      expect(payload).toHaveProperty("updatedAt");
    });
  });

  test("calls onClose when Cancel is clicked", () => {
    render(<NoteEditor onClose={mockOnClose} onSave={mockOnSave} folders={folders} />);
    fireEvent.click(screen.getByText("Cancel"));
    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });
});
