import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-card',
  templateUrl: './auth-card.component.html',
  styleUrls: ['./auth-card.component.css']
})
export class AuthCardComponent {
  mostrarLogin = true; 

  onToggleForm() {
    this.mostrarLogin = !this.mostrarLogin;
  }
}
