import { renderWithProviders, screen } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "../../redux/userSlice";
import { t } from "i18next";

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

  const createStoreWithUserState = (userState: any) => {
    const store = configureStore({
      reducer: {
        user: userSlice,
      },
    });

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
    expect(
      screen.getByRole("img", { name: /magnum bank/i })
    ).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "nav.home" })).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "nav.transactions" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("link", { name: "nav.history" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "nav.logout" })
    ).toBeInTheDocument();

    expect(
      screen.getByText(t("home.welcome", { name: mockUser.name }))
    ).toBeInTheDocument();

    expect(
      screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
    ).toBeInTheDocument();

    // Check action buttons (still in Home component)
    expect(
      screen.getByRole("button", { name: "home.newTransaction" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "home.transactionHistory" })
    ).toBeInTheDocument();
  });

  it("should handle navigation and logout actions correctly", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(mockUser);
    renderWithProviders(<Home />, { store });

    await user.click(
      screen.getByRole("button", { name: "home.newTransaction" })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/transactions");

    await user.click(
      screen.getByRole("button", { name: "home.transactionHistory" })
    );
    expect(mockNavigate).toHaveBeenCalledWith("/history");

    await user.click(screen.getByRole("button", { name: "nav.logout" }));

    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user_id");
    expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("auth_token");

    const state = store.getState();
    expect(state.user.id).toBeNull();
    expect(state.user.name).toBeNull();
    expect(state.user.balance).toBe(0);
    expect(state.user.transactions).toEqual([]);
  });

  it("should redirect to login when user is not authenticated", () => {
    const store = createStoreWithUserState(null);
    renderWithProviders(<Home />, { store });
    expect(mockNavigate).toHaveBeenCalledWith("/login");

    vi.clearAllMocks();

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

    expect(
      screen.getByText(t("home.welcome", { name: mockUser.name }))
    ).toBeInTheDocument();
    expect(
      screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", { name: "home.newTransaction" })
    ).toBeInTheDocument();
  });
});
