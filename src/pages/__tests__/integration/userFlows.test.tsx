import { renderWithProviders, screen, waitFor } from "../../../test-utils";
import { describe, it, expect, beforeEach, vi, afterEach } from "vitest";
import { cleanup } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "../../../redux/userSlice";
import Login from "../../../pages/Login";
import Home from "../../../pages/Home";
import Transactions from "../../../pages/Transactions";
import History from "../../../pages/History";

// Mock API Service
vi.mock("../../../api/apiService", () => ({
  login: vi.fn(),
  setAuthToken: vi.fn(),
}));

// Mock localStorage
const mockLocalStorage = {
  setItem: vi.fn(),
  getItem: vi.fn(),
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

// Mock React Router for navigation
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe("Integration Tests - User Flows", () => {
  const mockUser = {
    id: "1",
    name: "João Silva",
    balance: 1000.0,
    transactions: [] as Transaction[],
  };

  const createFreshStore = () => {
    return configureStore({
      reducer: {
        user: userSlice,
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    cleanup();
  });

  // Integration Test 1: Login → Home Flow
  it("should complete login flow and display home page with user data", async () => {
    const user = userEvent.setup();
    const { login } = await import("../../../api/apiService");

    // Mock successful login
    vi.mocked(login).mockResolvedValue({
      user: mockUser,
      token: "mock-token-123",
    });

    const store = createFreshStore();

    // Start at login page
    renderWithProviders(<Login />, { store });

    // Verify we're on login page
    expect(
      screen.getByRole("heading", { name: /magnum bank/i })
    ).toBeInTheDocument();

    // Fill out login form using proper selectors
    await user.type(screen.getByLabelText("CPF"), "12345678901");
    await user.type(screen.getByLabelText("Password"), "password123");
    await user.click(screen.getByRole("button", { name: "Login" }));

    // Verify API was called correctly
    expect(login).toHaveBeenCalledWith("12345678901", "password123");

    // Verify localStorage was set
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "user_id",
      mockUser.id
    );
    expect(mockLocalStorage.setItem).toHaveBeenCalledWith(
      "auth_token",
      "mock-token-123"
    );

    // Verify navigation to home
    expect(mockNavigate).toHaveBeenCalledWith("/");

    // Now simulate being on home page with logged in user
    const storeWithUser = configureStore({
      reducer: { user: userSlice },
      preloadedState: { user: mockUser },
    });

    cleanup();
    renderWithProviders(<Home />, { store: storeWithUser });

    // Verify home page displays user data
    expect(screen.getByText("Welcome, João Silva!")).toBeInTheDocument();
    expect(
      screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Transaction" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Transaction History" })
    ).toBeInTheDocument();
  });

  // Integration Test 2: Home → Transactions → Complete Transaction Flow
  it("should complete full transaction creation flow from home to history", async () => {
    const user = userEvent.setup();

    // Start with user logged in on home page
    const storeWithUser = configureStore({
      reducer: { user: userSlice },
      preloadedState: { user: mockUser },
    });

    // Step 1: Home page - navigate to transactions
    renderWithProviders(<Home />, { store: storeWithUser });
    await user.click(screen.getByRole("button", { name: "New Transaction" }));
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");

    // Step 2: Transactions page - create transaction
    cleanup();
    renderWithProviders(<Transactions />, { store: storeWithUser });

    // Fill out transaction form
    await user.type(screen.getByLabelText("Recipient"), "Maria Santos");
    await user.type(screen.getByLabelText("Recipient CPF"), "98765432100");
    await user.type(screen.getByLabelText(/Amount/), "5000"); // R$ 50.00
    await user.type(screen.getByLabelText("PIX Key"), "maria@email.com");

    // Submit transaction
    await user.click(screen.getByRole("button", { name: "Transfer" }));

    // Enter password in modal
    expect(screen.getByText("Enter Password")).toBeInTheDocument();
    const passwordInput = screen.getByDisplayValue("");
    await user.type(passwordInput, "1234");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    // Verify summary modal appears
    await waitFor(() => {
      expect(screen.getByText("Transaction Summary")).toBeInTheDocument();
    });
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();

    // Close summary modal
    await user.click(screen.getByRole("button", { name: "Close" }));

    // Step 3: Verify transaction was added to store
    const finalState = storeWithUser.getState();
    expect(finalState.user.balance).toBe(950.0); // 1000 - 50
    expect(finalState.user.transactions).toHaveLength(1);
    expect(finalState.user.transactions[0].recipientName).toBe("Maria Santos");
    expect(finalState.user.transactions[0].value).toBe(-50.0);

    // Step 4: Navigate to history and verify transaction appears
    cleanup();
    renderWithProviders(<History />, { store: storeWithUser });
    expect(
      screen.getByRole("heading", { name: "Transaction History" })
    ).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();
  });

  // Integration Test 3: Error Recovery Flow
  it("should handle transaction errors and allow user to retry successfully", async () => {
    const user = userEvent.setup();

    const storeWithUser = configureStore({
      reducer: { user: userSlice },
      preloadedState: { user: mockUser },
    });

    renderWithProviders(<Transactions />, { store: storeWithUser });

    // Step 1: Try transaction with insufficient funds
    await user.type(screen.getByLabelText("Recipient"), "Test User");
    await user.type(screen.getByLabelText("Recipient CPF"), "12345678901");
    await user.type(screen.getByLabelText(/Amount/), "150000"); // R$ 1500.00 - more than balance
    await user.type(screen.getByLabelText("PIX Key"), "test@email.com");

    await user.click(screen.getByRole("button", { name: "Transfer" }));

    // Should show insufficient funds error
    expect(screen.getByText("Insufficient funds")).toBeInTheDocument();
    expect(screen.queryByText("Enter Password")).not.toBeInTheDocument();

    // Step 2: Fix amount and try wrong password
    await user.clear(screen.getByLabelText(/Amount/));
    await user.type(screen.getByLabelText(/Amount/), "5000"); // R$ 50.00 - valid amount

    await user.click(screen.getByRole("button", { name: "Transfer" }));

    // Password modal should appear
    expect(screen.getByText("Enter Password")).toBeInTheDocument();

    // Enter wrong password
    const wrongPasswordInput = screen.getByDisplayValue("");
    await user.type(wrongPasswordInput, "wrong");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    // Should show password error
    expect(screen.getByText("Invalid password")).toBeInTheDocument();

    // Step 3: Enter correct password
    const correctPasswordInput = screen.getByDisplayValue("");
    await user.type(correctPasswordInput, "1234");
    await user.click(screen.getByRole("button", { name: "Confirm" }));

    // Should show success summary
    await waitFor(() => {
      expect(screen.getByText("Transaction Summary")).toBeInTheDocument();
    });
    expect(screen.getByText("Test User")).toBeInTheDocument();
    expect(screen.getByText("Transaction successful!")).toBeInTheDocument();

    // Verify transaction was successfully created
    const finalState = storeWithUser.getState();
    expect(finalState.user.balance).toBe(950.0);
    expect(finalState.user.transactions).toHaveLength(1);
    expect(finalState.user.transactions[0].recipientName).toBe("Test User");
  });

  // Integration Test 4: Logout Flow
  it("should handle logout flow from any page", async () => {
    const user = userEvent.setup();

    const storeWithUser = configureStore({
      reducer: { user: userSlice },
      preloadedState: { user: mockUser },
    });

    // Start on home page
    renderWithProviders(<Home />, { store: storeWithUser });

    // Click logout (from Layout component)
    await user.click(screen.getByRole("button", { name: "Logout" }));

    // Verify localStorage was cleared
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user_id");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");

    // Verify Redux state was cleared
    const finalState = storeWithUser.getState();
    expect(finalState.user.id).toBeNull();
    expect(finalState.user.name).toBeNull();
    expect(finalState.user.balance).toBe(0);
    expect(finalState.user.transactions).toEqual([]);

    // If we try to access a protected page now, should redirect to login
    cleanup();
    renderWithProviders(<Home />, { store: storeWithUser });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});
