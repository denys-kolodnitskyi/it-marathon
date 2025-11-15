import CopyButton from "../copy-button/CopyButton";
import InfoButton from "../info-button/InfoButton";
import ItemCard from "../item-card/ItemCard";
import { type ParticipantCardProps } from "./types";
import "./ParticipantCard.scss";
import DeleteButton from "../delete-button/DeleteButton";
import { useState } from "react";
import RemovalModal from "../modals/removal-modal/RemovalModal";

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
  onInfoButtonClick,
}: ParticipantCardProps) => {
  const [isRemovalModalOpen, setIsRemovalModalOpen] = useState(false);

  const openRemovalModal = () => setIsRemovalModalOpen(true);
  const closeRemovalModal = () => setIsRemovalModalOpen(false);

  const handleRemoveConfirm = () => {
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
