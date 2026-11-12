import { Component, OnInit, Inject, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { Pageable } from '../../app/core/page/Pageable';

import {LoanEdit} from '../loan-edit/loan-edit';
import { LoanService } from '../loan.service';
import { GameService } from '../../game/game.service';
import { ClientService } from '../../client/client.service';
import { Loan } from '../model/Loan';
import { LoanSearchDto } from '../LoanSearchDto';
import { Game } from '../../game/model/game';
import { Client } from '../../client/client';
import { MatTableModule } from '@angular/material/table';
import { CommonModule } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';

import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';


@Component({
  imports: [
    MatFormFieldModule, 
    MatInputModule,
    CommonModule,
    MatTableModule, 
    MatPaginatorModule, 
    FormsModule, 
    MatButtonModule, 
    MatSelectModule, 
    MatDatepickerModule, 
    MatNativeDateModule,
    MatIconModule
  ],
  standalone: true,
  selector: 'app-loan-list',
  styleUrl: './loan-list.page.css',
  templateUrl: './loan-list.page.html',
})
export class LoanListPage implements OnInit{

  protected readonly games = signal<Game[]>([]);
  protected readonly clients = signal<Client[]>([]);

  filterGame: number | null = null;
  filterClient: number | null = null;
  filterDate: Date | null = null;

  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Loan>();
  displayedColumns: string[] = ['id', 'game', 'client', 'startDate', 'endDate', 'action'];

  constructor(private loanService: LoanService, private gameService: GameService, private clientService:ClientService, public dialog: MatDialog){}

  ngOnInit(): void {
    this.gameService.getGames().subscribe((games) => this.games.set(games));
    this.clientService.getClients().subscribe((clients) => this.clients.set(clients));
    this.loadPage();
  }

  loadPage(event?: PageEvent): void {
    if (event != null){
      this.pageNumber = event.pageIndex;
      this.pageSize = event.pageSize;
    }

    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [{
        property: 'id',
        direction: 'ASC'
      }]
    };

    const searchDto: LoanSearchDto = {
      pageable: pageable,
      idGame: this.filterGame != null ? this.filterGame: undefined,
      idClient: this.filterClient != null ? this.filterClient: undefined,
      date: this.filterDate != null
        ? `${this.filterDate.getFullYear()}-${String(this.filterDate.getMonth() + 1).padStart(2, '0')}-${String(this.filterDate.getDate()).padStart(2, '0')}`
        : undefined
    };

    this.loanService.getLoans(searchDto).subscribe(data => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  onSearch(): void {
    this.pageNumber = 0;
    this.loadPage();
  }

  onCleanFilter() : void{
    this.filterGame = null;
    this.filterClient = null;
    this.filterDate = null;
    this.pageNumber = 0;
    this.loadPage();
  }

  createLoan(): void {
    const dialogRef = this.dialog.open(LoanEdit, {
      data:{},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(!result) return;
      this.onSearch();
    });
  }

  editLoan(loan: Loan): void {
    const dialogRef = this.dialog.open(LoanEdit, {
      data: { loan: loan},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(!result) return;
      this.onSearch();
    });
  }

}
