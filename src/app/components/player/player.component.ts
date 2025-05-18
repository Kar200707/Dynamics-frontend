import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  inject,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {PlayerControllerService} from "../../services/player-controller.service";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {ActivatedRoute, NavigationEnd, Router, RouterLink} from "@angular/router";
import {MatButton, MatIconButton} from "@angular/material/button";
import {TimerBottomSheetComponent} from "../timer-bottom-sheet/timer-bottom-sheet.component";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {environment, host} from "../../../environment/environment";
import {NgIf} from "@angular/common";
import {SearchListModel} from "../../../models/search_list.model";
import {updateMediaSessionMetadata} from "./media_session/media_session";
import {AudioCacheService} from "../../services/audio-cache.service";
import { audio, audio2 } from "../../../main";
import {Haptics, ImpactStyle} from "@capacitor/haptics";
import {PlayerKeyboardPluginService} from "./player_functions/player-keyboard-plugin.service";
import {ImageDominantColorService} from "./player_functions/image-dominat-color.service";
import {filter} from "rxjs";
import {Meta, Title} from "@angular/platform-browser";
import {Capacitor} from "@capacitor/core";
import { CarAudio } from '@justicointeractive/capacitor-car-audio';
import {MorePlaylistComponent} from "../bottom-sheets/more-playlist/more-playlist.component";
import {MatBottomSheet} from "@angular/material/bottom-sheet";
import {AddTrackInPlaylistsComponent} from "../bottom-sheets/add-track-in-playlists/add-track-in-playlists.component";


