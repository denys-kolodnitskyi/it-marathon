import { Component, computed, input, output } from '@angular/core';

import { CommonModalTemplate } from '../modal/common-modal-template/common-modal-template';
// Імпортуємо ваші Enums
import {
  ButtonText,
  ModalSubtitle,
  ModalTitle,
  PictureName,
} from '../../../app.enum';
// Нам більше не потрібні окремі кнопки, бо вони вже є в CommonModalTemplate
// import { ButtonComponent } from '../button/button.component';

@Component({
  selector: 'app-delete-participant-modal',
  imports: [CommonModalTemplate], // <--- Прибрали ButtonComponent
  standalone: true,
  templateUrl: './delete-participant-modal.html',
  styleUrl: './delete-participant-modal.scss',
})
export class DeleteParticipantModal {
  // ВХІДНІ ДАНІ:
  public readonly participantName = input.required<string>();

  // ВИХІДНІ ДІЇ:
  public readonly buttonAction = output<void>(); // "Delete"
  public readonly closeModal = output<void>(); // "Cancel"

  // === ДАНІ ДЛЯ CommonModalTemplate ===

  // 1. Обов'язковий Input (я припускаю, що у вас є такий PictureName)
  public readonly headerPictureName = PictureName.Cookie; // <-- ПЕРЕВІРТЕ ЦЕЙ ENUM

  // 2. Обов'язковий Input (головна кнопка)
  public readonly buttonText = ButtonText.Delete; // <-- Додайте 'Delete' у ваш ButtonText enum

  // 4. Input для кнопки "Cancel"
  public readonly cancelButtonText = ButtonText.Cancel; // <-- Додайте 'Cancel' у ваш ButtonText enum

  // 5. Заголовки (як на скріншоті)
  public readonly title = ModalTitle.RemoveParticipant; // <-- Додайте 'Remove a participant' в enum
  public readonly message = computed(
    () =>
      `Are you sure you want to remove <b>${this.participantName()}</b> from the game? This action cannot be undone.`
  );
  // ======================================

  // Обробники для кнопок
  public onCloseModal(): void {
    this.closeModal.emit();
  }

  public onButtonAction(): void {
    this.buttonAction.emit();
  }
}
