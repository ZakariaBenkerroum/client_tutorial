import { Component, inject, OnInit, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule, provideNativeDateAdapter } from '@angular/material/core';

import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { Game } from '../../game/model/game';
import { ClientService } from '../../client/client.service';
import { Client } from '../../client/client';
import { Loan } from '../model/Loan';
import { validateFields } from '../../app/core/helpers/validation.helper';
import { MatFormField, MatError, MatLabel } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatDatepickerInput, MatDatepickerToggle, MatDatepicker } from '@angular/material/datepicker';
import { MatAnchor } from '@angular/material/button';



@Component({
  imports: [MatFormField, 
    MatInput, 
    MatError, 
    MatLabel, 
    MatDatepickerInput, 
    MatDatepickerToggle, 
    MatDatepicker, 
    MatAnchor, 
    FormsModule, 
    ReactiveFormsModule,
    MatInputModule,
    MatSelectModule,
    MatButtonModule,
    MatNativeDateModule
  ],
  providers: [provideNativeDateAdapter()],
  standalone: true,
  selector: 'app-loan-edit',
  styleUrl: './loan-edit.css',
  templateUrl: './loan-edit.html',
})
export class LoanEdit implements OnInit{

  protected readonly id = signal<number | null>(null);
  protected readonly gameId = signal<number | null>(null);
  protected readonly clientId = signal<number | null>(null);

  protected readonly startDate = signal<Date | null>(null);
  protected readonly endDate = signal<Date | null>(null);

  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

  protected readonly dialogRef = inject(MatDialogRef<LoanEdit>);
  protected readonly data = inject(MAT_DIALOG_DATA);
  protected readonly loanService = inject(LoanService);
  protected readonly gameService = inject(GameService);
  protected readonly clientService = inject(ClientService);

  protected readonly errorMessage = signal<string | null>(null);
  protected readonly today = new Date();

  ngOnInit(): void {
    this.loadFormData(this.data.loan ?? null);
  }

  loadFormData(initialData: Loan | null): void {

    this.id.set(initialData?.id ?? null);

    this.startDate.set(initialData?.startDate ? new Date(initialData.startDate) : null);
    this.endDate.set(initialData?.endDate ? new Date(initialData.endDate) : null);

    this.gameService.getGames().subscribe((gamesList)  => {
      this.games.set(gamesList);
      this.gameId.set(initialData?.game?.id ?? null);
    });

    this.clientService.getClients().subscribe((clientsList) => {
      this.clients.set(clientsList);
      this.clientId.set(initialData?.client?.id ?? null);
    });

  }

  onSave() {
    this.errorMessage.set(null);

    const id = this.id();
    const gameId = this.gameId();
    const clientId = this.clientId();
    const startDate = this.startDate();
    const endDate = this.endDate();

    const requiredField = ["gameId", "clientId", "startDate", "endDate"] as const;
    const dataToValidate = { gameId, clientId, startDate, endDate};

    if(!validateFields(dataToValidate, requiredField)){
      return;
    }

    if (endDate! < startDate!){
      this.errorMessage.set("La fecha de fin no puede ser anterior a la fecha de inicio.");
      return;
    }

    // getTime() convert the date to ms pased from 1970.
    const diferenciaEnMilisegundos = endDate!.getTime() - startDate!.getTime();

    const diferenciaEnDias = diferenciaEnMilisegundos / (1000 * 60 * 60 * 24);

    if (diferenciaEnDias > 14) {
      this.errorMessage.set("EL periodo de préstamo máximo es de 14 dias.");
      return;
    }

    // we use find() because the backend's waiting for an object game/client
    // not only an id, so we use it to find a game/client in a list of games/clients
    const loan = {
      id,
      game: this.games().find(g => g.id === gameId) ?? null,
      client: this.clients().find(c => c.id === clientId) ?? null,
      startDate,
      endDate
    } as Loan;

    //next -> happy way
    // error -> sad way
    this.loanService.saveLoan(loan).subscribe({
      next: () => {
        this.dialogRef.close(true);
      },
      error: (err) => {
        const backendMessage = err.error?.message || "Error al guardar el prestamo"
        this.errorMessage.set(backendMessage);
      }
    });
  }

  onClose() {
    this.dialogRef.close();
  }
}
