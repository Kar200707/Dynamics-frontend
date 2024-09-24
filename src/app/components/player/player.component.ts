import {AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {MatIcon} from "@angular/material/icon";
import {PlayerControllerService} from "../../services/player-controller.service";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NavigationEnd, Router, RouterLink} from "@angular/router";
import {MatIconButton} from "@angular/material/button";
import {TimerBottomSheetComponent} from "../timer-bottom-sheet/timer-bottom-sheet.component";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {LoaderIosComponent} from "../../loaders/loader-ios/loader-ios.component";
import {environment} from "../../../environment/environment";
import {NgIf} from "@angular/common";
import {SearchListModel} from "../../../models/search_list.model";
import {updateMediaSessionMetadata} from "./media_session/media_session";
import {AudioCacheService} from "../../services/audio-cache.service";
import {audio} from "../../../main";

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
    RouterLink
  ],
  providers: [
    RequestService,
    AudioCacheService,
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent implements OnDestroy, OnInit {
  @ViewChild('seekBarContainer') seekBarContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgress') seekBarProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarContainerOpenPlayer') seekBarContainerOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgressOpenPlayer') seekBarProgressOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('videoElement', { static: false }) videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('main_block') mainBlock!: ElementRef<HTMLDivElement>;
  @ViewChild('image_track') image!: ElementRef<HTMLImageElement>;
  audio: HTMLAudioElement = audio;
  media: HTMLAudioElement | HTMLVideoElement = this.audio;
  token: string | null = localStorage.getItem('token');
  backgroundImage: string = '';
  isOpenedMobilePlayer: boolean = false;
  isLoaded: boolean = false;
  isPlaying: boolean = false;
  isSetFavorite: boolean = false;
  trackList: any;
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
  replay: boolean = false;
  trackAddedInFavorites: boolean = false;
  trackIndex:number = 0;
  startProgress:number = 0;
  isClickUp: boolean = true;
  currentTime: string = '--:--';
  endOfTrack: string = '--:--';
  isNextCalled: boolean = false;
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

  constructor(
    private requestService: RequestService,
    private router: Router,
    private audioCacheService: AudioCacheService,
    private playerController: PlayerControllerService) {
    this.playerController.timer$.subscribe((timer) => {
      if (!timer) {
        this.isOpenedTimerBottomSheet = false;
      }
    })

    document.addEventListener('touchmove', (event: TouchEvent) => {
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
    })

    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let routePath:string = event.urlAfterRedirects.split('/')[1];

        if (routePath != 'home') {
          this.isOpenedMobilePlayer = false;
          this.isOpenedMobilePlayerAnim = false;
        }
      }
    });

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
    this.playerController.playerInfo$.subscribe((list) => {
        if (this.audio_info.videoId !== list[this.trackIndex].videoId) {
          if (list && this.media) {
            this.type = 'audio';
            this.trackList = list;
            this.audio_info = list[this.trackIndex];
            updateMediaSessionMetadata(this.audio_info);
            this.load();
          }
        } else {
          if (list) {
            this.trackList = list;
          }
          this.openMobilePlayer();
        }
    });
  }

  ngOnInit() {
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => {this.play();});
      navigator.mediaSession.setActionHandler('pause', () => {this.pause();});
      navigator.mediaSession.setActionHandler('previoustrack', () => {this.prev();});
      navigator.mediaSession.setActionHandler('nexttrack', () => {this.next();});
      navigator.mediaSession.setActionHandler('seekto', details => this.seekTo(details.seekTime!));
    }
    this.media.addEventListener('ended', () => {
      this.isClickUp = true;
      this.touchStart = false;
      if (this.replay) {
        this.media.currentTime = 0;
        this.play();
      } else {
        this.next();
      }
    });
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

  getFormattedViews(views: number): string {
    if (views >= 1_000 && views < 1_000_000) {
      return (views / 1_000).toFixed(1) + 'k listeners';
    } else if (views >= 1_000_000 && views < 1_000_000_000) {
      return (views / 1_000_000).toFixed(1) + 'M listeners';
    } else if (views >= 1_000_000_000) {
      return (views / 1_000_000_000).toFixed(1) + 'B listeners';
    }
    return views + ' listeners';
  }

  onTouchStart(event: TouchEvent): void {
    this.touchStart = true;
    const touch = event.touches[0];
    this.startY = touch.clientY;
  }

  onTouchMove(event: TouchEvent): void {
    event.preventDefault();

    const touch = event.touches[0];
    const currentY = touch.clientY;
    this.currentY = currentY;

    if (currentY < this.startY) {
      this.moveLimit++;
      this.isDownTouch = false;
    } else if (currentY > this.startY) {
      this.isDownTouch = true;
      this.moveLimit--;
    }
  }

  onTouchEnd(event: TouchEvent): void {
    this.touchStart = false;
    this.touchLineCount = 0;
    if (this.moveLimit > 4) {
      this.openMobilePlayer();
    }
    if (this.moveLimit < -4 && this.currentY > innerHeight / 2.5) {
      this.closeMobilePlayer();
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
    this.pause();
    this.isLoaded = false;
    this.media.currentTime = 0;
    const cachedAudio = await this.audioCacheService.get(this.audio_info.videoId);

    // this.requestService.post<any>(environment.getAuthorIdByVideoId + this.audio_info.videoId, { })
    //   .subscribe(data => {
    //     this.authorId = data.authorId;
    //   })
    this.requestService.post<any>(environment.setPlayHistory, {
      access_token: this.token,
      trackId: this.audio_info.videoId
    }).subscribe()
    this.updateSeekBarOpenPlayer();
    this.updateSeekBar();

    if (cachedAudio && this.type === 'audio') {
      this.media.src = URL.createObjectURL(cachedAudio);
      this.media.load();
    } else {
      const query: string = `?type=${this.type}&quality=highestaudio`
      this.media.src = environment.getStream + this.audio_info.videoId + query;
      this.media.load();
      this.fetchAndCacheAudio(this.audio_info.videoId);
    }
    this.getIsFavorite(this.audio_info.videoId);
    this.media.onerror = (e) => {
      this.isLoaded = false;
    }

    this.media.addEventListener('loadedmetadata', () => {
      this.audio_info = this.trackList[this.trackIndex];
      this.isLoaded = true;
      this.currentTime = '00:00';
      if (!isNaN(this.media.duration) && !isNaN(this.media.currentTime)) {
        this.endOfTrack = this.formatTime(this.media.duration - this.media.currentTime);
      }
      this.play();
    });
    this.media.addEventListener('timeupdate', () => {
      if (!isNaN(this.media.duration) && !isNaN(this.media.currentTime)) {
        this.updateSeekBar();
        this.updateSeekBarOpenPlayer();

        const remainingTime = this.media.duration - this.media.currentTime;

        this.currentTime = this.formatTime(this.media.currentTime);
        this.endOfTrack = this.formatTime(remainingTime);
      } else {
        this.currentTime = '--:--';
        this.endOfTrack = '--:--';
      }
    });
    this.playerController.setBackground(this.audio_info.image);

    this.audio_info.duration = {
        seconds: 0,
        timestamp: '--:--'
    }
  }

  play() {
    if (this.isLoaded) {
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

  playPause() {
    if (this.isLoaded) {
      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    }
  }

  seekMove(e: any, type: string) {
    if (this.seekBarContainer && !this.isClickUp && this.isLoaded) {
      const seekBarRect = this.seekBarContainer.nativeElement.getBoundingClientRect();
      let offsetX: number;

      if (type === 'touch') {
        offsetX = e.changedTouches[0].clientX - seekBarRect.left;
      } else {
        offsetX = e.clientX - seekBarRect.left;
      }

      const progress = Math.max(0, Math.min(offsetX / seekBarRect.width, 1));

      if (isFinite(this.media.duration)) {
        this.media.currentTime = progress * this.media.duration;
        this.updateSeekBar();
      }
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
    } else  {
      this.trackIndex = 0;
      this.pause();
      this.audio_info = this.trackList[this.trackIndex];
      this.playerController.setTrackId(this.audio_info.videoId);
      this.load();
    }
    updateMediaSessionMetadata(this.audio_info);
  }

  prev() {
    this.type = 'audio';
    this.endOfTrack = '00:00';
    if (this.trackIndex != 0) {
      this.pause();
      this.trackIndex--
      this.playerController.setTrackId(this.audio_info.videoId);
      this.audio_info = this.trackList[this.trackIndex];
      this.load();
    } else {
      this.pause();
      this.trackIndex = this.trackList.length - 1;
      this.playerController.setTrackId(this.audio_info.videoId);
      this.audio_info = this.trackList[this.trackIndex];
      this.load();
    }
    updateMediaSessionMetadata(this.audio_info);
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  openMobilePlayer() {
    if (innerWidth < 500 && !this.isOpenedMobilePlayer) {
      this.playerController.setIsOpenedPlayer(true);
      this.isOpenedMobilePlayer = true;
      this.isOpenedMobilePlayerAnim = true;
    }
  }

  closeMobilePlayer() {
    setTimeout(() => {
      this.isOpenedTimerBottomSheet = false;
      this.playerController.setIsOpenedPlayer(false);
      if (innerWidth < 500) {
        this.isOpenedMobilePlayer = false;
        setTimeout(() => {
          this.isOpenedMobilePlayerAnim = false;
        }, 50)
      }
    })
  }

  replayOnOff() {
    this.replay = !this.replay;
  }

  setFavorite() {
    if (this.isLoaded) {
      if (!this.isSetFavorite) {
        this.isSetFavorite = true;
        this.requestService.post<any>(environment.addFavorite, { access_token: this.token, trackId: this.audio_info.videoId })
          .subscribe(() => {
            this.trackAddedInFavorites = true;
            setTimeout(() => {
              this.trackAddedInFavorites = false;}, 2000)
          })
      } else {
        this.requestService.post<any>(environment.remFavorite,
          {
            access_token: this.token,
            trackId: this.audio_info.videoId
          }).subscribe(() => {
          this.isSetFavorite = false;
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

  share() {
    const shareData = {
      title: 'Dynamics ' + this.audio_info.title,
      text: this.audio_info.author.name,
      url: "https://dynamics-9080b.web.app/home",
    };

    navigator.share(shareData);
  }

  openTimerBottomSheet() {
    this.isOpenedTimerBottomSheet = !this.isOpenedTimerBottomSheet;
  }

  async fetchAndCacheAudio(audioId: string) {
    try {
      const response = await fetch(environment.getStream + audioId + '?type=audio&quality=highestaudio');
      const audioBlob = await response.blob();

      if (this.audio_info && this.audio_info.videoId && this.audio_info.videoId === audioId) {
        await this.audioCacheService.set(audioId, audioBlob);
      } else {
        console.error('Invalid audio_info or videoId.');
      }
    } catch (error) {
      console.error('Error caching audio:', error);
    }
  }

  protected readonly innerHeight = innerHeight;
}
