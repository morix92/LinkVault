import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth-guard';

import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { VaultComponent } from './pages/vault/vault';
import { FaqComponent } from './pages/faq/faq';
import { ProfileComponent } from './pages/profile/profile';
import { guestGuard } from './core/guards/guest-guard';


export const routes: Routes = [

  {
    path: '',
    redirectTo: 'vault',
    pathMatch: 'full'
  },
  {
    path: 'faq',
    component: FaqComponent
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [guestGuard]
  },

  {
    path: 'vault',
    component: VaultComponent,
    canActivate: [authGuard]
  },
  {
    path: 'profile',
    component: ProfileComponent,
    canActivate: [authGuard]
  },
  {
    path: '**',
    redirectTo: 'vault'
  }
];