import { CommonModule } from '@angular/common';
import { Component, inject, OnDestroy } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { SelectModule } from 'primeng/select';
import { DrinksService } from '../../../../@core/services/drinks.service';
import { MessageService } from 'primeng/api';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { FormDrink } from '../../../../@core/models/forms/form-drink';

@Component({
  selector: 'app-create-drinks',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    InputText,
    ButtonModule,
    SelectModule,
    FormsModule
  ],
  templateUrl: './create-drinks.component.html',
  styleUrl: './create-drinks.component.scss'
})
export class CreateDrinksComponent implements OnDestroy{
  private drinksService = inject(DrinksService);
  private messageService = inject(MessageService);
  private dialogRef = inject(DynamicDialogRef);
  private fb = inject(FormBuilder);
  previewUrl: string | null = null;
  
  drinksForm: FormGroup<FormDrink> = this.fb.group({
    description: new FormControl<string>('', { nonNullable: true }),
    price: new FormControl<number | null>(null),
    status: new FormControl<number | null>(1, { nonNullable: true }),
    image: new FormControl<File | null>(null)
  })

  onFileSelect(event: any) {
  const file = event.target.files && event.target.files.length > 0 ? event.target.files[0] : null;
  this.drinksForm.get('image')?.setValue(file);

  // limpiar preview anterior
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }

    if (file instanceof File) {
      // Crear URL temporal para preview
      this.previewUrl = URL.createObjectURL(file);
    }
}

  removeSelectedFile() {
    // limpiar control y preview
    this.drinksForm.get('image')?.setValue(null);
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

    ngOnDestroy(): void {
    if (this.previewUrl) {
      URL.revokeObjectURL(this.previewUrl);
      this.previewUrl = null;
    }
  }

onSubmit() {
  const fv = { ...this.drinksForm.value };
  const fd = new FormData();

  Object.entries(fv).forEach(([k, v]) => {
    if (v instanceof File) {
      fd.append(k, v);
      return; 
    }

    if (typeof v === 'string') {
      if (v.trim() !== '') {
        fd.append(k, v);
      }
      return;
    }

    if (typeof v === 'number') {
      fd.append(k, v.toString());
      return;
    }

    if (Object.prototype.toString.call(v) === '[object Date]') {
      fd.append(k, (v as unknown as Date).toISOString());
      return;
    }

    if (v !== null && v !== undefined) {
      fd.append(k, String(v));
    }
  });

  for (const pair of fd.entries()) {
    console.log(pair[0], pair[1]);
  }

  this.drinksService.createDrink(fd).subscribe({
    next: () => {
      this.messageService.add({
        severity: 'success',
        summary: 'Éxito',
        detail: 'Bebida creada correctamente'
      });
      this.dialogRef.close(true);
    },
    error: (error) => {
      this.messageService.add({
        severity: 'error',
        summary: 'Error',
        detail: 'Hubo un problema al crear la bebida'
      });
      console.error('Error al crear la bebida:', error);
    }
  });
}
}
