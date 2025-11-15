import type { GetParticipantsResponse, GetRoomResponse } from "@app-types/api";

export interface RoomPageContentProps {
  participants: GetParticipantsResponse;
  roomDetails: GetRoomResponse;
  onDrawNames: () => void;
  onDeletedParticipant?: () => void;
}
