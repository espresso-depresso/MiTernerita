import { Injectable, inject } from '@angular/core';
import { of, Observable, delay } from 'rxjs';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class PaymentsMockService {
  private storage = inject(StorageService);

  getAllPayments(): Observable<any[]> {
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    return of(payments).pipe(delay(300));
  }

  createPayment(data: any): Observable<any> {
    // data may be FormData or object
    const raw = this.formDataToObject(data);
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    const newId = (this.storage.get<number>(this.storage.STORAGE_KEYS.PAYMENT_COUNTER) || 1);
    const newPayment = {
      idPayments: newId,
      date: new Date().toISOString().split('T')[0],
      time: new Date().toTimeString().split(' ')[0],
      idUser: raw.idUser ? Number(raw.idUser) : null,
      idEvents: raw.idEvents ? Number(raw.idEvents) : null,
      totalGeneral: raw.totalGeneral ? Number(raw.totalGeneral) : null,
      tasaDolar: raw.tasaDolar ? Number(raw.tasaDolar) : null,
      montoDolar: raw.montoDolar ? Number(raw.montoDolar) : null,
      comprobante: null,
      banco: raw.banco || null,
      referencia: raw.referencia || null,
      fechaTransferencia: raw.fechaTransferencia || null,
      status: 0 // 0 = pending
    };

    payments.push(newPayment);
    this.storage.savePayments(payments);
    this.storage.save(this.storage.STORAGE_KEYS.PAYMENT_COUNTER, newId + 1);

    return of(newPayment).pipe(delay(300));
  }

  updatePayment(id: number, body: any): Observable<any> {
    const payments = this.storage.get<any[]>(this.storage.STORAGE_KEYS.PAYMENTS) || [];
    const idx = payments.findIndex(p => p.idPayments === id);
    if (idx === -1) return of(null).pipe(delay(200));
    payments[idx] = { ...payments[idx], ...body };
    this.storage.savePayments(payments);
    return of(payments[idx]).pipe(delay(200));
  }

  private formDataToObject(fd: any): any {
    if (!fd) return {};
    // If FormData, convert
    if (typeof fd.get === 'function' && typeof fd.entries === 'function') {
      const obj: any = {};
      for (const pair of fd.entries()) {
        const k = pair[0];
        const v = pair[1];
        if (k.endsWith('[]')) {
          const key = k.replace(/\[\]$/, '');
          // Ensure existing non-array value is converted to array
          if (!Array.isArray(obj[key])) {
            if (obj[key] === undefined) obj[key] = [];
            else obj[key] = [obj[key]];
          }
          obj[key].push(v);
        } else {
          // If an array was already created for this key (from [] entries), push into it
          if (Array.isArray(obj[k])) {
            obj[k].push(v);
          } else {
            obj[k] = v;
          }
        }
      }
      return obj;
    }
    return fd;
  }
}
