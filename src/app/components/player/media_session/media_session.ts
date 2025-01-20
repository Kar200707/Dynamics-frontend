import {host} from "../../../../environment/environment";
import {Title} from "@angular/platform-browser";

export function setupMediaSession(
  play: () => void, pause: () => void, prev: () => void,
  next: () => void, seekTo: (time: number) => void) {
  if ('mediaSession' in navigator) {
    navigator.mediaSession.setActionHandler('play', play);
    navigator.mediaSession.setActionHandler('pause', pause);
    navigator.mediaSession.setActionHandler('previoustrack', prev);
    navigator.mediaSession.setActionHandler('nexttrack', next);
    navigator.mediaSession.setActionHandler('seekto', (details) => {
      if (details.seekTime !== undefined) {
        seekTo(details.seekTime);
      }
    });
  }
}

export async function updateMediaSessionMetadata(audio_info: any, titleService: Title) {
  if ('mediaSession' in navigator) {
    titleService.setTitle(`${audio_info.title} - ${audio_info.author.name}`);
    navigator.mediaSession.metadata = new MediaMetadata({
      title: audio_info.title,
      artist: audio_info.author.name,
      artwork: [
        { src: host + 'media/cropImage?url=' + audio_info.image, sizes: '96x96', type: 'image/jpg' },
        { src: host + 'media/cropImage?url=' + audio_info.image, sizes: '128x128', type: 'image/jpg' },
        { src: host + 'media/cropImage?url=' + audio_info.image, sizes: '192x192', type: 'image/jpg' }
      ]
    });
  }
}
