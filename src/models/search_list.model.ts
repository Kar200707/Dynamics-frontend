export interface SearchListModel {
  author: {
    name: string,
    url: string
  }
  description?: string,
  duration: {
    seconds: number,
    timestamp: string
  }
  views: number;
  image: string,
  title: string,
  videoId: string
}
