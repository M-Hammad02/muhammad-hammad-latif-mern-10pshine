import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Profile from "../components/Profile/Profile";
import { AuthContext } from "../context/AuthContext";
import { apiClient } from "../utils/api";

// Mock URL.createObjectURL
global.URL.createObjectURL = jest.fn(() => "mock-preview-url");

jest.mock("../utils/api", () => ({
  apiClient: {
    get: jest.fn(),
    post: jest.fn(),
    put: jest.fn(),
  },
}));

const mockUser = {
  name: "Hammad",
  email: "hammad@example.com",
  avatar: "/uploads/avatar.jpg",
  bio: "Developer",
};

const mockUpdateProfile = jest.fn();

const renderProfile = () =>
  render(
    <AuthContext.Provider
      value={{
        user: mockUser,
        token: "mock-token",
        updateProfile: mockUpdateProfile,
      }}
    >
      <Profile />
    </AuthContext.Provider>
  );

describe("Profile Component Critical Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // Reset the mock implementation before each test
    global.URL.createObjectURL.mockClear();
  });

  test("renders profile info correctly", async () => {
    apiClient.get.mockResolvedValueOnce({ data: mockUser });
    renderProfile();
    expect(await screen.findByDisplayValue("Hammad")).toBeInTheDocument();
    expect(screen.getByDisplayValue("hammad@example.com")).toBeInTheDocument();
  });

  test("updates profile when Save button clicked", async () => {
    apiClient.put.mockResolvedValueOnce({ data: { user: mockUser } });
    renderProfile();

    const nameInput = screen.getByDisplayValue("Hammad");
    fireEvent.change(nameInput, { target: { value: "Hammad Latif" } });

    const saveBtn = screen.getByText(/save profile/i);
    fireEvent.click(saveBtn);

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/users/me",
        expect.objectContaining({ name: "Hammad Latif" }),
        expect.any(Object)
      );
    });
    expect(mockUpdateProfile).toHaveBeenCalled();
  });

  test("shows validation if password fields are empty", async () => {
    renderProfile();
    const changeBtns = screen.getAllByText(/change/i);
    const changeBtn = changeBtns.find((btn) => btn.tagName === "BUTTON");
    fireEvent.click(changeBtn);
    expect(await screen.findByText("Fill both fields")).toBeInTheDocument();
  });

  test("calls API on password change with valid input", async () => {
    apiClient.put.mockResolvedValueOnce({});
    renderProfile();

    fireEvent.change(screen.getByPlaceholderText(/current password/i), {
      target: { value: "oldpass" },
    });
    fireEvent.change(screen.getByPlaceholderText(/new password/i), {
      target: { value: "newpass" },
    });

    const changeBtns = screen.getAllByText(/change/i);
    const changeBtn = changeBtns.find((btn) => btn.tagName === "BUTTON");
    fireEvent.click(changeBtn);

    await waitFor(() => {
      expect(apiClient.put).toHaveBeenCalledWith(
        "/api/users/change-password",
        { currentPassword: "oldpass", newPassword: "newpass" },
        expect.any(Object)
      );
    });
    expect(await screen.findByText("Password changed successfully!")).toBeInTheDocument();
  });

  test("handles avatar upload correctly", async () => {
    renderProfile();
    const file = new File(["avatar"], "avatar.png", { type: "image/png" });

    // Find the file input
    const fileInput = document.querySelector('input[type="file"]');
    expect(fileInput).toBeInTheDocument();

    fireEvent.change(fileInput, { target: { files: [file] } });

    await waitFor(() => {
      // Verify createObjectURL was called with the file
      expect(global.URL.createObjectURL).toHaveBeenCalledWith(file);
      expect(fileInput.files[0].name).toBe("avatar.png");
    });
  });
});