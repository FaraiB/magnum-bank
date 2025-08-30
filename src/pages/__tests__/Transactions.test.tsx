import { renderWithProviders, screen } from "../../test-utils";
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
    expect(screen.getByLabelText(/Amount:/i)).toBeInTheDocument();
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
    const mockAmount = "500";

    renderWithProviders(<Transactions />, { store });

    // Simulate user input
    await user.type(
      screen.getByLabelText(/Recipient Name/i),
      mockRecipientName
    );
    await user.type(
      screen.getByLabelText(/Recipient CPF\/CNPJ/i),
      "12345678901"
    );
    await user.type(screen.getByLabelText(/Amount/i), mockAmount);

    // Click the transfer button
    await user.click(screen.getByRole("button", { name: /Transfer/i }));

    // Assert a success message is displayed
    expect(
      screen.getByText(
        `Transaction of R$ ${parseFloat(mockAmount).toFixed(
          2
        )} to ${mockRecipientName} successful!`
      )
    ).toBeInTheDocument();

    // Assert that the Redux store was updated
    const updatedUser = store.getState().user;
    expect(updatedUser.balance).toBe(500);
    expect(updatedUser.transactions.length).toBe(1);
    expect(updatedUser.transactions[0].value).toBe(500);
  });

  it("should show an error for insufficient funds and not update the store", async () => {
    const user = userEvent.setup();
    const initialBalance = 1000;
    const store = createStoreWithBalance(initialBalance);
    const mockAmount = "1500"; // Amount greater than balance

    renderWithProviders(<Transactions />, { store });

    // Simulate user input
    await user.type(screen.getByLabelText(/Recipient Name/i), "Test Recipient");
    await user.type(
      screen.getByLabelText(/Recipient CPF\/CNPJ/i),
      "12345678901"
    );
    await user.type(screen.getByLabelText(/Amount/i), mockAmount);

    // Click the submit button
    await user.click(screen.getByRole("button", { name: /Transfer/i }));

    // Assert that an error message is displayed
    expect(screen.getByText(/Insufficient funds./i)).toBeInTheDocument();

    // Assert that the Redux store was NOT updated
    const updatedUser = store.getState().user;
    expect(updatedUser.balance).toBe(initialBalance); // Balance should remain the same
    expect(updatedUser.transactions.length).toBe(0); // No new transaction added
  });

  it("should navigate to the home page when the Back to Home button is clicked", async () => {
    const user = userEvent.setup();
    renderWithProviders(<Transactions />);

    // Click the "Back to Home" button
    await user.click(screen.getByRole("button", { name: /Back to Home/i }));

    // Assert that the mock navigate function was called with the correct path
    expect(mockNavigate).toHaveBeenCalledWith("/");
  });
});
