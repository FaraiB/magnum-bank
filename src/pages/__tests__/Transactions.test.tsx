import { renderWithProviders, screen, waitFor } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Transactions from "../Transactions";
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

describe("Transactions Component", () => {
  const createStoreWithUserState = (
    balance: number,
    transactions: Transaction[] = []
  ) => {
    return configureStore({
      reducer: {
        user: userSlice,
      },
      preloadedState: {
        user: {
          id: "1",
          name: "João Silva",
          balance,
          transactions,
        },
      },
    });
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render transaction page with form, balance, and navigation", () => {
    const store = createStoreWithUserState(1500.75);
    renderWithProviders(<Transactions />, { store });

    // Check page navigation
    expect(
      screen.getByRole("heading", { name: t("transactions.newTransaction") })
    ).toBeInTheDocument();

    // Check balance display
    expect(screen.getByText("R$ 1500.75")).toBeInTheDocument();

    // Check form fields are present
    expect(
      screen.getByLabelText(t("transactions.recipient"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("transactions.recipientCPF"))
    ).toBeInTheDocument();
    expect(
      screen.getByLabelText(/transactions\.amount \(R\$\)/i)
    ).toBeInTheDocument();
    expect(screen.getByLabelText(t("transactions.type"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("transactions.date"))).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: t("transactions.transfer") })
    ).toBeInTheDocument();

    // Check default transaction type is PIX
    expect(screen.getByDisplayValue(t("transactions.pix"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("transactions.pixKey"))).toBeInTheDocument();

    // Check modals are not visible initially
    expect(
      screen.queryByText(t("modals.password.title"))
    ).not.toBeInTheDocument();
    expect(
      screen.queryByText(t("modals.summary.title"))
    ).not.toBeInTheDocument();
  });

  it("should complete full PIX transaction workflow successfully", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(1000.0);
    renderWithProviders(<Transactions />, { store });

    // Fill out the PIX transaction form
    await user.type(
      screen.getByLabelText(t("transactions.recipient")),
      "Maria Santos"
    );
    await user.type(
      screen.getByLabelText(t("transactions.recipientCPF")),
      "98765432100"
    );
    await user.type(screen.getByLabelText(/amount \(r\$\)/i), "10050"); // R$ 100.50
    await user.type(
      screen.getByLabelText(t("transactions.pixKey")),
      "maria@email.com"
    );

    // Submit the form
    await user.click(
      screen.getByRole("button", { name: t("transactions.transfer") })
    );

    // Password modal should appear
    expect(screen.getByText(t("modals.password.title"))).toBeInTheDocument();

    // Enter correct password
    const passwordInput = screen.getByDisplayValue("");
    await user.type(passwordInput, "1234");
    await user.click(
      screen.getByRole("button", { name: t("modals.password.confirm") })
    );

    // Summary modal should appear
    await waitFor(() => {
      expect(screen.getByText(t("modals.summary.title"))).toBeInTheDocument();
    });

    // Verify summary modal content
    expect(screen.getByText(t("modals.summary.title"))).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.50")).toBeInTheDocument();
    const summarySection = screen
      .getByText(t("modals.summary.title"))
      .closest(".modal");
    expect(summarySection).toHaveTextContent("PIX");

    // Check Redux state was updated
    const state = store.getState();
    expect(state.user.balance).toBe(899.5);
    expect(state.user.transactions).toHaveLength(1);
    expect(state.user.transactions[0].recipientName).toBe("Maria Santos");
    expect(state.user.transactions[0].value).toBe(-100.5);
    expect(state.user.transactions[0].type).toBe("PIX");

    // Close summary modal
    await user.click(
      screen.getByRole("button", { name: t("modals.summary.close") })
    );
    expect(
      screen.queryByText(t("modals.summary.title"))
    ).not.toBeInTheDocument();
  });

  it("should handle insufficient funds and invalid password correctly", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(50.0); // Low balance
    renderWithProviders(<Transactions />, { store });

    // Test insufficient funds
    await user.type(
      screen.getByLabelText(t("transactions.recipient")),
      "Test User"
    );
    await user.type(
      screen.getByLabelText(t("transactions.recipientCPF")),
      "12345678901"
    );
    await user.type(screen.getByLabelText(/amount/i), "10000");
    await user.type(
      screen.getByLabelText(t("transactions.pixKey")),
      "test@email.com"
    );

    await user.click(
      screen.getByRole("button", { name: t("transactions.transfer") })
    );

    // Should show insufficient funds error
    expect(
      screen.getByText(t("transactions.validation.insufficientFunds"))
    ).toBeInTheDocument();
    expect(
      screen.queryByText(t("modals.password.title"))
    ).not.toBeInTheDocument();

    // Clear form and test valid amount with wrong password
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "2000"); // R$ 20.00

    await user.click(
      screen.getByRole("button", { name: t("transactions.transfer") })
    );

    // Password modal should appear
    expect(screen.getByText(t("modals.password.title"))).toBeInTheDocument();

    // Enter wrong password
    const passwordInputWrong = screen.getByDisplayValue("");
    await user.type(passwordInputWrong, "wrong");
    await user.click(
      screen.getByRole("button", { name: t("modals.password.confirm") })
    );

    // Should show password error and stay on password modal
    expect(screen.getByText(t("modals.password.error"))).toBeInTheDocument();
    expect(screen.getByText(t("modals.password.title"))).toBeInTheDocument();

    // Cancel the modal
    await user.click(
      screen.getByRole("button", { name: t("modals.password.cancel") })
    );
    expect(
      screen.queryByText(t("modals.password.title"))
    ).not.toBeInTheDocument();

    // Verify no transaction was created
    const state = store.getState();
    expect(state.user.balance).toBe(50.0); // Unchanged
    expect(state.user.transactions).toHaveLength(0);
  });

  it("should show correct fields when switching between PIX and TED", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(1000.0);
    renderWithProviders(<Transactions />, { store });

    // Initially PIX should be selected with PIX key field
    expect(screen.getByDisplayValue(t("transactions.pix"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("transactions.pixKey"))).toBeInTheDocument();
    expect(
      screen.queryByLabelText(t("transactions.bank"))
    ).not.toBeInTheDocument();

    // Switch to TED
    await user.selectOptions(
      screen.getByLabelText(t("transactions.type")),
      "TED"
    );

    // Should show TED fields and hide PIX key
    expect(screen.getByLabelText(t("transactions.bank"))).toBeInTheDocument();
    expect(screen.getByLabelText(t("transactions.branch"))).toBeInTheDocument();
    expect(
      screen.getByLabelText(t("transactions.account"))
    ).toBeInTheDocument();
    expect(
      screen.queryByLabelText(t("transactions.pixKey"))
    ).not.toBeInTheDocument();
  });
});
