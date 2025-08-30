import { renderWithProviders, screen } from "../../test-utils";
import History from "../History";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "../../redux/userSlice";

// Mock the navigate function to prevent navigation errors
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Helper to create a store with transactions for testing
const createStoreWithTransactions = (transactions: any[]) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: {
        id: "1",
        name: "Test User",
        balance: 1000,
        transactions,
      },
    },
  });
};

describe("History Component", () => {
  it("should render transaction history with data", () => {
    const mockTransactions = [
      {
        id: "1",
        type: "PIX/TED",
        date: new Date().toISOString(),
        value: 50,
      },
      {
        id: "2",
        type: "PIX/TED",
        date: new Date().toISOString(),
        value: -25,
      },
    ];
    const store = createStoreWithTransactions(mockTransactions);

    renderWithProviders(<History />, { store });

    // Assert that the transactions are displayed in the table
    expect(screen.getByText("Transaction History")).toBeInTheDocument();
    expect(screen.getAllByRole("row").length).toBe(3); // Table has 2 rows + 1 header row
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();
    expect(screen.getByText("R$ -25.00")).toBeInTheDocument();
  });

  it("should render a message when no transactions are found", () => {
    const mockTransactions: Transaction[] = [];
    const store = createStoreWithTransactions(mockTransactions);

    renderWithProviders(<History />, { store });

    expect(screen.getByText("No transactions found.")).toBeInTheDocument();
  });

  it("should filter transactions by type", async () => {
    const user = userEvent.setup();
    const mockTransactions = [
      {
        id: "1",
        type: "PIX",
        date: new Date().toISOString(),
        value: 50,
      },
      {
        id: "2",
        type: "TED",
        date: new Date().toISOString(),
        value: -25,
      },
    ];
    const store = createStoreWithTransactions(mockTransactions);

    renderWithProviders(<History />, { store });

    // Initially, both transactions should be visible
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();
    expect(screen.getByText("R$ -25.00")).toBeInTheDocument();

    // Select 'PIX' from the dropdown
    await user.selectOptions(screen.getByLabelText(/Filter by Type:/i), "PIX");

    // Only the PIX transaction should be visible
    expect(screen.getByText("R$ 50.00")).toBeInTheDocument();
    expect(screen.queryByText("R$ -25.00")).not.toBeInTheDocument();
  });
});
