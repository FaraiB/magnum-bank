import { renderWithProviders, screen } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "../../redux/userSlice";

// Mock useNavigate
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

// Mock localStorage
const mockLocalStorage = {
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

describe("Home Component", () => {
  // Complete mock user data matching your UserState interface
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "PIX",
      date: "2024-01-15T10:30:00.000Z",
      value: -100.0,
      balanceAfter: 1400.75,
      recipientName: "Maria Santos",
      recipientCpf: "98765432100",
      pixKey: "maria@email.com",
    },
    {
      id: "2",
      type: "TED",
      date: "2024-01-14T14:20:00.000Z",
      value: -250.5,
      balanceAfter: 1500.75,
      recipientName: "José Silva",
      recipientCpf: "11122233344",
      bank: "001",
      branch: "1234",
      account: "567890",
    },
    {
      id: "3",
      type: "PIX",
      date: "2024-01-13T09:15:00.000Z",
      value: -75.25,
      balanceAfter: 1751.25,
      recipientName: "Ana Costa",
      recipientCpf: "55566677788",
      pixKey: "+5511999887766",
    },
  ];

  const mockUser = {
    id: "1",
    name: "João Silva",
    balance: 1400.75,
    transactions: mockTransactions,
  };

  // Helper to create store with specific user state
  const createStoreWithUserState = (userState: any) => {
    const store = configureStore({
      reducer: {
        user: userSlice,
      },
    });

    // If we have user data, dispatch it to the store
    if (userState) {
      store.dispatch({ type: "user/setUser", payload: userState });
    }

    return store;
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render home page with user data and latest transactions", () => {
    const store = createStoreWithUserState(mockUser);
    renderWithProviders(<Home />, { store });

    // Check layout navigation elements (now in Layout component)
    expect(screen.getByText("Magnum Bank")).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /home/i })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: /transactions/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: /history/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /logout/i })).toBeInTheDocument();

    // Check user welcome message
    expect(screen.getByText(`Welcome, ${mockUser.name}`)).toBeInTheDocument();

    // Check balance display
    expect(
      screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
    ).toBeInTheDocument();

    // Check action buttons (still in Home component)
    expect(
      screen.getByRole("button", { name: /new transaction/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /transaction history/i })
    ).toBeInTheDocument();
  });

  it("should handle navigation and logout actions correctly", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(mockUser);
    renderWithProviders(<Home />, { store });

    // Test navigation to transactions (from Home action button)
    await user.click(screen.getByRole("button", { name: /new transaction/i }));
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");

    // Test navigation to history (from Home action button)
    await user.click(
      screen.getByRole("button", { name: /transaction history/i })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/history");

    // Test logout functionality (from Layout component)
    await user.click(screen.getByRole("button", { name: /logout/i }));

    // Check localStorage was cleared
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user_id");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");

    // Check Redux state was cleared (user should be cleared from store)
    const state = store.getState();
    expect(state.user.id).toBeNull();
    expect(state.user.name).toBeNull();
    expect(state.user.balance).toBe(0);
    expect(state.user.transactions).toEqual([]);
  });

  it("should redirect to login when user is not authenticated", () => {
    // Test with completely null user
    const store = createStoreWithUserState(null);
    renderWithProviders(<Home />, { store });
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    // Clear mocks for next test
    vi.clearAllMocks();

    // Test with user object but null id (partially logged out state)
    const partialUser = {
      id: null,
      name: null,
      balance: 0,
      transactions: [],
    };
    const storePartial = createStoreWithUserState(partialUser);
    renderWithProviders(<Home />, { store: storePartial });
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });

  it("should handle user with no transactions", () => {
    const userWithNoTransactions = {
      ...mockUser,
      transactions: [],
    };
    const store = createStoreWithUserState(userWithNoTransactions);
    renderWithProviders(<Home />, { store });

    // Should still render main elements
    expect(screen.getByText(`Welcome, ${mockUser.name}`)).toBeInTheDocument();
    expect(
      screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
    ).toBeInTheDocument();

    // Should not crash when trying to display latest transactions
    expect(
      screen.getByRole("button", { name: /new transaction/i })
    ).toBeInTheDocument();
  });
});
