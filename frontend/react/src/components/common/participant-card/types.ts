export interface ParticipantCardProps {
  firstName: string;
  lastName: string;
  isCurrentUser?: boolean;
  isAdmin?: boolean;
  isCurrentUserAdmin?: boolean;
  adminInfo?: string;
  participantLink?: string;
  isRoomClosed?: boolean;
  participantsCount?: number;
  onInfoButtonClick?: () => void;
}
