import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Toast {
  id: number;
  message: string;
  type: 'success' | 'error' | 'info' | 'warning';
  duration?: number;
  removing?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastsSubject = new BehaviorSubject<Toast[]>([]);
  toast$ = this.toastsSubject.asObservable();
  private counter = 0;

  constructor() {}

  show(message: string, type: Toast['type'] = 'info', duration = 3000) {
    const id = this.counter++;
    const toast: Toast = { id, message, type, duration };
    const current = this.toastsSubject.getValue();
    this.toastsSubject.next([...current, toast]);

    setTimeout(() => this.remove(id), duration);
  }

  remove(id: number) {
    const current = this.toastsSubject.getValue();
    const toastIndex = current.findIndex((t) => t.id === id);

    if (toastIndex !== -1) {
      const updatedToasts = current.map((toast) =>
        toast.id === id ? { ...toast, removing: true } : toast
      );
      this.toastsSubject.next(updatedToasts);

      setTimeout(() => {
        const finalToasts = this.toastsSubject.getValue();
        this.toastsSubject.next(finalToasts.filter((t) => t.id !== id));
      }, 300);
    }
  }
}
