import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatTabsModule
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  registerData = { email: '', password: '' };
  
  constructor(
    private authService: AuthService, 
    private router: Router,
    private toastService: ToastService
  ) {}

  onLogin() {
    this.authService.login(this.loginData).subscribe({
      next: () => {
        this.toastService.success('Connexion réussie !');
        this.router.navigate(['/']);
      },
      error: (err) => {
        console.error('Login failed', err);
        this.toastService.error('Échec de la connexion. Vérifiez vos identifiants.');
      }
    });
  }

  onRegister() {
    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.toastService.success('Inscription réussie ! Veuillez vous connecter.');
        this.loginData.email = this.registerData.email;
        this.loginData.password = this.registerData.password;
      },
      error: (err) => {
        console.error('Registration failed', err);
        this.toastService.error('Échec de l\'inscription. Veuillez réessayer.');
      }
    });
  }
}
