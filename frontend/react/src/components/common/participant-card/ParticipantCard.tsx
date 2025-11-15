import CopyButton from "../copy-button/CopyButton";
import InfoButton from "../info-button/InfoButton";
import ItemCard from "../item-card/ItemCard";
import { type DeleteUserResponse, type ParticipantCardProps } from "./types";
import "./ParticipantCard.scss";
import DeleteButton from "../delete-button/DeleteButton";
import { useState } from "react";
import RemovalModal from "../modals/removal-modal/RemovalModal";
import { BASE_API_URL } from "@utils/general";
import { useFetch } from "@hooks/useFetch";

const ParticipantCard = ({
  firstName,
  lastName,
  isCurrentUser = false,
  isAdmin = false,
  isCurrentUserAdmin = false,
  adminInfo = "",
  participantLink = "",
  isRoomClosed = false,
  participantsCount = 0,
  userId,
  userCode,
  onInfoButtonClick,
  onDeletedParticipant,
}: ParticipantCardProps) => {
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);

  const openRemovalModal = () => setIsRemovalModalOpen(true);
  const closeRemovalModal = () => setIsRemovalModalOpen(false);

  const deleteUrl = `${BASE_API_URL}/api/users/${userId}?userCode=${userCode}`;

  const deleteUser = useFetch<DeleteUserResponse, undefined>(
    {
      url: deleteUrl,
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      onSuccess: () => {
        closeRemovalModal();
      },
      onError: () => {
        closeRemovalModal();
      },
    },
    false,
  );

  const handleRemoveConfirm = () => {
    deleteUser.fetchData(undefined);
    onDeletedParticipant?.();
    closeRemovalModal();
  };

  return (
    <>
      <ItemCard title={`${firstName} ${lastName}`} isFocusable>
        <div className="participant-card-info-container">
          {isCurrentUser ? <p className="participant-card-role">You</p> : null}

          {!isCurrentUser && isAdmin ? (
            <p className="participant-card-role">Admin</p>
          ) : null}

          {isCurrentUserAdmin && !isCurrentUser ? (
            <CopyButton
              textToCopy={participantLink}
              iconName="link"
              successMessage="Personal Link is copied!"
              errorMessage="Personal Link was not copied. Try again."
            />
          ) : null}

          {isCurrentUserAdmin && !isAdmin ? (
            <InfoButton withoutToaster onClick={onInfoButtonClick} />
          ) : null}

          {!isCurrentUser && isAdmin ? (
            <InfoButton infoMessage={adminInfo} />
          ) : null}

          {isCurrentUserAdmin && !isAdmin ? (
            <DeleteButton
              isDisabled={isRoomClosed || participantsCount <= 3}
              onClick={openRemovalModal}
            />
          ) : null}
        </div>
      </ItemCard>

      <RemovalModal
        isOpen={isRemovalModalOpen}
        onClose={closeRemovalModal}
        onConfirm={handleRemoveConfirm}
        name={`${firstName} ${lastName}`}
      />
    </>
  );
};

export default ParticipantCard;
