import type { Participant } from "@app-types/api";

export const getCurrentUser = (
  userCode: string,
  participants?: Participant[],
) => participants?.find((user) => user.userCode === userCode);

export const getParticipantInfoById = (
  userId: number,
  participants?: Participant[],
) => participants?.find((participant) => participant.id === userId);
