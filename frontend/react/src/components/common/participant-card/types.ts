import type { Participant } from "@app-types/api";

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
  userId?: number;
  userCode?: string;
  onInfoButtonClick?: () => void;
  onDeletedParticipant?: () => void;
}

export type DeleteUserResponse = Participant[];
