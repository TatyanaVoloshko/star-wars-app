import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import Modal from "./Modal";
import "@testing-library/jest-dom";

describe("Modal Component", () => {
  // Test rendering modal content when open
  test("renders modal content when open", () => {
    render(
      <Modal isOpen={true} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    // Check that modal content is in the document
    expect(screen.getByText(/Modal Content/i)).toBeInTheDocument();
  });

  // Test not rendering modal when not open
  test("does not render when not open", () => {
    render(
      <Modal isOpen={false} onClose={() => {}}>
        <div>Modal Content</div>
      </Modal>
    );

    // Check that modal content is not in the document
    expect(screen.queryByText(/Modal Content/i)).not.toBeInTheDocument();
  });

  // Test calling onClose when clicking the close button
  test("calls onClose when clicking close button", async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Simulate clicking the close button
    fireEvent.click(screen.getByTestId("close-button"));
    // Wait and expect the onClose function to have been called once
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });
})

// Test calling onClose when clicking the overlay
 test("calls onClose when clicking overlay", async () => {
   const onClose = jest.fn();
   render(
     <Modal isOpen={true} onClose={onClose}>
       <div>Modal Content</div>
     </Modal>
   );

   // Simulate clicking the modal overlay
   fireEvent.click(screen.getByTestId("modal-overlay"));
   // Wait and expect the onClose function to have been called once
   await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
 });

 // Test calling onClose when Escape key is pressed
  test("calls onClose when Escape is pressed", async () => {
    const onClose = jest.fn();
    render(
      <Modal isOpen={true} onClose={onClose}>
        <div>Modal Content</div>
      </Modal>
    );

    // Simulate pressing the Escape key
    fireEvent.keyDown(document, { key: "Escape", code: "Escape" });
    // Wait and expect the onClose function to have been called once
    await waitFor(() => expect(onClose).toHaveBeenCalledTimes(1));
  });


