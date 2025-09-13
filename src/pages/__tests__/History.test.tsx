import { renderWithProviders, screen } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import History from "../History";
import { configureStore } from "@reduxjs/toolkit";
import userSlice, { type Transaction } from "../../redux/userSlice";
import { t } from "i18next";

// Mock React Router
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    Link: ({ children, to, ...props }: any) => (
      <a href={to} {...props}>
        {children}
      </a>
    ),
  };
});

describe("History Component", () => {
  // Complete mock transaction data matching your Transaction interface
  const mockTransactions: Transaction[] = [
    {
      id: "1",
      type: "PIX",
      date: "2024-01-15T10:30:00.000Z",
      value: -100.0,
      balanceAfter: 1400.0,
      recipientName: "Maria Santos",
      recipientCpf: "98765432100",
      pixKey: "maria@email.com",
    },
    {
      id: "2",
      type: "TED",
      date: "2024-01-14T14:20:00.000Z",
      value: -250.5,
      balanceAfter: 1500.0,
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
      balanceAfter: 1575.25,
      recipientName: "Ana Costa",
      recipientCpf: "55566677788",
      pixKey: "+5511999887766",
    },
  ];

  // Helper to create store with transactions
  const createStoreWithTransactions = (transactions: Transaction[]) => {
    return configureStore({
      reducer: {
        user: userSlice,
      },
      preloadedState: {
        user: {
          id: "1",
          name: "João Silva",
          balance: 1400.0,
          transactions,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render transaction history page with filters and transaction list", () => {
    const store = createStoreWithTransactions(mockTransactions);
    renderWithProviders(<History />, { store });

    // Check page title
    expect(screen.getByText(t("history.title"))).toBeInTheDocument();

    // Check filter controls are present
    expect(screen.getByLabelText(t("history.type"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("history.start"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("history.end"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("history.min"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("history.max"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("history.sortBy"))).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("history.reset") })
    ).toBeInTheDocument();

    // Check period filter buttons
    expect(
      screen.getByRole("button", { name: t("history.last7") })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("history.last30") })
    ).toBeInTheDocument();

    // Check transactions are displayed (should show all 3)
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("José Silva")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.00")).toBeInTheDocument();
    expect(screen.getByText("R$ 250.50")).toBeInTheDocument();
    expect(screen.getByText("R$ 75.25")).toBeInTheDocument();
  });

  it("should filter transactions by type and reset filters correctly", async () => {
    const user = userEvent.setup();
    const store = createStoreWithTransactions(mockTransactions);
    renderWithProviders(<History />, { store });

    // Initially, all transactions should be visible
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("José Silva")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();

    // Filter by PIX type
    await user.selectOptions(screen.getByLabelText(t("history.type")), "PIX");

    // Only PIX transactions should be visible (Maria Santos and Ana Costa)
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
    expect(screen.queryByText("José Silva")).not.toBeInTheDocument();

    // Filter by TED type
    await user.selectOptions(screen.getByLabelText(t("history.type")), "TED");

    // Only TED transaction should be visible (José Silva)
    expect(screen.getByText("José Silva")).toBeInTheDocument();
    expect(screen.queryByText("Maria Santos")).not.toBeInTheDocument();
    expect(screen.queryByText("Ana Costa")).not.toBeInTheDocument();

    // Reset filters
    await user.click(screen.getByRole("button", { name: t("history.reset") }));

    // All transactions should be visible again
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("José Silva")).toBeInTheDocument();
    expect(screen.getByText("Ana Costa")).toBeInTheDocument();
  });

  it("should handle empty transaction list", () => {
    const emptyStore = createStoreWithTransactions([]);
    renderWithProviders(<History />, { store: emptyStore });

    expect(screen.getByText(t("history.title"))).toBeInTheDocument();
    expect(screen.getByText(t("history.noTransactions"))).toBeInTheDocument();

    // Should still show filter controls
    expect(screen.getByLabelText(t("history.type"))).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("history.reset") })
    ).toBeInTheDocument();
  });

  it("should handle period filter functionality", async () => {
    const user = userEvent.setup();
    const store = createStoreWithTransactions(mockTransactions);
    renderWithProviders(<History />, { store });

    // Test period filter button
    await user.click(screen.getByRole("button", { name: t("history.last7") }));

    // The date inputs should have values after clicking period filter
    const startDateInput = screen.getByLabelText(
      t("history.start")
    ) as HTMLInputElement;
    const endDateInput = screen.getByLabelText(
      t("history.end")
    ) as HTMLInputElement;
    expect(startDateInput.value).not.toBe("");
    expect(endDateInput.value).not.toBe("");

    // Should still show transactions
    expect(screen.getByText(t("history.title"))).toBeInTheDocument();
  });

  it("should handle sort order changes", async () => {
    const user = userEvent.setup();
    const store = createStoreWithTransactions(mockTransactions);
    renderWithProviders(<History />, { store });

    // Default should be "Newest First"
    expect(screen.getByDisplayValue(t("history.newest"))).toBeInTheDocument();

    // Change to oldest first
    await user.selectOptions(screen.getByLabelText(t("history.sortBy")), "asc");

    // Should update to "Oldest First"
    expect(screen.getByDisplayValue(t("history.oldest"))).toBeInTheDocument();

    // Transactions should still be displayed
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
  });
});
