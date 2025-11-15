import { Component, computed, input, output } from '@angular/core';

import { CommonModalTemplate } from '../modal/common-modal-template/common-modal-template';
import { ButtonText, ModalTitle, PictureName } from '../../../app.enum';

@Component({
  selector: 'app-delete-participant-modal',
  imports: [CommonModalTemplate],
  standalone: true,
  templateUrl: './delete-participant-modal.html',
  styleUrl: './delete-participant-modal.scss',
})
export class DeleteParticipantModal {
  public readonly participantName = input.required<string>();

  public readonly buttonAction = output<void>();
  public readonly closeModal = output<void>();

  public readonly headerPictureName = PictureName.Cookie;

  public readonly buttonText = ButtonText.Delete;

  public readonly cancelButtonText = ButtonText.Cancel;

  public readonly title = ModalTitle.RemoveParticipant;
  public readonly message = computed(
    () =>
      `Are you sure you want to remove <b>${this.participantName()}</b> from the game? This action cannot be undone.`
  );

  public onCloseModal(): void {
    this.closeModal.emit();
  }

  public onButtonAction(): void {
    this.buttonAction.emit();
  }
}
