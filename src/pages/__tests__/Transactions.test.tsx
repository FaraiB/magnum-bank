import { renderWithProviders, screen, waitFor } from "../../test-utils";
import Transactions from "../Transactions";
import { vi } from "vitest";
import { configureStore } from "@reduxjs/toolkit";
import userSlice from "../../redux/userSlice";
import userEvent from "@testing-library/user-event";

// Mock the navigate function to prevent navigation errors in tests
const mockNavigate = vi.fn();
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const createStoreWithBalance = (initialBalance: number) => {
  return configureStore({
    reducer: {
      user: userSlice,
    },
    preloadedState: {
      user: {
        id: "1",
        name: "Test User",
        balance: initialBalance,
        transactions: [],
      },
    },
  });
};

describe("Transactions Component", () => {
  it("should render the transaction form with all fields", () => {
    renderWithProviders(<Transactions />);

    expect(
      screen.getByRole("heading", { name: /New Transaction/i })
    ).toBeInTheDocument();
    expect(screen.getByLabelText(/Recipient Name:/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Recipient CPF\/CNPJ:/i)).toBeInTheDocument();
    // Corrected: The label text now includes "(R$)"
    expect(screen.getByLabelText(/Amount \(R\$\):/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Transaction Type:/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /Transfer/i })
    ).toBeInTheDocument();
  });

  it("should render the user's current balance", () => {
    const mockBalance = 2500.55;
    const store = createStoreWithBalance(mockBalance);

    renderWithProviders(<Transactions />, { store });

    // Assert that the user's balance is displayed on the screen
    expect(
      screen.getByText(`R$ ${mockBalance.toFixed(2)}`)
    ).toBeInTheDocument();
  });

  it("should handle a successful transaction", async () => {
    const user = userEvent.setup();
    const store = createStoreWithBalance(1000);
    const mockRecipientName = "John Doe";
    const mockAmountInput = "500"; // Raw input string
    const expectedAmount = 5.0; // Correct numerical value after formatting

    renderWithProviders(<Transactions />, { store });

    await user.type(
      screen.getByLabelText(/Recipient Name/i),
      mockRecipientName
    );
    await user.type(
      screen.getByLabelText(/Recipient CPF\/CNPJ/i),
      "12345678901"
    );
    // Use the raw input string
    await user.type(screen.getByLabelText(/Amount \(R\$\):/i), mockAmountInput);
    await user.selectOptions(
      screen.getByLabelText(/Transaction Type:/i),
      "TED"
    );

    await user.click(screen.getByRole("button", { name: /Transfer/i }));

    // Corrected: The success message now displays the formatted amount
    expect(
      screen.getByText(
        `Transaction of R$ ${expectedAmount.toFixed(
          2
        )} to ${mockRecipientName} successful!`
      )
    ).toBeInTheDocument();

    // Corrected: Assert the updated balance and transaction value
    const updatedUser = store.getState().user;
    expect(updatedUser.balance).toBe(1000 - expectedAmount);
    expect(updatedUser.transactions.length).toBe(1);
    expect(updatedUser.transactions[0].value).toBe(-expectedAmount);
    expect(updatedUser.transactions[0].type).toBe("TED");
  });

  it("should show an error for insufficient funds and not update the store", async () => {
    const user = userEvent.setup();
    const initialBalance = 1000;
    const store = createStoreWithBalance(initialBalance);
    // Corrected: Input a value that, when formatted, will be greater than the balance
    const mockAmountInput = "150000"; // This will be R$ 1,500.00
    // const expectedAmount = 1500.0;

    renderWithProviders(<Transactions />, { store });

    await user.type(screen.getByLabelText(/Recipient Name/i), "Test Recipient");
    await user.type(
      screen.getByLabelText(/Recipient CPF\/CNPJ/i),
      "12345678901"
    );
    // Use the raw input string
    await user.type(screen.getByLabelText(/Amount \(R\$\):/i), mockAmountInput);

    await user.click(screen.getByRole("button", { name: /Transfer/i }));

    expect(screen.getByText(/Insufficient funds./i)).toBeInTheDocument();

    const updatedUser = store.getState().user;
    expect(updatedUser.balance).toBe(initialBalance);
    expect(updatedUser.transactions.length).toBe(0);
  });

  it("should navigate to the home page when the Back to Home button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Transactions />);

    await user.click(screen.getByRole("button", { name: /Back to Home/i }));

    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
