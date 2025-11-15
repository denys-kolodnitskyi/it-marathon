import { useEffect } from "react";
import { useParams } from "react-router";
import type {
  GetParticipantsResponse,
  GetRoomResponse,
  DrawRoomResponse,
} from "@app-types/api.ts";
import Loader from "@components/common/loader/Loader.tsx";
import { useFetch } from "@hooks/useFetch.ts";
import useToaster from "@hooks/useToaster.ts";
import { BASE_API_URL } from "@utils/general.ts";
import RoomPageContent from "./room-page-content/RoomPageContent.tsx";
import { ROOM_PAGE_TITLE } from "./utils.ts";
import "./RoomPage.scss";

const RoomPage = () => {
  const POLL_INTERVAL = 100;
  const MAX_POLL_RETRIES = 20;

  const { showToast } = useToaster();
  const { userCode } = useParams();

  useEffect(() => {
    document.title = ROOM_PAGE_TITLE;
  }, []);

  const {
    data: roomDetails,
    isLoading: isLoadingRoomDetails,
    fetchData: fetchRoomDetails,
  } = useFetch<GetRoomResponse>(
    {
      url: `${BASE_API_URL}/api/rooms?userCode=${userCode}`,
      method: "GET",
      headers: { "Content-Type": "application/json" },
      onError: () => {
        showToast("Something went wrong. Try again.", "error", "large");
      },
    },
    true,
  );

  const {
    data: participants,
    isLoading: isLoadingParticipants,
    fetchData: fetchParticipants,
  } = useFetch<GetParticipantsResponse>({
    url: `${BASE_API_URL}/api/users?userCode=${userCode}`,
    method: "GET",
    headers: { "Content-Type": "application/json" },
    onError: () => {
      showToast("Something went wrong. Try again.", "error", "large");
    },
  });

  const { fetchData: fetchRandomize, isLoading: isRandomizing } =
    useFetch<DrawRoomResponse>(
      {
        url: `${BASE_API_URL}/api/rooms/draw?userCode=${userCode}`,
        method: "POST",
        headers: { "Content-Type": "application/json" },
        onSuccess: () => {
          showToast(
            "Success! All participants are matched.\nLet the gifting magic start!",
            "success",
            "large",
          );
          fetchRoomDetails();
          fetchParticipants();
        },
        onError: () => {
          showToast("Something went wrong. Try again.", "error", "large");
        },
      },
      false,
    );

  const isLoading =
    isLoadingRoomDetails || isLoadingParticipants || isRandomizing;

  if (!userCode) {
    return null;
  }

  const handleParticipantDeletion = () => {
    const currentCount = participants ? participants.length : 0;
    if (currentCount === 0) return;
    const expectedCount = currentCount - 1;

    let retryCount = 0;

    const pollForChanges = async () => {
      retryCount++;

      if (retryCount > MAX_POLL_RETRIES) {
        showToast("Could not refresh list. Please reload.", "error", "large");
        return;
      }

      try {
        const response = await fetch(
          `${BASE_API_URL}/api/users?userCode=${userCode}`,
          {
            method: "GET",
            headers: { "Content-Type": "application/json" },
          },
        );

        if (!response.ok) throw new Error("Fetch failed");

        const updatedList: GetParticipantsResponse = await response.json();

        if (updatedList.length === expectedCount) {
          fetchParticipants();
          fetchRoomDetails();
        } else {
          setTimeout(pollForChanges, POLL_INTERVAL);
        }
      } catch {
        showToast("Error updating participants.", "error", "large");
      }
    };

    setTimeout(pollForChanges, POLL_INTERVAL);
  };

  return (
    <main className="room-page">
      {isLoading ? <Loader /> : null}

      <RoomPageContent
        participants={participants ?? []}
        roomDetails={roomDetails ?? ({} as GetRoomResponse)}
        onDrawNames={() => fetchRandomize()}
        onDeletedParticipant={handleParticipantDeletion}
      />
    </main>
  );
};

export default RoomPage;
