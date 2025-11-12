import { Component, computed, HostBinding, input } from '@angular/core';
import { User } from '../../../app.models';
import { ParticipantCard } from '../participant-card/participant-card';
import { toTimestamp } from '../../../utils/times';

@Component({
  selector: 'app-participant-list',
  imports: [ParticipantCard],
  templateUrl: './participant-list.html',
  styleUrl: './participant-list.scss',
})
export class ParticipantList {
  public readonly participants = input<User[]>([]);
  public readonly maxParticipants = input<number>(20);
  public readonly isAdmin = input<boolean>(false);
  public readonly userCode = input<string>('');

  // === КРОК 1: ДОДАЄМО НОВИЙ INPUT ===
  // Тепер батьківський компонент (який використовує <app-participant-list>)
  // повинен передати сюди стан кімнати.
  public readonly isRoomClosed = input.required<boolean>();
  // ===================================

  @HostBinding('class.non-admin-list')
  get adminClass(): boolean {
    return !this.isAdmin();
  }

  currentCount = computed(() => this.participants().length);

  // === КРОК 2: ОБЧИСЛЮЄМО ЛОГІКУ КНОПКИ ===
  public readonly isDeleteDisabled = computed(() => {
    const userCount = this.currentCount(); // Використовуємо ваш існуючий computed
    const isClosed = this.isRoomClosed(); // Використовуємо наш новий input

    // Ваша логіка:
    return userCount <= 1 || isClosed;
  });
  // ======================================

  sortedParticipants = computed(() => {
    return [...this.participants()].sort(
      (firstParticipant, secondParticipant) => {
        if (firstParticipant.isAdmin !== secondParticipant.isAdmin)
          return firstParticipant.isAdmin ? -1 : 1;

        const firstJoinDate = toTimestamp(
          firstParticipant.createdOn ?? firstParticipant.modifiedOn
        );
        const secondJoinDate = toTimestamp(
          secondParticipant.createdOn ?? secondParticipant.modifiedOn
        );

        return firstJoinDate - secondJoinDate;
      }
    );
  });
}
