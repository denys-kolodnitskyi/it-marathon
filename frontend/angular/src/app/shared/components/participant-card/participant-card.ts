import {
  Component,
  computed,
  ElementRef,
  HostBinding,
  inject,
  input,
} from '@angular/core';
import { tap, take } from 'rxjs'; // Додано 'take'

import { IconButton } from '../icon-button/icon-button';
import {
  AriaLabel,
  IconName,
  MessageType,
  NavigationLinkSegment,
  PersonalLink,
  PopupPosition,
} from '../../../app.enum';
import { PopupService } from '../../../core/services/popup';
import { copyToClipboard } from '../../../utils/copy';
import { UrlService } from '../../../core/services/url';
import { ParticipantInfoModal } from '../../../room/components/participant-info-modal/participant-info-modal';
// === Імпорт нашого нового модального вікна ===
import { DeleteParticipantModal } from '../delete-participant-modal/delete-participant-modal';
import { ModalService } from '../../../core/services/modal';
import { getPersonalInfo } from '../../../utils/get-personal-info';
import { UserService } from '../../../room/services/user';
import type { User, DeleteParticipantModalInputs } from '../../../app.models'; // Додано DeleteParticipantModalInputs

@Component({
  selector: 'li[app-participant-card]',
  imports: [IconButton], // Модалки тут не потрібні, їх викликає сервіс
  standalone: true, // Переконайтеся, що ваші компоненти standalone
  templateUrl: './participant-card.html',
  styleUrl: './participant-card.scss',
})
export class ParticipantCard {
  // === ВХІДНІ ДАНІ (INPUTS) ===
  readonly participant = input.required<User>();
  readonly isCurrentUserAdmin = input.required<boolean>();
  readonly showCopyIcon = input<boolean>(false);
  readonly userCode = input<string>('');

  // --- НОВИЙ INPUT ДЛЯ ДЕАКТИВАЦІЇ КНОПКИ ---
  readonly isDeleteDisabled = input<boolean>(false);
  // -----------------------------------------

  // === СЕРВІСИ (INJECTS) ===
  readonly #popup = inject(PopupService);
  readonly #urlService = inject(UrlService);
  readonly #host = inject(ElementRef<HTMLElement>);
  readonly #modalService = inject(ModalService);
  readonly #userService = inject(UserService);

  // === ОБЧИСЛЮВАНІ ЗНАЧЕННЯ (COMPUTED) ===
  public readonly isCurrentUser = computed(() => {
    const code = this.userCode();
    return !!code && this.participant()?.userCode === code;
  });
  public readonly fullName = computed(
    () => `${this.participant().firstName} ${this.participant().lastName}`
  );

  // === НАЛАШТУВАННЯ ІКОНОК ===
  public readonly iconCopy = IconName.Link;
  public readonly ariaLabelCopy = AriaLabel.ParticipantLink;
  public readonly iconInfo = IconName.Info;
  public readonly ariaLabelInfo = AriaLabel.Info;
  public readonly iconDelete = IconName.Close; // Або IconName.Delete
  public readonly ariaLabelDelete = AriaLabel.DeleteParticipant;

  @HostBinding('tabindex') tab = 0;
  @HostBinding('class.list-row') rowClass = true;

  // === МЕТОДИ ДЛЯ ІКОНОК ===

  public async copyRoomLink(): Promise<void> {
    const host = this.#host.nativeElement;
    const code = this.participant().userCode;

    if (!code) {
      this.#popup.show(
        host,
        PopupPosition.Right,
        { message: PersonalLink.Error, type: MessageType.Error },
        false
      );
      return;
    }

    const { absoluteUrl } = this.#urlService.getNavigationLinks(
      code,
      NavigationLinkSegment.Room
    );
    const ok = await copyToClipboard(absoluteUrl);

    this.#popup.show(
      host,
      PopupPosition.Right,
      {
        message: ok ? PersonalLink.Success : PersonalLink.Error,
        type: ok ? MessageType.Success : MessageType.Error,
      },
      false
    );
  }

  public onInfoClick(): void {
    if (!this.participant().isAdmin) {
      this.#openModal();
      return;
    }
    this.#showPopup();
  }

  // --- ФІНАЛЬНА ЛОГІКА КНОПКИ ВИДАЛЕННЯ ---
  public onDeleteParticipantClick(): void {
    const modalInputs: DeleteParticipantModalInputs = {
      participantName: this.fullName(),
    };

    // 1. Відкриваємо модалку
    this.#modalService.openWithResult(DeleteParticipantModal, modalInputs, {
      // 2. Передаємо функцію, яка виконається при натисканні "Delete"
      buttonAction: () => this.#handleDeleteConfirm(),
      // 3. Передаємо функцію, яка виконається при натисканні "Cancel"
      closeModal: () => this.#modalService.close(),
    });
  }
  // ----------------------------------------

  public onCopyHover(target: EventTarget | null): void {
    if (target instanceof HTMLElement) {
      this.#popup.show(
        target,
        PopupPosition.Center,
        { message: PersonalLink.Info, type: MessageType.Info },
        true
      );
    }
  }

  public onCopyLeave(target: EventTarget | null): void {
    if (target instanceof HTMLElement) {
      this.#popup.hide(target);
    }
  }

  // === ПРИВАТНІ МЕТОДИ ===

  #openModal(): void {
    const personalInfo = getPersonalInfo(this.participant());
    const roomLink = this.#urlService.getNavigationLinks(
      this.participant().userCode || '',
      NavigationLinkSegment.Join
    ).absoluteUrl;

    this.#userService
      .getUsers()
      .pipe(
        tap(({ status }) => {
          if (status === 200) {
            this.#modalService.openWithResult(
              ParticipantInfoModal,
              { personalInfo, roomLink },
              {
                buttonAction: () => this.#modalService.close(),
                closeModal: () => this.#modalService.close(),
              }
            );
          }
        })
      )
      .subscribe();
  }

  #showPopup(): void {
    const { email, phone } = this.participant();
    const container = this.#host.nativeElement.closest(
      'app-participant-list'
    ) as HTMLElement;
    const message = email
      ? `${phone}
         ${email}`
      : `${phone}`;

    this.#popup.show(
      container,
      PopupPosition.Right,
      {
        message,
        type: MessageType.Info,
      },
      true
    );
  }

  // --- ЛОГІКА ОБРОБКИ ПІДТВЕРДЖЕННЯ ВИДАЛЕННЯ ---
  #handleDeleteConfirm(): void {
    const participantId = this.participant().id;

    // Викликаємо сервіс, який ми додали
    this.#userService
      .deleteUser(participantId)
      .pipe(
        take(1) // Важливо: відписуємося після першої відповіді
      )
      .subscribe({
        next: () => {
          // Успіх! Сервіс сам оновить список користувачів і покаже toast.
          // Нам потрібно лише закрити модалку.
          this.#modalService.close();
        },
        error: (err: any) => {
          // Бекенд відхилив запит (напр. 400 Bad Request)
          console.error('Failed to delete user:', err);
          // (Сервіс сам покаже toast про помилку)
          // Все одно закриваємо модалку.
          this.#modalService.close();
        },
      });
  }
  // --------------------------------------------
}
