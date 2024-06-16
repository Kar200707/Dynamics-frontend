import {Component, ViewChild, ElementRef} from '@angular/core';
import { MatIcon } from "@angular/material/icon";
import { PlayerControllerService } from "../../services/player-controller.service";
import {ResizeHeightDirective} from "../../directives/resize-height.directive";
import {NavigationEnd, Router} from "@angular/router";

@Component({
  selector: 'app-player',
  standalone: true,
  imports: [
    MatIcon,
    ResizeHeightDirective
  ],
  templateUrl: './player.component.html',
  styleUrls: ['./player.component.css']
})
export class PlayerComponent {
  @ViewChild('seekBarContainer') seekBarContainer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgress') seekBarProgress!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarContainerOpenPlayer') seekBarContainerOpenPlayer!: ElementRef<HTMLDivElement>;
  @ViewChild('seekBarProgressOpenPlayer') seekBarProgressOpenPlayer!: ElementRef<HTMLDivElement>;
  audio: HTMLAudioElement = new Audio();
  backgroundImage: string = '';
  isOpenedMobilePlayer: boolean = false;
  isLoaded: boolean = false;
  isPlaying: boolean = false;
  trackList: any;
  trackInterval: any;
  trackIndex:number = 0;
  isClickUp: boolean = true;
  currentTime: string = '--:--';
  duration: string = '--:--';
  audio_info = {
    track_name: '---',
    track_artist: '---',
    track_duration: '--:--',
    track_image: 'assets/images/icon-384x384.png',
    track_url: ''
  };

  constructor(
    private router: Router,
    private playerController: PlayerControllerService) {
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
      navigator.mediaSession.setActionHandler('previoustrack', () => this.prev());
      navigator.mediaSession.setActionHandler('nexttrack', () => this.next());
      // navigator.mediaSession.setActionHandler('seekforward', details => this.seek(details.seekOffset || 10));
      // navigator.mediaSession.setActionHandler('seekbackward', details => this.seek(-(details.seekOffset || 10)));
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
      this.duration = this.formatTime(this.audio.duration);
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
    });
    this.playerController.setBackground(this.audio_info.track_image);
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
        this.next();
      }
      this.currentTime = this.formatTime(this.audio.currentTime);
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
      this.load();
      this.play();
    } else  {
      this.trackIndex = 0;
      this.pause();
      this.audio_info = this.trackList[this.trackIndex];
      this.load();
      this.play();
    }
  }

  prev() {
    if (this.trackIndex != 0) {
      this.pause();
      this.trackIndex--
      this.audio_info = this.trackList[this.trackIndex];
      this.load();
      this.play();
    } else {
      this.pause();
      this.trackIndex = this.trackList.length - 1;
      this.audio_info = this.trackList[this.trackIndex];
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
      this.isOpenedMobilePlayer = true;
    }
  }

  closeMobilePlayer() {
    setTimeout(() => {
      if (innerWidth < 500) {
        this.isOpenedMobilePlayer = false;
      }
    })
  }

  protected readonly innerWidth = innerWidth;
  protected readonly innerHeight = innerHeight;
}
