import {Component, ViewChild, ElementRef, Renderer2} from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { PlayerControllerService } from "../../services/player-controller.service";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NavigationEnd, Router} from "@angular/router";
import {ChangeMetaThemeColorService} from "../../services/change-meta-theme-color.service";
import {MatIconButton} from "@angular/material/button";
import {TimerBottomSheetComponent} from "../timer-bottom-sheet/timer-bottom-sheet.component";
import {skip} from "rxjs";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    MatIcon,
    ResizeHeightDirective,
    MatIconButton,
    TimerBottomSheetComponent
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @ViewChild('seekBarContainer') seekBarContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgress') seekBarProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarContainerOpenPlayer') seekBarContainerOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgressOpenPlayer') seekBarProgressOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('main_block') mainBlock!: ElementRef<HTMLDivElement>;
  audio: HTMLAudioElement = new Audio();
  backgroundImage: string = '';
  isOpenedMobilePlayer: boolean = false;
  isLoaded: boolean = false;
  isPlaying: boolean = false;
  isSetFavorite: boolean = false;
  trackList: any;
  trackThemeColor!: string;
  isOpenedTimerBottomSheet: boolean = false;
  startY = 0;
  moveLimit: number = 0;
  touchLineCount:number = 0;
  currentY: number = 0;
  isDownTouch: boolean = false;
  touchStart: boolean = false;
  trackInterval: any;
  touchClinetY: number = 0;
  replay: boolean = false;
  trackIndex:number = 0;
  isClickUp: boolean = true;
  currentTime: string = '--:--';
  endOfTrack: string = '--:--';
  audio_info = {
    track_name: '---',
    track_artist: '---',
    track_duration: '--:--',
    track_image: 'assets/images/icon-384x384.png',
    track_url: ''
  };

  constructor(
    private renderer: Renderer2,
    private setMetaThemeColor: ChangeMetaThemeColorService,
    private router: Router,
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
          if (!this.touchStart) {
            setTimeout(() => {
              this.mainBlock.nativeElement.style.transition = 'unset';
            }, 250);
          } else {
            this.mainBlock.nativeElement.style.transition = '.25s cubic-bezier(0,-0.4,0,1.20)';
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
    this.playerController.color$.subscribe(rgb => {
      if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
        const blendedColor = this.blendWithBlack(rgb, 0.3);
        const trackThemeColor = `rgb(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b})`;
        this.trackThemeColor = trackThemeColor;
        if (this.isOpenedMobilePlayer) {
          this.setMetaThemeColor.setThemeColor(trackThemeColor, this.renderer);
        }
      }
    })
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        let routePath:string = event.urlAfterRedirects.split('/')[1];

        if (routePath != 'home') {
          this.isOpenedMobilePlayer = false;
        }
      }
    });
    if ('mediaSession' in navigator) {
      navigator.mediaSession.setActionHandler('play', () => this.play());
      navigator.mediaSession.setActionHandler('pause', () => this.pause());
      navigator.mediaSession.setActionHandler('previoustrack', (details) => {
        this.prev();
      });
      navigator.mediaSession.setActionHandler('nexttrack', (details) => {
        this.next();
      });
      navigator.mediaSession.setActionHandler('seekto', details => this.seekTo(details.seekTime!));
    }

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
    playerController.playerInfo$.subscribe((list) => {
      if (list) {
        this.trackList = list;
        this.audio_info = list[0];
        this.load();
        this.play();
      }
    });
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
    this.touchLineCount = 0;
    this.touchStart = false;
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
  }

  seek(offset: number) {
    const newTime = this.audio.currentTime + offset;
    this.audio.currentTime = newTime;
    this.updateSeekBar();
    this.updateSeekBarOpenPlayer();
  }

  seekTo(time: number) {
    this.audio.currentTime = time;
    this.updateSeekBar();
    this.updateSeekBarOpenPlayer();
  }

  load() {
    this.isLoaded = false;
    this.audio.src = this.audio_info.track_url;
    this.audio.load();
    this.playerController.setImageColor(this.audio_info.track_image);
    this.audio.addEventListener('loadedmetadata', () => {
      this.isLoaded = true;
      this.endOfTrack = this.formatTime(this.audio.duration - this.audio.currentTime);
      this.currentTime = '00:00';

      if ('mediaSession' in navigator) {
        navigator.mediaSession.metadata = new MediaMetadata({
          title: this.audio_info.track_name,
          artist: this.audio_info.track_artist,
          artwork: [
            { src: this.audio_info.track_image, sizes: '96x96', type: 'image/jpeg' },
            { src: this.audio_info.track_image, sizes: '128x128', type: 'image/jpeg' },
            { src: this.audio_info.track_image, sizes: '192x192', type: 'image/jpeg' }
          ]
        });
      }
    });
    this.audio.addEventListener('timeupdate', () => {
      this.currentTime = this.formatTime(this.audio.currentTime);
      this.endOfTrack = this.formatTime(this.audio.duration - this.audio.currentTime);
    });
    if (this.isOpenedMobilePlayer) {
      this.playerController.color$.subscribe(rgb => {
        if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
          const blendedColor = this.blendWithBlack(rgb, 0.3);
          const trackThemeColor = `rgb(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b})`;
          this.trackThemeColor = trackThemeColor;
          this.setMetaThemeColor.setThemeColor(trackThemeColor, this.renderer);
        }
      })
    }
    this.playerController.setBackground(this.audio_info.track_image);
  }

  blendWithBlack(rgb: { r: number, g: number, b: number }, factor: number): { r: number, g: number, b: number } {
    const blend = (color: number) => Math.round(color * (1 - factor));
    return {
      r: blend(rgb.r),
      g: blend(rgb.g),
      b: blend(rgb.b)
    };
  }

  play() {
    // let volume:number = 0;
    // const volumeInterval = setInterval(() => {
    //   console.log(volume);
    //   volume = volume + 0.01;
    //   this.audio.volume = volume;
    //   if (volume === 0.9900000000000007) {
    //     this.audio.volume = 1;
    //     clearInterval(volumeInterval);
    //   }
    // }, 5)
    this.audio.play();
    this.isPlaying = true;
    this.trackInterval = setInterval(() => {
      if (this.audio.ended) {
        if (this.replay) {
          this.audio.currentTime = 0;
          this.play();
        } else {
          this.next();
        }
      }
      this.currentTime = this.formatTime(this.audio.currentTime);
      if (!isNaN(this.audio.duration)) {
        this.endOfTrack = this.formatTime(this.audio.duration - this.audio.currentTime);
      }
      this.updateSeekBar();
      this.updateSeekBarOpenPlayer();
    }, 1000)
  }

  pause() {
    // let volume:number = 1;
    //
    // const volumeInterval = setInterval(() => {
    //   console.log(volume);
    //   volume = volume - 0.01;
    //   this.audio.volume = volume;
    //   if (volume === 0.009999999999999247) {
    //     clearInterval(volumeInterval);
    //
    //   }
    // }, 5)
    this.audio.pause();
    this.isPlaying = false;
  }

  playPause() {
    if (this.isPlaying) {
      this.pause();
    } else {
      this.play();
    }
  }

  seekMove(e: any, type: string) {
    if (this.seekBarContainer && !this.isClickUp) {
      const seekBarRect = this.seekBarContainer.nativeElement.getBoundingClientRect();
      let offsetX: number;

      if (type === 'touch') {
        offsetX = e.changedTouches[0].clientX - seekBarRect.left;
      } else {
        offsetX = e.clientX - seekBarRect.left;
      }

      const progress = Math.max(0, Math.min(offsetX / seekBarRect.width, 1));

      if (isFinite(this.audio.duration)) {
        this.audio.currentTime = progress * this.audio.duration;
        this.updateSeekBar();
      }
    }
  }

  seekMoveOpenPlayer(e: any, type: string) {
    this.moveLimit = 0;
    if (this.seekBarContainerOpenPlayer && !this.isClickUp) {
      const seekBarRect = this.seekBarContainerOpenPlayer.nativeElement.getBoundingClientRect();
      let offsetX: number;

      if (type === 'touch') {
        offsetX = e.changedTouches[0].clientX - seekBarRect.left;
      } else {
        offsetX = e.clientX - seekBarRect.left;
      }

      const progress = Math.max(0, Math.min(offsetX / seekBarRect.width, 1));

      if (isFinite(this.audio.duration)) {
        this.audio.currentTime = progress * this.audio.duration;
        this.updateSeekBarOpenPlayer();
      }
    }
  }

  updateSeekBar() {
    if (this.seekBarProgress) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.seekBarProgress.nativeElement.style.width = `${progress}%`;
    }
  }

  updateSeekBarOpenPlayer() {
    if (this.seekBarProgressOpenPlayer) {
      const progress = (this.audio.currentTime / this.audio.duration) * 100;
      this.seekBarProgressOpenPlayer.nativeElement.style.width = `${progress}%`;
    }
  }

  next() {
    if (this.trackList.length - 1 > this.trackIndex) {
      this.pause();
      this.trackIndex++;
      this.audio_info = this.trackList[this.trackIndex];
      skip(1);
      this.load();
      this.play();
    } else  {
      this.trackIndex = 0;
      this.pause();
      this.audio_info = this.trackList[this.trackIndex];
      skip(1);
      this.load();
      this.play();
    }
  }

  prev() {
    if (this.trackIndex != 0) {
      this.pause();
      this.trackIndex--
      this.audio_info = this.trackList[this.trackIndex];
      skip(-1);
      this.load();
      this.play();
    } else {
      this.pause();
      this.trackIndex = this.trackList.length - 1;
      this.audio_info = this.trackList[this.trackIndex];
      skip(-1);
      this.load();
      this.play();
    }
  }

  formatTime(seconds: number): string {
    const minutes: number = Math.floor(seconds / 60);
    const secs: number = Math.floor(seconds % 60);
    return `${minutes < 10 ? '0' : ''}${minutes}:${secs < 10 ? '0' : ''}${secs}`;
  }

  openMobilePlayer() {
    if (innerWidth < 500 && !this.isOpenedMobilePlayer) {
      this.playerController.setIsOpenedPlayer(true);
      this.playerController.color$.subscribe(rgb => {
        if (rgb && rgb.r !== undefined && rgb.g !== undefined && rgb.b !== undefined) {
          const blendedColor = this.blendWithBlack(rgb, 0.3);
          const trackThemeColor = `rgb(${blendedColor.r}, ${blendedColor.g}, ${blendedColor.b})`;
          this.trackThemeColor = trackThemeColor;
          this.setMetaThemeColor.setThemeColor(trackThemeColor, this.renderer);
        }
      })
      this.isOpenedMobilePlayer = true;
    }
  }

  closeMobilePlayer() {
    setTimeout(() => {
      this.isOpenedTimerBottomSheet = false;
      this.playerController.setIsOpenedPlayer(false);
      this.setMetaThemeColor.setThemeColor('#1a1a1a', this.renderer);
      if (innerWidth < 500) {
        this.isOpenedMobilePlayer = false;
      }
    })
  }

  replayOnOff() {
    this.replay = !this.replay;
  }

  setFavorite() {
    this.isSetFavorite = !this.isSetFavorite;
  }

  previous_10s() {
    this.audio.currentTime = this.audio.currentTime - 10;
    this.updateSeekBarOpenPlayer();
  }

  next_10s() {
    this.audio.currentTime = this.audio.currentTime + 10;
    this.updateSeekBarOpenPlayer();
  }

  share() {
    const shareData = {
      title: "Music",
      text: "Dynamics",
      url: "https://dynamics-9080b.web.app/home",
    };

    navigator.share(shareData);
  }

  openTimerBottomSheet() {
    this.isOpenedTimerBottomSheet = !this.isOpenedTimerBottomSheet;
  }

  protected readonly innerHeight = innerHeight;
}
