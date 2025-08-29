import { renderWithProviders, screen, waitFor } from "../../test-utils";
import { vi } from "vitest";
import userEvent from "@testing-library/user-event";
import Login from "../Login";
import * as apiService from "../../api/apiService";

vi.mock("../../api/apiService");
const mockLogin = vi.mocked(apiService.login);

describe("Login Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });
  it("should render the login form", () => {
    renderWithProviders(<Login />);

    // Assert that the login form elements are present
    expect(screen.getByLabelText(/CPF/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Login/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /Login/i })).toBeInTheDocument();
  });
  it("handles successful login", async () => {
    const user = userEvent.setup();

    const mockUser = { id: "1", name: "Jane Doe", cpf: "12345678901" };
    mockLogin.mockResolvedValueOnce({
      user: mockUser,
      token: "mock-jwt-token",
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText(/cpf/i), "12345678901");
    await user.type(screen.getByLabelText(/password/i), "password123");
    await user.click(screen.getByRole("button", { name: /login/i }));

    expect(mockLogin).toHaveBeenCalledWith("12345678901", "password123");
  });
  it("handles login failure", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    renderWithProviders(<Login />);
    await user.type(screen.getByLabelText(/cpf/i), "12345678901");
    await user.type(screen.getByLabelText(/password/i), "wrongpassword");
    await user.click(screen.getByRole("button", { name: /login/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid cpf or password/i)).toBeInTheDocument();
    });
  });
});
