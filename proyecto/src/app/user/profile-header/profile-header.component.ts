import { Component } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-profile-header',
  templateUrl: './profile-header.component.html',
  styleUrls: ['./profile-header.component.css']
})
export class ProfileHeaderComponent {
formChanged: boolean = false;
usuario!: Usuario;
}
