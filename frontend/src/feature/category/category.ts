import { Component, DestroyRef, OnInit, signal } from '@angular/core';
import { SvgIcon } from "../../common/ui/svg-icon";
import { CategoryService } from './category.service';
import { take } from 'rxjs';
import { UiMenu, UiMenuItem } from "../../common/ui/menu";
import { Category as CategoryModel } from "../../common/interface/category/category";

@Component({
  imports: [SvgIcon, UiMenu],
  providers: [CategoryService],
  selector: 'app-category',
  styleUrl: './category.css',
  templateUrl: './category.html',
  host:{
    class: 'block h-full  overflow-auto w-full px-4 py-6 sm:px-6 lg:px-8 bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100'
  }
})
export class Category implements OnInit{

  categories = signal<CategoryModel[]>([]); 

  constructor(private categoryService: CategoryService,private destroyRef: DestroyRef) {}


  menuItems:UiMenuItem[] = [
    { 
      icon: '/icons/edit_fill.svg', 
      onClick: () => console.log('Edit clicked') , 
      text: 'Edit' 
    },
    { 
      icon: '/icons/delete_fill.svg', 
      onClick: () => console.log('Delete clicked') , 
      text: 'Delete' 
    },
  ];

  ngOnInit(): void {
    this.getCategories();
  }

  getCategories() {
    this.categoryService.getCategories()
    .pipe(take(1))
    .subscribe(response => {
      this.categories.set(response.data);
    });
    
  }
}
