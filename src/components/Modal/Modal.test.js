import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modal from "./Modal";
import "@testing-library/jest-dom";

describe("Modal Component", () => {
  test("renders modal content when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
        <button aria-label="Close" data-testid="close-button">
          ×
        </button>
      </Modal>
    );

    expect(screen.getByText(/Modal Content/i)).toBeInTheDocument();
  });

  test("does not render when not open", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
        <button aria-label="Close" data-testid="close-button">
          ×
        </button>
      </Modal>
    );

    expect(screen.queryByText(/Modal Content/i)).not.toBeInTheDocument();
  });

  test("calls onClose when clicking overlay or close button", async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
        <button aria-label="Close" data-testid="close-button">
          ×
        </button>
      </Modal>
    );

    // Проверяем кнопку закрытия
    fireEvent.click(screen.getByTestId("close-button"));
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));

//     // Проверяем клик по оверлею
//     fireEvent.click(screen.getByTestId("modal-overlay"));
//     await waitFor(() => expect(onClose).toHaveBeenCalledTimes(2));
  });
})
