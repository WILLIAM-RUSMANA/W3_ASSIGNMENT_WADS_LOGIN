import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import LogoutButton from "./logout-button";
import { toast } from "sonner";

const pushMock = jest.fn();
const refreshMock = jest.fn();

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    push: pushMock,
    refresh: refreshMock,
  }),
}));

jest.mock("sonner", () => ({
  toast: {
    success: jest.fn(),
    error: jest.fn(),
  },
}));

describe("LogoutButton", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders logout button", () => {
    render(<LogoutButton />);
    expect(screen.getByText(/logout/i)).toBeInTheDocument();
  });

  it("successfully logs out and redirects", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: true } as Response)
    );

    render(<LogoutButton />);

    await userEvent.click(screen.getByText(/logout/i));
    await userEvent.click(screen.getByText(/yes, logout/i));

    await waitFor(() => {
      expect(global.fetch).toHaveBeenCalledWith("/api/logout", {
        method: "POST",
      });

      expect(toast.success).toHaveBeenCalledWith("logout success");

      expect(pushMock).toHaveBeenCalledWith("/login");
      expect(refreshMock).toHaveBeenCalled();
    });
  });

  it("shows error toast when logout fails", async () => {
    global.fetch = jest.fn(() =>
      Promise.resolve({ ok: false } as Response)
    );

    render(<LogoutButton />);

    await userEvent.click(screen.getByText(/logout/i));
    await userEvent.click(screen.getByText(/yes, logout/i));

    await waitFor(() => {
      expect(toast.error).toHaveBeenCalled();
    });
  });
});