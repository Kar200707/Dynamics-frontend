import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatButton
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  search: { history: string }[] = [
    {
      history: 'search1'
    },
    {
      history: 'search2'
    },
    {
      history: 'search3'
    },
    {
      history: 'search4'
    },
    {
      history: 'search5'
    },
    {
      history: 'search6'
    },
    {
      history: 'search7'
    },
    {
      history: 'search8'
    },
    {
      history: 'search9'
    },
    {
      history: 'search10'
    },

  ]

  setSearchHistory(search: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = search;
    }
  }
}
