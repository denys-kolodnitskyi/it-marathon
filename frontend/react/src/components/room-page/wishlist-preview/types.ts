import type { WishList } from "@app-types/api";

export interface WishlistPreviewProps {
  isWantSurprise?: boolean;
  wishListData?: WishList;
  onViewWishlist: () => void;
}
