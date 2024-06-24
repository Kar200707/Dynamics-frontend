import { Component } from '@angular/core';
import {ActivatedRoute} from "@angular/router";
import {TitleCasePipe, UpperCasePipe} from "@angular/common";

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    UpperCasePipe,
    TitleCasePipe
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.css'
})
export class CategoriesComponent {
  category: string = 'None';
  imgUrl!: string;
  gradient: string = '';

  constructor(private activatedRoute: ActivatedRoute) {
    activatedRoute.params.subscribe((p:any) => {
      this.category = p.type;
      this.imgUrl = `assets/images/categories/${p.type}.png`;
      if (p.type === 'rock') {
        this.gradient = 'linear-gradient(to top, #efbc3f, #d09607)';
      } else if (p.type === 'rap') {
        this.gradient = 'linear-gradient(to top, #75768a, #434459)';
      } else  if (p.type === 'jazz') {
        this.gradient = 'linear-gradient(to top, #35322d, #312817)';
      } else  if (p.type === 'hip-hop') {
        this.gradient = 'linear-gradient(to top, #1f1250, #4e067e)';
      }
    })
  }

  protected readonly innerWidth = innerWidth;
}
