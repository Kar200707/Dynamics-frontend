export const host = 'https://dynamics-backend-production.up.railway.app/';

export const environment = {
  signIn: host + 'auth/login',
  signUp: host + 'auth/reg',
  getIsFavoriteTrack: host + 'media/track-details/is-favorite',
  getTracksListByCategory: host + 'media/track-details/get-tracks-list-by-category/',
  getFavoriteTracksList: host + 'media/track-details/get-favorites-list',
  getAccount: host + 'user/account',
  adminTrack: host + 'admin/track',
  addFavorite: host + 'media/track-details/add-favorites',
  remFavorite: host + 'media/track-details/rem-favorites',
  searchTracksList: host + 'youtube-base/search',
  getStream: host + 'youtube-base/get-stream/',
  setPlayHistory: host + 'media/set-play-history',
  getPlayHistory: host + 'media/get-play-history',
  setSearchHistory: host + 'media/set-search-history',
  getSearchHistory: host + 'media/get-search-history',
}
