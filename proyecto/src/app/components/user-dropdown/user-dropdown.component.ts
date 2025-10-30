import { Component, Input } from '@angular/core';
import { Usuario } from 'src/app/model/usuario';

@Component({
  selector: 'app-user-dropdown',
  templateUrl: './user-dropdown.component.html',
  styleUrls: ['./user-dropdown.component.css'],
})
export class UserDropdownComponent {

  @Input() usuario: Usuario | null = null;
  @Input() logoutFn!: () => void;

  logout(): void {
    this.logoutFn();
  }

}
