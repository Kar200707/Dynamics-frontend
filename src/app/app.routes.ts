  import { Routes } from '@angular/router';
  import {mainPageGuard} from "./guards/main-page.guard";
  import {loginRegGuard} from "./guards/login-reg.guard";

  export const routes: Routes = [
    {
      path: '',
      redirectTo: '/home',
      pathMatch: 'full'
    },
    {
      title: 'Dynamics',
      path: 'home',
      canActivate: [mainPageGuard],
      loadComponent: () => import('./pages/main/main.component').then(x => (x.MainComponent)),
      children: [
        {
          title: 'Dynamics Home',
          path: '',
          loadComponent: () => import('./pages/home/home.component').then(x => (x.HomeComponent)),
        },
        {
          title: 'Dynamics Home',
          path: 'track/:id',
          loadComponent: () => import('./pages/home/home.component').then(x => (x.HomeComponent)),
        },
        {
          title: 'Dynamics library',
          path: 'library',
          loadComponent: () => import('./pages/library/library.component').then(x => (x.LibraryComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai',
          loadComponent: () => import('./pages/dynamics-ai/dynamics-ai.component').then(x => (x.DynamicsAiComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai/chat/:id',
          loadComponent: () => import('./pages/dynamics-ai-chat/dynamics-ai-chat.component').then(x => (x.DynamicsAiChatComponent)),
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
          title: 'Dynamics Favorites',
          path: 'track-favorites',
          loadComponent: () => import('./pages/track-favorites/track-favorites.component').then(x => (x.TrackFavoritesComponent)),
        },
        {
          title: 'Dynamics Channels',
          path: 'channel/:id',
          loadComponent: () => import('./pages/channel/channel.component').then(x => (x.ChannelComponent)),
        }
      ]
    },
    {
      title: 'Dynamics Admin',
      path: 'admin',
      canActivate: [mainPageGuard],
      loadComponent: () => import('./pages/admin/admin.component').then(x => (x.AdminComponent)),
    },
    {
      title: 'Dynamics Login',
      path: 'login',
      canActivate: [loginRegGuard],
      loadComponent: () => import('./pages/login/login.component').then(x => (x.LoginComponent)),
    },
    {
      title: 'Dynamics Register',
      path: 'register',
      canActivate: [loginRegGuard],
      loadComponent: () => import('./pages/register/register.component').then(x => (x.RegisterComponent)),
    },
  ];
