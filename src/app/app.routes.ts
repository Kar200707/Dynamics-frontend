  import { Routes } from '@angular/router';

  export const routes: Routes = [
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      title: 'Dynamics Home',
      path: 'home',
      loadComponent: () => import('./pages/main/main.component').then(x => (x.MainComponent)),
    },
    {
      title: 'Dynamics library',
      path: 'library',
      loadComponent: () => import('./pages/library/library.component').then(x => (x.LibraryComponent)),
    },
    {
      title: 'Dynamics search',
      path: 'search',
      loadComponent: () => import('./pages/search/search.component').then(x => (x.SearchComponent)),
    },
    {
      title: 'Dynamics',
      path: 'category/:type',
      loadComponent: () => import('./pages/categories/categories.component').then(x => (x.CategoriesComponent)),
    },
    {
      title: 'Dynamics Admin',
      path: 'admin',
      loadComponent: () => import('./pages/admin/admin.component').then(x => (x.AdminComponent)),
    },
    {
      title: 'Dynamics Favorites',
      path: 'track-favorites',
      loadComponent: () => import('./pages/track-favorites/track-favorites.component').then(x => (x.TrackFavoritesComponent)),
    }
  ];
