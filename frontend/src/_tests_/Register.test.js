import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Register from "../components/Auth/Register"; // adjust path if needed
import { AuthContext } from "../context/AuthContext";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

describe("Register Component Critical Tests", () => {
  let mockRegister;

  beforeEach(() => {
    mockRegister = jest.fn();
    jest.clearAllMocks();
  });

  const renderComponent = () =>
    render(
      <AuthContext.Provider value={{ register: mockRegister }}>
        <MemoryRouter>
          <Register />
        </MemoryRouter>
      </AuthContext.Provider>
    );

  test("renders register form correctly", () => {
    renderComponent();

    expect(screen.getByPlaceholderText(/full name/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/confirm password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /sign up/i })).toBeInTheDocument();
    expect(screen.getByText(/back to login/i)).toBeInTheDocument();
  });

  test("shows error when passwords do not match", async () => {
    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Hammad" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(
      await screen.findByText(/passwords do not match/i)
    ).toBeInTheDocument();
  });

  test("navigates to home on successful registration", async () => {
    mockRegister.mockResolvedValueOnce({ ok: true });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Hammad" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    await waitFor(() => {
      expect(mockRegister).toHaveBeenCalledWith({
        name: "Hammad",
        email: "test@example.com",
        password: "123456",
      });
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  test("shows error when registration fails", async () => {
    mockRegister.mockResolvedValueOnce({
      ok: false,
      message: "Registration failed",
    });

    renderComponent();

    fireEvent.change(screen.getByPlaceholderText(/full name/i), {
      target: { value: "Hammad" },
    });
    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/^password$/i), {
      target: { value: "123456" },
    });
    fireEvent.change(screen.getByPlaceholderText(/confirm password/i), {
      target: { value: "123456" },
    });

    fireEvent.click(screen.getByRole("button", { name: /sign up/i }));

    expect(await screen.findByText(/registration failed/i)).toBeInTheDocument();
  });
});
