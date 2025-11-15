import { computed, inject, Injectable, signal } from '@angular/core';
import { Observable, tap, take } from 'rxjs';
import { HttpResponse } from '@angular/common/http';

import { ApiService } from '../../core/services/api';
import { RoomService } from './room';
import { ToastService } from '../../core/services/toast';
import { MessageType, ToastMessage } from '../../app.enum';
import type { User } from '../../app.models';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  readonly #apiService = inject(ApiService);
  readonly #roomService = inject(RoomService);
  readonly #toasterService = inject(ToastService);

  readonly #userCode = signal<string>('');
  readonly #users = signal<User[]>([]);

  public readonly userCode = this.#userCode.asReadonly();
  public readonly users = this.#users.asReadonly();

  public readonly currentUser = computed(() =>
    this.users().find((user) => user.userCode === this.#userCode())
  );
  public readonly isAdmin = computed(
    () => this.currentUser()?.isAdmin ?? false
  );

  public setUserCode(code: string): void {
    this.#userCode.set(code);
  }

  public getUsers(): Observable<HttpResponse<User[]>> {
    return this.#apiService.getUsers(this.#userCode()).pipe(
      tap((result) => {
        if (result?.body) {
          this.#users.set(result.body);
        }
      })
    );
  }

  public drawNames(): Observable<HttpResponse<string>> {
    return this.#apiService.drawNames(this.#userCode()).pipe(
      tap(({ status }) => {
        if (status === 200) {
          this.#roomService.getRoomByUserCode(this.#userCode());
          this.getUsers().subscribe();
          this.#toasterService.show(
            ToastMessage.SuccessDrawNames,
            MessageType.Success
          );
        }
      })
    );
  }

  public deleteUser(userId: number): Observable<HttpResponse<any>> {
    const adminUserCode = this.#userCode();

    if (!adminUserCode) {
      return new Observable((subscriber) => {
        subscriber.error(
          new HttpResponse({
            status: 401,
            statusText: 'Admin user code is missing',
          })
        );
      });
    }

    return this.#apiService.deleteUser(userId, adminUserCode).pipe(
      tap((response) => {
        if (response.status === 200 || response.status === 204) {
          this.#toasterService.show(
            ToastMessage.SuccessDeleteUser,
            MessageType.Success
          );

          this.getUsers().pipe(take(1)).subscribe();
        }
      })
    );
  }
}
