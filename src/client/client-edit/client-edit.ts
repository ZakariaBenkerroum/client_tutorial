import { Component, OnInit, inject, signal } from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import { Client } from '../client';
import { ClientService } from '../client.service';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';

@Component({
  imports: [FormsModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  standalone: true,
  selector: 'app-client-edit',
  styleUrl: './client-edit.css',
  templateUrl: './client-edit.html',
})
export class ClientEdit {
  protected readonly clientService = inject(ClientService);
  protected readonly dialogRef = inject(MatDialogRef<ClientEdit>)
  protected readonly data = inject(MAT_DIALOG_DATA) as {client: Client};
  
  protected readonly id = signal<number | null>(null);
  protected readonly name = signal<string | null>(null);

  ngOnInit(): void {
    this.loadFormData(this.data.client ?? null);
  }

  loadFormData(initialData: Client | null) : void{
    this.id.set(initialData?.id ?? null);
    this.name.set(initialData?.name ?? null);
  }

  onSave() {
    const id = this.id();
    const name = this.name();

    if (!name) {
      return;
    }

    const client = { id, name } as Client;

    this.clientService.saveClient(client).subscribe({
      next: () => {this.dialogRef.close(true)},
      error: (error) => { alert('El nombre ya existe');}
    });
  }
  
  onClose() {
    this.dialogRef.close();
  }
}
