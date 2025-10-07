import { Component, EventEmitter, Output } from '@angular/core';
import { Cliente } from '../../model/cliente';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {

      //Evento
      @Output()
      addClienteEvent = new EventEmitter<Cliente>();
    
      sendCliente!: Cliente
    
      //Modelo
      formCliente: Cliente = {
        id: 0,
      email: '',
    password: '',
    name: '',
    surename: '',
    cedula: 0,
    phone: '',
    pfp: ''
      }
  
       addClienteForm(){
      console.log(this.formCliente);
      this.sendCliente = Object.assign({}, this.formCliente);
      this.addClienteEvent.emit(this.sendCliente);
  
    }
  
    addCliente(form: any){
      console.log(this.formCliente);
      this.sendCliente = Object.assign({}, this.formCliente);
      this.addClienteEvent.emit(this.sendCliente);
    }


}
