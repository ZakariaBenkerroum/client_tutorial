import { Component, OnInit, inject } from '@angular/core';
import { MatIcon } from '@angular/material/icon';
import { Category } from '../model/category';
import { MatTableDataSource } from '@angular/material/table';
import {CommonModule} from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CategoryService } from '../category.service';
import { MatDialog } from '@angular/material/dialog';
import { CategoryEdit } from '../category-edit/category-edit';
import { DialogConfirmation } from '../../app/core/dialog-confirmation/dialog-confirmation';

@Component({
  imports: [MatIcon, 
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    CommonModule
  ],
  selector: 'app-category-list',
  styleUrl: './category-list.page.css',
  templateUrl: './category-list.page.html',
})
export class CategoryListPage implements OnInit {

  protected readonly categoryService = inject(CategoryService);
  protected readonly dialog = inject(MatDialog);


  dataSource = new MatTableDataSource<Category>();
  displayedColumns: string[] = ['id', 'name', 'action'];

  constructor() { }

  ngOnInit() : void{
      this.categoryService.getCategories().subscribe(
        categories => this.dataSource.data = categories
      );
  }

  createCategory() {
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: {}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.ngOnInit();
    })
  }

  editCategory(category: Category) {
    const dialogRef = this.dialog.open(CategoryEdit, {
      data: { category}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(!result) return;
      this.ngOnInit();
    });
  }

  deleteCategory(category : Category) {
    const dialogRef = this.dialog.open(DialogConfirmation, {
      data: { title : "Eliminar categoria", description: "Atención si borra la categoria se perderand sus datos. <br> ¿Deseas eliminar la categoria?" }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result) {
        this.categoryService.deleteCategory(category.id).subscribe(result => {
          this.ngOnInit();
        })
      }
    })
  }
}
