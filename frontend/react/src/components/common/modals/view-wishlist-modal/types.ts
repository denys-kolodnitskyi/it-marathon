import type { WishList } from "@app-types/api";

export interface ViewWishlistModalProps {
  isOpen?: boolean;
  onClose: () => void;
  budget: number;
  wantSurprise: boolean;
  wishlistData?: WishList;
  interests?: string;
}
