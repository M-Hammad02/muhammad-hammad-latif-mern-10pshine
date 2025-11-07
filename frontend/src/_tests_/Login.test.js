import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";
import Login from "../components/Auth/Login";

// Mock navigation
const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

// Silence React Router warnings
beforeAll(() => {
  const originalWarn = console.warn;
  console.warn = (...args) => {
    if (typeof args[0] === "string" && args[0].includes("React Router Future Flag Warning")) return;
    originalWarn(...args);
  };
});

// Common mock login function
const mockLogin = jest.fn();

const renderLogin = () =>
  render(
    <AuthContext.Provider value={{ login: mockLogin }}>
      <MemoryRouter>
        <Login />
      </MemoryRouter>
    </AuthContext.Provider>
  );

describe("🔐 Login Component Critical Tests", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // 1. Basic render
  test("renders login form correctly", () => {
    renderLogin();
    expect(screen.getByRole("heading", { name: /login/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/email/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/password/i)).toBeInTheDocument();
  });

   // 2. Invalid email should show validation error
   test("shows validation error for invalid email", async () => {
    renderLogin();

    const emailInput = screen.getByPlaceholderText(/email/i);
    const passwordInput = screen.getByPlaceholderText(/password/i);
    const loginButton = screen.getByRole("button", { name: /^login$/i });

    // Debug: log the form state
    fireEvent.change(emailInput, {
        target: { value: "invalidemail" },
    });
    fireEvent.change(passwordInput, {
        target: { value: "12345" },
    });

    console.log("Email value:", emailInput.value);
    console.log("Password value:", passwordInput.value);

    fireEvent.click(loginButton);

    // Debug: see what's actually on the screen
    await waitFor(() => {
        screen.debug(); // This will show the current DOM
    });

    // Check if any error messages appear at all
    const errorMessages = screen.queryAllByText(/error/i);
    console.log("Error messages found:", errorMessages);
    });

  // 3. Navigates to home on successful login
  test("navigates to home on successful login", async () => {
    mockLogin.mockResolvedValue({ ok: true });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "test@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "12345" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith("test@example.com", "12345");
      expect(mockNavigate).toHaveBeenCalledWith("/");
    });
  });

  // 4. Invalid credentials should show proper error
  test("shows error when credentials are invalid", async () => {
    mockLogin.mockResolvedValue({ ok: false, message: "Invalid email or password" });
    renderLogin();

    fireEvent.change(screen.getByPlaceholderText(/email/i), {
      target: { value: "wrong@example.com" },
    });
    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { value: "wrongpass" },
    });

    fireEvent.click(screen.getByRole("button", { name: /^login$/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid email or password/i)).toBeInTheDocument();
    });
  });
});
