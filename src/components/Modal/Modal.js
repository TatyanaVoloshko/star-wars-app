import React, { useEffect } from "react";
import "./Modal.css";

const Modal = ({ isOpen, onClose, children }) => {
  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEsc);
    } else {
      document.removeEventListener("keydown", handleEsc);
    }

    return () => {
      document.removeEventListener("keydown", handleEsc);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div
      className="modal-overlay"
      onClick={onClose}
      data-testid="modal-overlay"
    >
      <div
        className="modal-content"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
      >
        <button
          className="modal-close"
          onClick={onClose}
          data-testid="close-button"
        >
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;
