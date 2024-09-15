import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
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
export class SearchComponent implements OnInit {
  @ViewChild('searchInput') searchInput!: ElementRef<HTMLInputElement>;
  searchTimeOut: any;
  private searchSubject: Subject<any> = new Subject<string>();
  token: string | null = localStorage.getItem('token');
  isLoaded: boolean = false;
  search: SearchListModel[] = [];
  searchHistory:any = [];
  searchText: string = '';

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

  ngOnInit() {
    this.getSearchHistory();
  }

  getSearchHistory() {
    this.reqServ.post<any>(environment.getSearchHistory, { access_token: this.token })
      .subscribe((history) => {
        this.searchHistory = history;
      })
  }

  setSearchHistory(search: string) {
    if (this.searchInput) {
      this.searchInput.nativeElement.value = search;
      this.searchTrackList(search);
    }
  }

  searchTrackList(value: string) {
    if (value === '') {
      this.getSearchHistory();
    }
    if (value.trim()) {
      this.searchSubject.next(value);
      this.searchText = value;
    } else {
      this.isLoaded = false;
      this.search = [];
    }
  }

  setTrack(id: string, index: number) {
    this.reqServ.post<any>(environment.setSearchHistory, { access_token: this.token, text: this.searchText })
      .subscribe(() => {})
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(this.search);
  }
}
