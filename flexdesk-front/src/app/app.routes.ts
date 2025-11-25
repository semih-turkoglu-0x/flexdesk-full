import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home';
import { RoomPlanningComponent } from './components/roomplanning/roomplanning';
import { PersonalPlanningComponent } from './components/personalplanning/personalplanning';
import { LoginComponent } from './components/login/login.component';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [authGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'room-planning', component: RoomPlanningComponent, canActivate: [authGuard] },
  { path: 'personal-planning', component: PersonalPlanningComponent, canActivate: [authGuard] },
  { path: '**', redirectTo: '' }
];