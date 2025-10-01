import { Component, Input } from '@angular/core';
import { Cliente } from '../cliente';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css']
})
export class ClienteDetailComponent {

  @Input()
  cliente!:Cliente;
  
  //Inyectar dependencias
  constructor(){}
  
  //funcion que llama el componente
  ngOnInit():void{
    console.log("ngOnInit del detail");
  }

  ngOnChanges():void{
    console.log("ngOnChanges del detail");
  }
}
