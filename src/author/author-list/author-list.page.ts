import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { AuthorEdit } from '../author-edit/author-edit';
import { AuthorService } from '../author.service';
import { Author } from '../model/Author';
import { Pageable } from '../../app/core/page/Pageable';
import { DialogConfirmation } from '../../app/core/dialog-confirmation/dialog-confirmation';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  imports: [MatButtonModule, MatIconModule, MatTableModule, CommonModule, MatPaginatorModule],
  standalone: true,
  selector: 'app-author-list',
  styleUrl: './author-list.page.css',
  templateUrl: './author-list.page.html',
})
export class AuthorListPage {
  pageNumber: number = 0;
  pageSize: number = 5;
  totalElements: number = 0;

  dataSource = new MatTableDataSource<Author>();
  displayedColumns: string[] = ['id', 'name', 'nationality', 'action'];

  protected readonly authorService = inject(AuthorService);
  protected readonly dialog = inject(MatDialog);


  ngOnInit() : void {
    this.loadPage();
  }

  loadPage(event?: PageEvent){
    const pageable: Pageable = {
      pageNumber: this.pageNumber,
      pageSize: this.pageSize,
      sort: [
        {
          property: 'id',
          direction: 'ASC',
        },
      ],
    };

    if (event != null) {
      pageable.pageSize = event.pageSize;
      pageable.pageNumber = event.pageIndex;
    }

    this.authorService.getAuthors(pageable).subscribe((data) => {
      this.dataSource.data = data.content;
      this.pageNumber = data.pageable.pageNumber;
      this.pageSize = data.pageable.pageSize;
      this.totalElements = data.totalElements;
    });
  }

  createAuthor() {
    const dialogRef = this.dialog.open(AuthorEdit, {
      data: {},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.loadPage();
    });
  }

  editAuthor(author: Author) {
    const dialogRef = this.dialog.open(AuthorEdit, {
      data: {author: author},
    });

    dialogRef.afterClosed().subscribe((result) => {
      this.ngOnInit();
    });
  }

  deleteAuthor(author: Author) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: {
        title: 'Eliminar autor',
        description: 'Atencion si borra el autor se perderan sus datos. <br> ¿Desea eliminar el autor? </br>',
      },
    });

    dialogRef.afterClosed().subscribe((result) => {
      if(result) {
        this.authorService.deleteAuthor(author.id).subscribe((result) => {
          this.ngOnInit();
        });
      }
    });
  }
}
