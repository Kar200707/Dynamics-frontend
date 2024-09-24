export interface ChannelModel {
  title: string;
  image: string;
  videos: [
    type: string,
    title: string,
    videoId: string,
    author: string,
    authorId: string,
    videoThumbnails: [
      {
        url: string,
      },
      {
        url: string,
      },
      {
        url: string,
      },
      {
        url: string,
      }
    ],
    viewCountText: string,
    publishedText: string,
    durationText: string
  ]
}
