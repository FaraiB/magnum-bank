import { renderWithProviders, screen } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Home from "../Home";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../../redux/userSlice";

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock localStorage
const mockLocalStorage = {
  removeItem: vi.fn(),
};
Object.defineProperty(window, "localStorage", { value: mockLocalStorage });

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

describe("Home Component", () => {
  // Mock user data
  const mockUser = {
    id: "1",
    name: "João Silva",
    cpf: "12345678901",
    balance: 1500.75,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Home Component", () => {
    it("should render home page with user data", () => {
      const store = createStoreWithUserState(mockUser);
      renderWithProviders(<Home />, { store });

      // Check main elements are present
      expect(screen.getByText("Magnum Bank")).toBeInTheDocument();
      expect(screen.getByText(`Welcome, ${mockUser.name}`)).toBeInTheDocument();
      expect(screen.getByText("Current Balance")).toBeInTheDocument();
      expect(
        screen.getByText(`R$ ${mockUser.balance.toFixed(2)}`)
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /logout/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /new transaction/i })
      ).toBeInTheDocument();
      expect(
        screen.getByRole("button", { name: /transaction history/i })
      ).toBeInTheDocument();
    });

    it("redirects to login when user is not logged in", () => {
      // Create store without user data (uses initial state)
      const store = createStoreWithUserState(null);
      renderWithProviders(<Home />, { store });

      // Should navigate to login
      expect(mockNavigate).toHaveBeenCalledWith("/login");
    });
  });

  describe("User Interactions", () => {
    it("should handle logout correctly", async () => {
      const user = userEvent.setup();
      const store = createStoreWithUserState(mockUser);
      renderWithProviders(<Home />, { store });

      // Click logout button
      await user.click(screen.getByRole("button", { name: /logout/i }));

      // Check that localStorage was cleared
      expect(mockLocalStorage.removeItem).toHaveBeenCalledWith("user_id");
    });

    it("navigate to transactions page", async () => {
      const user = userEvent.setup();
      const store = createStoreWithUserState(mockUser);
      renderWithProviders(<Home />, { store });

      // Click New Transaction button
      await user.click(
        screen.getByRole("button", { name: /new transaction/i })
      );

      // Check navigation was called
      expect(mockNavigate).toHaveBeenCalledWith("/transactions");
    });

    it("navigate to history page", async () => {
      const user = userEvent.setup();
      const store = createStoreWithUserState(mockUser);
      renderWithProviders(<Home />, { store });

      // Click Transaction History button
      await user.click(
        screen.getByRole("button", { name: /transaction history/i })
      );

      // Check navigation was called
      expect(mockNavigate).toHaveBeenCalledWith("/history");
    });
  });
});
