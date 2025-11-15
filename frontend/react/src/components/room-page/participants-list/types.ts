import type { GetParticipantsResponse } from "@app-types/api.ts";

export interface ParticipantsListProps {
  isRoomClosed?: boolean;
  participants: GetParticipantsResponse;
}

export interface PersonalInformation {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  deliveryInfo: string;
  link?: string;
}
