import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {environment} from "../../../environment/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SearchListModel} from "../../../models/search_list.model";
import {PlayerControllerService} from "../../services/player-controller.service";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatButton,
    HttpClientModule
  ],
  providers: [
    RequestService
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;

  search: SearchListModel[] = []

  constructor(
    private playerController: PlayerControllerService,
    private reqServ: RequestService) {  }

  setSearchHistory(search: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = search;
    }
  }

  searchTrackList(value: string) {
    console.log(value);
    this.reqServ.post<SearchListModel[]>(environment.searchTracksList, { searchText: value })
    .subscribe((data: SearchListModel[]) => {
      console.log(data)
      this.search = data;
    })
  }

  setTrack(id: string, index: number) {
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.search);
  }
}
