export interface RemovalModalProps {
  isOpen?: boolean;
  name: string;
  onClose: () => void;
  onConfirm: () => void;
  description?: string;
}