@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    MatIcon,
    ResizeHeightDirective,
    MatIconButton,
    TimerBottomSheetComponent,
    HttpClientModule,
    LoaderIosComponent,
    NgIf,
    RouterLink,
    MatButton
  ],
  providers: [
    RequestService,
    AudioCacheService,
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnDestroy, OnInit, AfterViewInit {
  @ViewChild('seekBarContainer') seekBarContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgress') seekBarProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarContainerOpenPlayer') seekBarContainerOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgressOpenPlayer') seekBarProgressOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('recTracksBlock') recTracksBlock!: ElementRef<HTMLDivElement>;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('main_block') mainBlock!: ElementRef<HTMLDivElement>;
  @ViewChild('image_track') image!: ElementRef<HTMLImageElement>;
  private _bottomSheetAddToPlaylists = inject(MatBottomSheet);
  audio: HTMLAudioElement = audio;
  audio2: HTMLAudioElement = audio2;
  media: HTMLAudioElement | HTMLVideoElement = this.audio;
  token: string | null = localStorage.getItem('token');
  backgroundImage: string = '';
  isOpenedMobilePlayer: boolean = false;
  isLoaded: boolean = false;
  isPlaying: boolean = false;
  isSetFavorite: boolean = false;
  trackList: any;
  scrollTop:number = 0;
  type: 'audio' | 'video' = 'audio';
  trackThemeColor!: string;
  isOpenedTimerBottomSheet: boolean = false;
  startY = 0;
  moveLimit: number = 0;
  touchLineCount:number = 0;
  currentY: number = 0;
  isOpenedMobilePlayerAnim : boolean = false;
  isDownTouch: boolean = false;
  touchStart: boolean = false;
  touchClinetY: number = 0;
  isOpenedDescription:boolean = false;
  replay: boolean = false;
  infoTopBlockIsOpened: boolean = false;
  info: string = '';
  trackIndex:number = 0;
  startProgress:number = 0;
  isClickUp: boolean = true;
  playerImageDominatColor!: string;
  playerImageDominatColor2!: string;
  currentTime: string = '--:--';
  endOfTrack: string = '--:--';
  isNextCalled: boolean = false;
  playlistName: string = '';
  audio_recommended_list: any = [0];
  seekCircleShow: boolean = false;
  seekCircleTimeOut: any;
  views!: number | null;
  likes!: number | null;
  description!: string | null;
  audio_info: SearchListModel = {
    duration: {
      seconds: 0,
      timestamp: '--:--'
    },
    author: {
      name: '--',
      url: ''
    },
    views: 0,
    image: '',
    title: '--',
    videoId: ''
  };
  loadArray = [
    1,
    2,
    3,
    5,
    6,
    7,
    8,
    9,
    10,
  ]

  constructor(
    private meta: Meta,
    private titleService: Title,
    private cdr: ChangeDetectorRef,
    private requestService: RequestService,
    private router: Router,
    private route: ActivatedRoute,
    private imgDominatColorService: ImageDominantColorService,
    private playerKeyBoardPlugin: PlayerKeyboardPluginService,
    private audioCacheService: AudioCacheService,
    private activeRoute: ActivatedRoute,
    private playerController: PlayerControllerService) {

    this.playerController.timer$.subscribe((timer) => {
      if (!timer) {
        this.isOpenedTimerBottomSheet = false;
      }
    })

    document.addEventListener('touchmove', (event: TouchEvent) => {
      if (this.scrollTop === 0 && innerWidth < 850) {
        if (this.touchStart && this.mainBlock.nativeElement && this.isOpenedMobilePlayer && this.moveLimit > 4 || this.moveLimit < -4) {
          const touch = event.touches[0];
          const currentY = touch.clientY;
          this.isOpenedTimerBottomSheet = false;
          if (innerHeight - currentY + 70 > 0 && innerHeight - currentY + 70 < innerHeight) {
            this.touchClinetY = currentY;
            if (this.touchStart) {
              this.mainBlock.nativeElement.style.transition = 'unset';
            } else {
              this.mainBlock.nativeElement.style.transition = '.23s cubic-bezier(0.6, 0.03, 0.2, 1)';
            }
            if (this.isOpenedMobilePlayer) {
              if (this.moveLimit < 0) {
                if ((currentY - this.startY) > 0 && (currentY - this.startY) < innerHeight && innerHeight - currentY > 50) {
                  this.touchLineCount = currentY - this.startY;
                }
                this.mainBlock.nativeElement.style.height = innerHeight - this.touchLineCount + 'px';
              }
            }
          }
        }
      }
    })

    this.playerController.backgroundUrl$.subscribe(bgUrl => {
      if (bgUrl) {
        this.backgroundImage = bgUrl;
      }
    })
    window.addEventListener('mouseup', () => {
      this.isClickUp = true;
    })
    window.addEventListener('touchend', () => {
      this.isClickUp = true;
    })
    playerController.trackIndex$.subscribe(index => {
      this.trackIndex = index;
    })
    this.playerController.playerInfo$.subscribe((item) => {
      if (item?.list?.[this.trackIndex]) {
        this.playlistName = item.name;
        if (this.audio_info.videoId !== item.list[this.trackIndex].videoId) {
          if (item.list && this.media) {
            this.type = 'audio';
            this.trackList = item.list;
            this.audio_info = item.list[this.trackIndex];
            updateMediaSessionMetadata(this.audio_info, titleService);
            this.load();
            this.getPlayerInfo();
          }
        } else {
          if (item.list) {
            this.trackList = item.list;
          }
          this.openMobilePlayer();
          this.play();
        }
      }
    });
  }

  ngOnInit() {
    this.media.addEventListener("playing", () => {
      this.setMediaController();
    })

    this.route.queryParams.subscribe(params => {
      if (params['play'] && !this.isPlaying) {
        this.audio_info.videoId = params['play'];
        this.getPlayerInfo('onInit');
        this.isPlaying = true;
      }
    });
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case 'ArrowLeft': this.previous_10s(); break;
        case 'ArrowRight': this.next_10s(); break;
      }
      // if (e.code === 'Space') {
      //   e.preventDefault();
      // }
      // if (e.code === "Space") {
      //     this.playPause();
      // }
    })
   this.setMediaController();

    this.media.addEventListener('ended', () => {
      this.isClickUp = true;
      this.touchStart = false;
      setTimeout(() => {
        if (this.replay) {
          this.media.currentTime = 0;
          this.play();
        } else {
          this.pause();
          this.next();
        }
      }, 0);
    });
  }

  setMediaController() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {this.play(); this.cdr.detectChanges();});
      navigator.mediaSession.setActionHandler('pause', () => {this.pause(); this.cdr.detectChanges();});
      navigator.mediaSession.setActionHandler('previoustrack', () => {this.prev(); this.cdr.detectChanges();});
      navigator.mediaSession.setActionHandler('nexttrack', () => {this.next(); this.cdr.detectChanges();});
      navigator.mediaSession.setActionHandler('seekto', details => this.seekTo(details.seekTime!));
    }
  }

  ngAfterViewInit() {
    this.cdr.detectChanges();
  }

  ngOnDestroy() {
    this.isLoaded = false;
    this.trackIndex = 0;
    this.trackList = null;
    if (this.media) {
      this.media.pause();
      this.media.currentTime = 0;
      this.media.src = '';
      this.media.load();
      this.media.remove();
    }
  }

  updateRouteParam(id: string) {
    // this.route.queryParams.subscribe(params => {
    //   if (!params['play'] || params['play'] !== this.audio_info.videoId) {
    //     this.router.navigate([], {
    //       queryParams: { play: id },
    //       queryParamsHandling: 'merge',
    //     });
    //   }
    // });
  }

  getFormattedInt(int: number, text: string): string {
    if (int >= 1_000 && int < 1_000_000) {
      return (int / 1_000).toFixed(1) + 'k ' + text;
    } else if (int >= 1_000_000 && int < 1_000_000_000) {
      return (int / 1_000_000).toFixed(1) + 'M ' + text;
    } else if (int >= 1_000_000_000) {
      return (int / 1_000_000_000).toFixed(1) + 'B ' + text;
    }
    return int + ' ' + text;
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStart = true;
    const touch = event.touches[0];
    this.startY = touch.clientY;
  }

  onTouchMove(event: TouchEvent): void {
    const touch = event.touches[0];
    const currentY = touch.clientY;
    this.currentY = currentY;

    if (currentY < this.startY) {
      this.moveLimit++;
      this.isDownTouch = false;
    } else if (currentY > this.startY) {
      this.isDownTouch = true;
      if (this.scrollTop === 0) {
        event.preventDefault();
      }
      this.moveLimit--;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchStart = false;
    this.touchLineCount = 0;
    if (this.moveLimit > 4) {
      this.openMobilePlayer();
    }
    if (this.scrollTop === 0) {
      if (this.moveLimit < -4 && this.currentY > innerHeight / 2.5) {
        this.closeMobilePlayer();
      }
    }

    this.moveLimit = 0;
    if (this.isOpenedMobilePlayer) {
      if (innerHeight / 2 > (this.currentY - this.startY)) {
        this.openMobilePlayer();
        this.mainBlock.nativeElement.style.height = innerHeight + 'px';
      }
    }
    this.moveLimit = 0;
  }

  getIsFavorite(trackId: string) {
    this.requestService.post<any>(environment.getIsFavoriteTrack, { trackId: trackId, access_token: this.token })
      .subscribe(data => {
        this.isSetFavorite = data.isFavorite;
      })
  }

  seekTo(time: number | undefined) {
    if (time) {
      if (!isNaN(this.media.duration) && !isNaN(this.media.currentTime)) {
        this.media.currentTime = time;
        this.updateSeekBar();
        this.updateSeekBarOpenPlayer();

        const remainingTime = this.media.duration - this.media.currentTime;

        this.currentTime = this.formatTime(this.media.currentTime);
        this.endOfTrack = this.formatTime(remainingTime);
      } else {
        this.currentTime = '--:--';
        this.endOfTrack = '--:--';
      }
    }
  }

  getPlayerInfo(call?: string) {
    this.audio_recommended_list = [0];
    this.views = null;
    this.likes = null;
    this.description = null;
    this.requestService.post<any>(environment.getPlayerInfoByVideoId, { access_token: this.token, trackId: this.audio_info.videoId })
      .subscribe((data) => {
        this.audio_info = data;
        if (call === 'onInit') {
          this.trackIndex = 0;
          this.type = 'audio';
          this.trackList = [this.audio_info];
          this.audio_info = this.trackList[this.trackIndex];
          updateMediaSessionMetadata(this.audio_info, this.titleService);
          this.load();
          this.getPlayerInfo();
        }
        this.audio_recommended_list = data.recTracks;
        this.views = data.views;
        this.likes = data.likes;
        this.description = data.description;
        if (this.recTracksBlock?.nativeElement) {
          this.recTracksBlock.nativeElement.scrollLeft = 0;
        }
      })
  }

  async openSheetAddToPlaylists() {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Medium});
    }
    const bottomSheetRef = this._bottomSheetAddToPlaylists.open(AddTrackInPlaylistsComponent, {
      panelClass: "bottom-sheet",
      data: this.audio_info,
    });

    bottomSheetRef.afterDismissed().subscribe(() => { });
  }

  async getImageColor() {
    const colorsArray: string[] = await this.imgDominatColorService.getDominantColors(host + 'media/cropImage?url=' + this.audio_info.image);
    this.playerImageDominatColor = colorsArray[0];
    this.playerImageDominatColor2 = colorsArray[1];
    this.cdr.detectChanges();
  }

  setAudioOrVideo() {
    const currentTime = this.media.currentTime;
    this.pause();
    if (this.type === 'audio') {
      this.type = 'video'
      this.media = this.videoElement.nativeElement;
    } else {
      this.type = 'audio';
      this.media = this.audio;
    }
    this.load();
  }

  async load() {
    this.playerImageDominatColor = 'rgb(36 36 36)';
    this.playerImageDominatColor2 = 'rgb(36 36 36)';
    this.cdr.detectChanges();

    this.pause();
    this.isLoaded = false;
    this.media.currentTime = 0;

    this.updateSeekBarOpenPlayer();
    this.updateSeekBar();

    setTimeout(() => this.getImageColor(), 0);

    const cachedAudio = await this.audioCacheService.get(this.audio_info.videoId);

    if (cachedAudio && this.type === 'audio') {
      this.media.src = URL.createObjectURL(cachedAudio);
      this.media.load();
      this.media.addEventListener('error', () => {
        this.audioCacheService.remove(this.audio_info.videoId);
        this.showError('Audio Listening Error 2');
      });
      this.sendToHistory();
    } else {
      this.requestService.get<any>(
        `https://api.vidfly.ai/api/media/youtube/download?url=https://www.youtube.com/watch?v=${this.audio_info.videoId}`
      ).subscribe((info) => {
        const items = info.data.items;
        const audioItems = items.filter((item: any) => item.type === "video_with_audio");
        const bestAudio = audioItems.reduce((prev: any, curr: any) => {
          const prevRate = parseInt(prev.label.match(/\d+/)?.[0] || '0');
          const currRate = parseInt(curr.label.match(/\d+/)?.[0] || '0');
          return currRate > prevRate ? curr : prev;
        });

        if (bestAudio && bestAudio.url) {
          this.media.src = bestAudio.url;
          this.media.load();
          this.media.oncanplay = null;

          this.media.oncanplay = () => {
            if (this.isLoaded) {
              this.media.play().catch(err => {
                console.warn('play() failed:', err);
              });
            }
          };

          // this.fetchAndCacheAudio(this.audio_info.videoId, 0);

          // CarPlay
          if (Capacitor.isNativePlatform()) {
            CarAudio.setRoot({ url: this.media.src })
              .then(() => console.log('CarPlay ready'))
              .catch(err => console.error('CarPlay error', err));
          }
        } else {
          this.showError('Audio not found');
        }
      });

      this.media.addEventListener('error', () => {
        this.showError('Audio Listening Error 1');
      });

      this.sendToHistory();
    }

    this.getIsFavorite(this.audio_info.videoId);

    this.media.onerror = () => {
      this.isLoaded = false;
    }

    this.media.addEventListener('loadedmetadata', () => {
      this.audio_info = this.trackList[this.trackIndex];
      this.updateRouteParam(this.audio_info.videoId);
      this.setMetaTags();
      this.isLoaded = true;
      this.currentTime = '00:00';

      if (!isNaN(this.media.duration)) {
        this.endOfTrack = this.formatTime(this.media.duration - this.media.currentTime);
      }

      this.play();
    });

    this.media.addEventListener('timeupdate', () => {
      if (!isNaN(this.media.duration)) {
        const remainingTime = this.media.duration - this.media.currentTime;
        this.currentTime = this.formatTime(this.media.currentTime);
        this.endOfTrack = this.formatTime(remainingTime);
        this.updateSeekBar();
        this.updateSeekBarOpenPlayer();
      } else {
        this.currentTime = '--:--';
        this.endOfTrack = '--:--';
      }
    });

    this.playerController.setBackground(this.audio_info.image);
    this.audio_info.duration = {
      seconds: 0,
      timestamp: '--:--'
    };
  }

  private showError(message: string) {
    this.info = message;
    this.infoTopBlockIsOpened = true;
    this.playerController.addFavoriteTrack(this.audio_info);
    setTimeout(() => {
      this.info = '';
      this.infoTopBlockIsOpened = false;
    }, 4000);
  }

  private sendToHistory() {
    this.requestService.post<any>(environment.setPlayHistory, {
      access_token: this.token,
      trackId: this.audio_info.videoId
    }).subscribe();
  }


  play() {
    if (this.isLoaded) {
      this.media.volume = 1;
      this.playerController.onActPlayer('play');
      this.media.play()
      this.isPlaying = true;
      this.media.onerror = () => {
        console.error('Error loading audio.');
      };
    }
  }

  pause() {
    if (this.isLoaded) {
      this.isPlaying = false;
      this.playerController.onActPlayer('pause');
      this.media.pause();
    }
  }

  async playPause() {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Light});
    }
    if (this.isLoaded) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.titleService.setTitle(`${this.audio_info.title} - ${this.audio_info.author.name}`);
        this.play();
      }
    }
  }

  seekTrack(value: string) {
    this.pause();
    if (this.media && this.media.duration) {
      const numericValue = parseFloat(value);
      this.media.currentTime = (numericValue / 100) * this.media.duration;
    }
  }

  seekMoveOpenPlayer(e: any, type: string) {
    this.moveLimit = 0;
    this.isNextCalled = true;

    if (this.seekBarContainerOpenPlayer && !this.isClickUp) {
      const seekBarRect = this.seekBarContainerOpenPlayer.nativeElement.getBoundingClientRect();
      let offsetX: number;

      if (type === 'touch') {
        offsetX = e.changedTouches[0].clientX - seekBarRect.left;
      } else {
        offsetX = e.clientX - seekBarRect.left;
      }

      const progress = Math.max(0, Math.min(offsetX / seekBarRect.width, 1));

      if (this.startProgress === 0) {
        this.startProgress = this.media.currentTime / this.media.duration;
      }

      if (isFinite(this.media.duration)) {
        const newTime = (progress + this.startProgress - this.startProgress) * this.media.duration;

        this.media.currentTime = Math.max(0, Math.min(newTime, this.media.duration));
        setTimeout(async () => {
          const platform = Capacitor.getPlatform();

          if (platform !== 'web') {
            await Haptics.impact({style: ImpactStyle.Light});
          }
        }, 0);
        this.updateSeekBarOpenPlayer();
      }
    }
  }

  updateSeekBar() {
    if (this.seekBarProgress) {
      const progress = (this.media.currentTime / this.media.duration) * 100;
      this.seekBarProgress.nativeElement.style.width = `${progress}%`;
    }
  }

  updateSeekBarOpenPlayer() {
    if (this.seekBarProgressOpenPlayer) {
      const progress = (this.media.currentTime / this.media.duration) * 100;
      this.seekBarProgressOpenPlayer.nativeElement.style.width = `${progress}%`;
    }
  }

  next() {
    this.type = 'audio';
    this.isNextCalled = false;
    this.endOfTrack = '--:--';
    if (this.trackList.length - 1 > this.trackIndex) {
      this.pause();
      this.trackIndex++;
      this.audio_info = this.trackList[this.trackIndex];
      this.playerController.setTrackId(this.audio_info.videoId);
      this.load();
      this.getPlayerInfo();
    } else  {
      this.trackIndex = 0;
      this.pause();
      this.audio_info = this.trackList[this.trackIndex];
      this.playerController.setTrackId(this.audio_info.videoId);
      this.load();
      this.getPlayerInfo();
    }
    updateMediaSessionMetadata(this.audio_info, this.titleService);
  }

  prev() {
    this.type = 'audio';
    this.endOfTrack = '00:00';
    if (this.trackIndex != 0) {
      this.pause();
      this.trackIndex--
      this.audio_info = this.trackList[this.trackIndex];
      this.playerController.setTrackId(this.audio_info.videoId);
      this.load();
      this.getPlayerInfo();
    } else {
      this.pause();
      this.trackIndex = this.trackList.length - 1;
      this.audio_info = this.trackList[this.trackIndex];
      this.playerController.setTrackId(this.audio_info.videoId);
      this.load();
      this.getPlayerInfo();
    }
    updateMediaSessionMetadata(this.audio_info, this.titleService);
  }

  formatTime(seconds: number): string {
    const hours: number = Math.floor(seconds / 3600);
    const minutes: number = Math.floor((seconds % 3600) / 60);
    const secs: number = Math.floor(seconds % 60);

    if (hours > 0) {
      return `${hours}:${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
    }

    return `${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  openMobilePlayer() {
    if (this.audio_info.videoId !== '') {
      if (!this.isOpenedMobilePlayer) {
        this.playerController.setIsOpenedPlayer(true);
        this.isOpenedMobilePlayer = true;
        this.isOpenedMobilePlayerAnim = true;
      }
    }
  }

  closeMobilePlayer() {
    setTimeout(() => {
      this.isOpenedTimerBottomSheet = false;
      this.playerController.setIsOpenedPlayer(false);
      this.isOpenedMobilePlayer = false;
      setTimeout(() => {
        this.isOpenedMobilePlayerAnim = false;}, 50)
    })
  }

  async replayOnOff() {
    this.replay = !this.replay;
    if (this.replay) {
      const platform = Capacitor.getPlatform();

      if (platform !== 'web') {
        await Haptics.impact({style: ImpactStyle.Heavy});
      }
    }
  }

  async setFavorite() {
    if (this.isLoaded) {
      if (!this.isSetFavorite) {
        const platform = Capacitor.getPlatform();

        if (platform !== 'web') {
          await Haptics.impact({style: ImpactStyle.Heavy});
        }
        this.isSetFavorite = true;
        this.requestService.post<any>(environment.addFavorite, { access_token: this.token, trackId: this.audio_info.videoId })
          .subscribe(() => {
            this.info = 'Track added in favorites';
            this.infoTopBlockIsOpened = true;
            this.playerController.addFavoriteTrack(this.audio_info);
            setTimeout(() => {
              this.info = '';
              this.infoTopBlockIsOpened = false;}, 2000)
          })
      } else {
        this.requestService.post<any>(environment.remFavorite,
          {
            access_token: this.token,
            trackId: this.audio_info.videoId
          }).subscribe(() => {
          this.info = 'Track removed in favorites';
          this.infoTopBlockIsOpened = true;
          this.playerController.addFavoriteTrack(this.audio_info);
          setTimeout(() => {
            this.info = '';
            this.infoTopBlockIsOpened = false;}, 2000)
          this.isSetFavorite = false;
          this.playerController.addFavoriteTrack(this.audio_info);
        })
      }
    }
  }

  previous_10s() {
    if (this.isLoaded) {
      this.media.currentTime = this.media.currentTime - 10;
      this.updateSeekBarOpenPlayer();
    }
  }

  next_10s() {
    if (this.isLoaded) {
      this.media.currentTime = this.media.currentTime + 10;
      this.updateSeekBarOpenPlayer();
    }
  }

  setMetaTags() {
    this.meta.updateTag({ property: 'og:title', content: this.audio_info.title });
    this.meta.updateTag({ property: 'og:description', content: "Certainly! Here’s a suggested phrase for promoting music on Dynamics, focusing on being pleasant and free" });
    this.meta.updateTag({ property: 'og:image', content: host + 'media/cropImage?url=' + this.audio_info.image, });
    this.meta.updateTag({ property: 'og:url', content: "https://dynamics-9080b.web.app/home?play=" + this.audio_info.videoId });
  }

  async share() {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Heavy});
    }
    this.setMetaTags();
    const shareData = {
      title: 'Dynamics ' + this.audio_info.title,
      text: this.audio_info.author.name,
      url: "https://dynamics-9080b.web.app/home?play=" + this.audio_info.videoId,
    };

    navigator.share(shareData);
    // await Share.share({
    //     title: 'Dynamics ' + this.audio_info.title,
    //     text: this.audio_info.author.name,
    //     url: "https://dynamics-9080b.web.app/home",
    //     dialogTitle: "Dynamics " + this.audio_info.title,
    //   })
  }

  async openTimerBottomSheet() {
    const platform = Capacitor.getPlatform();

    if (platform !== 'web') {
      await Haptics.impact({style: ImpactStyle.Heavy});
    }
    this.isOpenedTimerBottomSheet = !this.isOpenedTimerBottomSheet;
  }

  async fetchAndCacheAudio(audioId: string, duration: number) {
    try {
      const response = await fetch(`${host}youtube-base/get-stream/${audioId}?type=audio&quality=highestaudio`);

      if (!response.ok) {
        return;
      }

      const audioBlob = await response.blob();

      if (this.audio_info && this.audio_info.videoId === audioId) {
        await this.audioCacheService.set(audioId, audioBlob, duration);
        console.log(`Audio cached successfully for videoId: ${audioId}`);
      } else {
        console.error('Invalid audio_info or mismatched videoId. Skipping caching.');
      }
    } catch (error) {
      console.error('Error fetching or caching audio:', error);
    }
  }

  trackBlockScroll(e: any) {
    const element = e.target;
    const scrollTop = element.scrollTop;

    if (scrollTop === 0) {
      this.scrollTop = 0;
    } else {
      this.scrollTop = 10;
    }
  }

  setTrack(id: string, index: number, list: any) {
    this.playerController.setTrackId(id);
    this.playerController.setTrackIndex(index);
    this.playerController.setList(list as any[], "");
  }

  protected readonly innerHeight = innerHeight;
  protected readonly innerWidth = innerWidth;
}
