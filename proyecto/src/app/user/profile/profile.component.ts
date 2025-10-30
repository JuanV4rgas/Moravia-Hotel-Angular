import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
})
export class ProfileComponent implements OnInit {
  usuario!: Usuario;
  formChanged = false;

  mensaje = '';
  error = '';

  constructor(
    private authService: AuthService,
  ) {}
  ngOnInit(): void {
    this.authService.usuario$.subscribe((usuario) => (this.usuario = usuario!));
  }  
}
