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
    expect(screen.getByLabelText("auth.cpf")).toBeInTheDocument();
    expect(screen.getByLabelText("auth.password")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "auth.loginButton" })
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: /Magnum Bank/i })
    ).toBeInTheDocument();
  });

  it("handles successful login", async () => {
    const user = userEvent.setup();

    const mockUser = { id: "1", name: "Jane Doe", cpf: "12345678901" };
    mockLogin.mockResolvedValueOnce({
      user: mockUser,
      token: "mock-jwt-token",
    });

    renderWithProviders(<Login />);

    await user.type(screen.getByLabelText("auth.cpf"), "12345678901");
    await user.type(screen.getByLabelText("auth.password"), "password123");
    await user.click(screen.getByRole("button", { name: "auth.loginButton" }));

    expect(mockLogin).toHaveBeenCalledWith("12345678901", "password123");
  });
  it("handles login failure", async () => {
    const user = userEvent.setup();

    mockLogin.mockRejectedValueOnce(new Error("Invalid credentials"));

    renderWithProviders(<Login />);
    await user.type(screen.getByLabelText("auth.cpf"), "12345678901");
    await user.type(screen.getByLabelText("auth.password"), "wrongpassword");
    await user.click(screen.getByRole("button", { name: "auth.loginButton" }));

    await waitFor(() => {
      expect(screen.getByText("auth.loginError")).toBeInTheDocument();
    });
  });
});
