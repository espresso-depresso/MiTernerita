import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { PaymentService } from '../../@core/services/payment.service';
import { environment } from '../../../environments/environment.developer';

@Component({
  selector: 'app-purchases',
  imports: [CommonModule],
  templateUrl: './purchases.component.html',
  styleUrl: './purchases.component.scss'
})
export class PurchasesComponent implements OnInit {
  private paymentService = inject(PaymentService);
  apiImg = environment.apiImg;
  purchases: any[] = [];
  user: any = null;

  ngOnInit(): void {
    this.user = JSON.parse(localStorage.getItem('user') || '{}');
    this.paymentService.getAllPayments().subscribe({
      next: (payments) => {
        this.purchases = (payments || []).filter((payment: any) => {
          const userId = Number(this.user?.id ?? this.user?.idUser ?? 0);
          const paymentUserId = Number(payment?.idUser?.id ?? payment?.idUser ?? payment?.idUserId ?? 0);
          return userId > 0 && paymentUserId > 0 && paymentUserId === userId;
        });
      }
    });
  }
}
