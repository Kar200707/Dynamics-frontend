  import { Routes } from '@angular/router';
  import {mainPageGuard} from "./guards/main-page.guard";
  import {loginRegGuard} from "./guards/login-reg.guard";

  export const routes: Routes = [
    {
      path: '',
      redirectTo: '/home/playlists',
      pathMatch: 'full'
    },
    {
      title: 'Dynamics',
      path: '',
      canActivate: [mainPageGuard],
      loadComponent: () => import('./pages/main/main.component').then(x => (x.MainComponent)),
      children: [
        {
          title: 'Dynamics Home',
          path: 'home',
          loadComponent: () => import('./pages/home/home.component').then(x => (x.HomeComponent)),
          children: [
            {
              title: 'Home',
              loadComponent: () => import('./components/playlists-block/playlists-block.component').then(x => (x.PlaylistsBlockComponent)),
              path: "playlists"
            },
            {
              title: 'Library',
              loadComponent: () => import('./pages/library/library.component').then(x => (x.LibraryComponent)),
              path: "library"
            },
            {
              title: 'Search',
              loadComponent: () => import('./pages/search/search.component').then(x => (x.SearchComponent)),
              path: "search"
            },
            {
              title: 'Folder',
              loadComponent: () => import('./pages/folder/folder.component').then(x => (x.FolderComponent)),
              path: "folder/:id"
            }
          ]
        },
        {
          title: 'Home',
          path: 'home/track/:id',
          data: { animation: 'HomePage' },
          loadComponent: () => import('./pages/home/home.component').then(x => (x.HomeComponent)),
        },
        {
          title: 'Dynamics library',
          path: 'library',
          data: { animation: 'LibraryPage' },
          loadComponent: () => import('./pages/library/library.component').then(x => (x.LibraryComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai',
          loadComponent: () => import('./pages/DynamicsAI/dynamics-ai/dynamics-ai.component').then(x => (x.DynamicsAiComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai/chat/:id',
          loadComponent: () => import('./pages/DynamicsAI/dynamics-ai-chat/dynamics-ai-chat.component').then(x => (x.DynamicsAiChatComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai-pc/chat/:id',
          loadComponent: () => import('./pages/DynamicsAI/pc-ai-chat/pc-ai-chat.component').then(x => (x.PcAiChatComponent)),
        },
        {
          title: 'Dynamics Ai',
          path: 'dynamics-ai-pc/chat',
          loadComponent: () => import('./pages/DynamicsAI/pc-ai-chat/pc-ai-chat.component').then(x => (x.PcAiChatComponent)),
        },
        {
          title: 'Dynamics search',
          path: 'search',
          data: { animation: 'SearchPage' },
          loadComponent: () => import('./pages/search/search.component').then(x => (x.SearchComponent)),
        },
        {
          title: 'Dynamics',
          path: 'category/:type',
          loadComponent: () => import('./pages/categories/categories.component').then(x => (x.CategoriesComponent)),
        },
        {
          title: 'Folder',
          path: 'folder/:id',
          loadComponent: () => import('./pages/folder/folder.component').then(x => (x.FolderComponent)),
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
