import {Component, ElementRef, ViewChild} from '@angular/core';
import {MatButton} from "@angular/material/button";
import {RequestService} from "../../services/request.service";
import {environment} from "../../../environment/environment";
import {HttpClient, HttpClientModule} from "@angular/common/http";
import {SearchListModel} from "../../../models/search_list.model";
import {PlayerControllerService} from "../../services/player-controller.service";
import {debounceTime, Subject, switchMap} from "rxjs";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [
    MatButton,
    HttpClientModule,
    LoaderIosComponent
  ],
  providers: [
    RequestService
  ],
  templateUrl: './search.component.html',
  styleUrl: './search.component.css'
})
export class SearchComponent {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchTimeOut: any;
  private searchSubject: Subject<any> = new Subject<string>();
  isLoaded: boolean = false;
  search: SearchListModel[] = []

  constructor(
    private playerController: PlayerControllerService,
    private reqServ: RequestService) {
    this.searchSubject.pipe(
      debounceTime(400),
      switchMap((value: string) => this.reqServ.post<SearchListModel[]>(environment.searchTracksList, { searchText: value }))
    ).subscribe((data: SearchListModel[]) => {
      this.search = data;
      console.log(data)
      this.isLoaded = true;
    });
  }

  setSearchHistory(search: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = search;
    }
  }

  searchTrackList(value: string) {
    if (value.trim()) {
      this.searchSubject.next(value);
    } else {
      this.isLoaded = false;
      this.search = [];
    }
  }

  setTrack(id: string, index: number) {
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.search);
  }
}
