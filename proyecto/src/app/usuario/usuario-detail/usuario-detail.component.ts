import { Component, Input } from '@angular/core';
import { Usuario } from '../../model/usuario';

@Component({
  selector: 'app-usuario-detail',
  templateUrl: './usuario-detail.component.html',
  styleUrls: ['./usuario-detail.component.css']
})
export class UsuarioDetailComponent {
  @Input() usuario!: Usuario;

  constructor(){}

  ngOnInit(): void { console.log('ngOnInit usuario-detail'); }
  ngOnChanges(): void { console.log('ngOnChanges usuario-detail'); }
}
