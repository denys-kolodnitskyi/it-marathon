import type { GetParticipantsResponse } from "@app-types/api";

export interface ParticipantsListProps {
  isRoomClosed?: boolean;
  participants: GetParticipantsResponse;
  onDeletedParticipant?: () => void;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  deliveryInfo: string;
  link?: string;
}
