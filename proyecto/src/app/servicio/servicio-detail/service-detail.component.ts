import { Component, Input } from '@angular/core';
import { Service } from '../service';

@Component({
  selector: 'app-service-detail',
  templateUrl: './service-detail.component.html',
  styleUrls: ['./service-detail.component.css']
})
export class ServiceDetailComponent {
  @Input()
  service!:Service;

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
