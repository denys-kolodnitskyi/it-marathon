import { useEffect } from "react";
import { createPortal } from "react-dom";
import IconButton from "@components/common/icon-button/IconButton";
import Button from "@components/common/button/Button";
import "@assets/styles/common/modal-container.scss";
import type { RemovalModalProps } from "./types";

const RemovalModal = ({
  name,
  isOpen = false,
  onClose,
  onConfirm,
}: RemovalModalProps) => {
  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalElement = (
    <div className="modal-container">
      <div className="modal">
        <div className="modal__heading modal__heading--cookie">
          <h3 className="modal__title">Remove a participant</h3>
          <p className="modal__description">
            Are you sure you want to remove <b>{name}</b> from the game? This
            action cannot be undone.
          </p>
        </div>

        <div className="modal__close-button">
          <IconButton iconName="cross" onClick={onClose} />
        </div>

        <div className="modal__back-button">
          <Button
            className="button--primary button--medium"
            size="medium"
            onClick={onConfirm}
            style={{ marginRight: "16px" }}
          >
            Delete
          </Button>
          <Button
            className="button--secondary button--medium"
            size="medium"
            onClick={onClose}
          >
            Cancel
          </Button>
        </div>
      </div>
    </div>
  );

  return createPortal(modalElement, document.body);
};

export default RemovalModal;
