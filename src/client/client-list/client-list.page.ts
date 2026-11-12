import { Component, inject, OnInit} from '@angular/core';
import { MatTable, MatCell } from '@angular/material/table';
import { MatTableDataSource } from '@angular/material/table';
import { Client } from '../client';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { ClientService } from '../client.service';
import { ClientEdit } from '../client-edit/client-edit';
import { MatDialog } from '@angular/material/dialog';
import { DialogConfirmation } from '../../app/core/dialog-confirmation/dialog-confirmation';

@Component({
  imports: [MatTable, MatCell, MatTableModule, MatIconModule, MatButtonModule, CommonModule],
  standalone: true,
  selector: 'app-client-list',
  styleUrl: './client-list.page.css',
  templateUrl: './client-list.page.html',
})
export class ClientListPage implements OnInit {

  protected readonly clientService = inject(ClientService);
  protected readonly dialog = inject(MatDialog);

  dataSource = new MatTableDataSource<Client>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor(clientService: ClientService) { }

  loadData() {
    this.clientService.getClients().subscribe(clients => this.dataSource.data = clients);

  }

  ngOnInit() {
    this.loadData();
  }

  createClient() {
    const dialogRef = this.dialog.open(ClientEdit, {data: {}});

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.ngOnInit();
    });
  }

  editClient(client: Client) {
    const dialogRef = this.dialog.open(ClientEdit, {data: { client }});

    dialogRef.afterClosed().subscribe(result => {
      if (!result) return;
      this.loadData();
    })
  }


  deleteClient(client: Client) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: "Eliminar cliente", description: `¿Está seguro que desea eliminar el cliente ${client.name}?`
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.clientService.deleteClient(client.id).subscribe(() => {  
          this.loadData();
        });
      }
    });
  }
}
