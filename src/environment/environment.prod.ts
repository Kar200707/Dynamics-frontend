export const host = 'https://api-dynamics.adaptable.app/';

export const environment = {
  signIn: host + 'auth/login',
  signUp: host + 'auth/reg',
  getIsFavoriteTrack: host + 'media/track-details/is-favorite',
  getTracksListByCategory: host + 'media/track-details/get-tracks-list-by-category/',
  getFavoriteTracksList: host + 'media/track-details/get-favorites-list',
  getAccount: host + 'user/account',
  adminTrack: host + 'admin/track',
  addFavorite: host + 'media/track-details/add-favorites',
  searchTracksList: host + 'youtube-base/search',
  getStream: host + 'youtube-base/get-stream/',
}
