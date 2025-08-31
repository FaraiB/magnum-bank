import { renderWithProviders, screen, waitFor } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Transactions from "../Transactions";
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
      screen.getByRole("heading", { name: /new transaction/i })
    ).toBeInTheDocument();

    // Check balance display
    expect(screen.getByText("R$ 1500.75")).toBeInTheDocument();

    // Check form fields are present
    expect(screen.getByLabelText(/recipient name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/recipient cpf\/cnpj/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/amount \(r\$\)/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/transaction type/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/date/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /transfer/i })
    ).toBeInTheDocument();

    // Check default transaction type is PIX
    expect(screen.getByDisplayValue("PIX")).toBeInTheDocument();
    expect(screen.getByLabelText(/pix key/i)).toBeInTheDocument();

    // Check modals are not visible initially
    expect(
      screen.queryByText(/enter transaction password/i)
    ).not.toBeInTheDocument();
    expect(screen.queryByText(/transaction summary/i)).not.toBeInTheDocument();
  });

  it("should complete full PIX transaction workflow successfully", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(1000.0);
    renderWithProviders(<Transactions />, { store });

    // Fill out the PIX transaction form
    await user.type(screen.getByLabelText(/recipient name/i), "Maria Santos");
    await user.type(
      screen.getByLabelText(/recipient cpf\/cnpj/i),
      "98765432100"
    );
    await user.type(screen.getByLabelText(/amount \(r\$\)/i), "10050"); // R$ 100.50
    await user.type(screen.getByLabelText(/pix key/i), "maria@email.com");

    // Submit the form
    await user.click(screen.getByRole("button", { name: /transfer/i }));

    // Password modal should appear
    expect(screen.getByText(/enter transaction password/i)).toBeInTheDocument();

    // Enter correct password
    const passwordInput = screen.getByDisplayValue("");
    await user.type(passwordInput, "1234");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // Summary modal should appear
    await waitFor(() => {
      expect(screen.getByText(/transaction summary/i)).toBeInTheDocument();
    });

    // Verify summary modal content
    expect(screen.getByText("Transaction successful!")).toBeInTheDocument();
    expect(screen.getByText("Maria Santos")).toBeInTheDocument();
    expect(screen.getByText("R$ 100.50")).toBeInTheDocument();
    const summarySection = screen
      .getByText("Transaction Summary")
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
    await user.click(screen.getByRole("button", { name: /close/i }));
    expect(screen.queryByText(/transaction summary/i)).not.toBeInTheDocument();
  });

  it("should handle insufficient funds and invalid password correctly", async () => {
    const user = userEvent.setup();
    const store = createStoreWithUserState(50.0); // Low balance
    renderWithProviders(<Transactions />, { store });

    // Test insufficient funds
    await user.type(screen.getByLabelText(/recipient name/i), "Test User");
    await user.type(screen.getByLabelText(/recipient cpf/i), "12345678901");
    await user.type(screen.getByLabelText(/amount/i), "10000");
    await user.type(screen.getByLabelText(/pix key/i), "test@email.com");

    await user.click(screen.getByRole("button", { name: /transfer/i }));

    // Should show insufficient funds error
    expect(screen.getByText(/insufficient funds/i)).toBeInTheDocument();
    expect(
      screen.queryByText(/enter transaction password/i)
    ).not.toBeInTheDocument();

    // Clear form and test valid amount with wrong password
    await user.clear(screen.getByLabelText(/amount/i));
    await user.type(screen.getByLabelText(/amount/i), "2000"); // R$ 20.00

    await user.click(screen.getByRole("button", { name: /transfer/i }));

    // Password modal should appear
    expect(screen.getByText(/enter transaction password/i)).toBeInTheDocument();

    // Enter wrong password
    const passwordInputWrong = screen.getByDisplayValue("");
    await user.type(passwordInputWrong, "wrong");
    await user.click(screen.getByRole("button", { name: /confirm/i }));

    // Should show password error and stay on password modal
    expect(
      screen.getByText(/invalid transaction password/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/enter transaction password/i)).toBeInTheDocument();

    // Cancel the modal
    await user.click(screen.getByRole("button", { name: /cancel/i }));
    expect(
      screen.queryByText(/enter transaction password/i)
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
    expect(screen.getByDisplayValue("PIX")).toBeInTheDocument();
    expect(screen.getByLabelText(/pix key/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/bank/i)).not.toBeInTheDocument();

    // Switch to TED
    await user.selectOptions(screen.getByLabelText(/transaction type/i), "TED");

    // Should show TED fields and hide PIX key
    expect(screen.getByLabelText(/bank/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/branch/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/account/i)).toBeInTheDocument();
    expect(screen.queryByLabelText(/pix key/i)).not.toBeInTheDocument();
  });
});
