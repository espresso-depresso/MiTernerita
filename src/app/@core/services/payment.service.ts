import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment.developer';
import { HttpClient } from '@angular/common/http';
import { catchError, from, map, Observable, of } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private api: string = environment.api;
  private http = inject(HttpClient);
  private storage = inject(StorageService);

  getAllPayments(): Observable<any[]> {
    return this.http.get<any[]>(`${this.api}/payment`).pipe(
      map((res: any[] = []) => this.normalizePayments(res)),
      catchError((error) => {
        console.error('Error al obtener los pagos:', error);
        return this.getPaymentsFromStorage();
      })
    );
  }

  createPayment(data: any): Observable<any> {
    return this.http.post<any>(`${this.api}/payment`, data).pipe(
      catchError(() => from(this.createPaymentLocally(data)))
    );
  }

  updatePayment(id: number, body: any): Observable<any> {
    return this.http.put<any>(`${this.api}/payment/${id}/status`, body).pipe(
      catchError(() => from(this.updatePaymentLocally(id, body)))
    );
  }

  private getPaymentsFromStorage(): Observable<any[]> {
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    return of(this.normalizePayments(payments));
  }

  private async createPaymentLocally(data: any): Promise<any> {
    const raw = this.formDataToObject(data);
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    const newId = (this.storage.get<number>(this.storage.STORAGE_KEYS.PAYMENT_COUNTER) || 1);
    const comprobante = await this.extractComprobante(data);
    const currentUser = this.getCurrentUser();
    const event = this.getEventById(raw.idEvents ? Number(raw.idEvents) : null);

    const payment = {
      idPayment: newId,
      idPayments: newId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      idUser: currentUser ? {
        id: currentUser.id,
        name: currentUser.name,
        lastName: currentUser.lastName,
        cedula: currentUser.cedula,
        email: currentUser.email,
        phone: currentUser.phone,
        role: currentUser.role,
      } : (raw.idUser ? Number(raw.idUser) : null),
      idEvents: event ? { ...event } : (raw.idEvents ? Number(raw.idEvents) : null),
      totalGeneral: raw.totalGeneral ? Number(raw.totalGeneral) : null,
      tasaDolar: raw.tasaDolar ? Number(raw.tasaDolar) : null,
      montoDolar: raw.montoDolar ? Number(raw.montoDolar) : null,
      comprobante,
      banco: raw.banco || null,
      referencia: raw.referencia || null,
      fechaTransferencia: raw.fechaTransferencia || null,
      status: 'Pendiente'
    };

    payments.push(payment);
    this.storage.savePayments(payments);
    this.storage.save(this.storage.STORAGE_KEYS.PAYMENT_COUNTER, newId + 1);

    return payment;
  }

  private async updatePaymentLocally(id: number, body: any): Promise<any> {
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    const index = payments.findIndex((payment: any) => Number(payment.idPayment ?? payment.idPayments) === Number(id));
    if (index === -1) {
      return null;
    }

    payments[index] = {
      ...payments[index],
      ...body,
      idPayment: payments[index].idPayment ?? payments[index].idPayments ?? id,
      idPayments: payments[index].idPayments ?? payments[index].idPayment ?? id,
      status: body?.status ?? payments[index].status ?? 'Pendiente'
    };

    this.storage.savePayments(payments);
    return payments[index];
  }

  private normalizePayments(payments: any[]): any[] {
    return (payments || []).slice().sort((a: any, b: any) => (Number(b.idPayment ?? b.idPayments ?? 0) - Number(a.idPayment ?? a.idPayments ?? 0))).map((payment: any) => ({
      ...payment,
      idPayment: payment.idPayment ?? payment.idPayments,
      idPayments: payment.idPayments ?? payment.idPayment,
      status: this.normalizeStatus(payment.status)
    }));
  }

  private normalizeStatus(status: any): string {
    if (status === 'Aprobado' || status === 'Rechazado' || status === 'Pendiente') {
      return status;
    }

    if (status === 1 || status === '1') {
      return 'Aprobado';
    }

    if (status === 2 || status === '2') {
      return 'Rechazado';
    }

    return 'Pendiente';
  }

  private async extractComprobante(data: any): Promise<string | null> {
    if (!data) return null;

    if (typeof data.get === 'function' && typeof data.entries === 'function') {
      const file = data.get('comprobante');
      if (file instanceof File) {
        return this.fileToDataUrl(file);
      }
      return null;
    }

    if (data.comprobante instanceof File) {
      return this.fileToDataUrl(data.comprobante);
    }

    if (typeof data.comprobante === 'string') {
      return data.comprobante;
    }

    return null;
  }

  private fileToDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(file);
    });
  }

  private formDataToObject(fd: any): any {
    if (!fd) return {};

    if (typeof fd.get === 'function' && typeof fd.entries === 'function') {
      const obj: any = {};
      for (const [key, value] of fd.entries()) {
        if (key.endsWith('[]')) {
          const cleanKey = key.replace(/\[\]$/, '');
          if (!Array.isArray(obj[cleanKey])) {
            obj[cleanKey] = [];
          }
          obj[cleanKey].push(value);
        } else {
          obj[key] = value;
        }
      }
      return obj;
    }

    return fd;
  }

  private getCurrentUser(): any {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) return null;
    try {
      return JSON.parse(storedUser);
    } catch {
      return null;
    }
  }

  private getEventById(idEvent: number | null): any {
    if (!idEvent) return null;
    const storedEvents = this.storage.get<any[]>(this.storage.STORAGE_KEYS.EVENTS) || [];
    return storedEvents.find((event: any) => Number(event.id) === Number(idEvent)) || null;
  }
}
