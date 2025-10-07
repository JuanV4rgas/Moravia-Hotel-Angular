import { Component } from '@angular/core';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cliente-form',
  templateUrl: './cliente-form.component.html',
  styleUrls: ['./cliente-form.component.css']
})
export class ClienteFormComponent {

  formCliente: Cliente = {
    idUsuario: 0,
    email: '',
    clave: '',
    nombre: '',
    apellido: '',
    cedula: '',
    telefono: '',
    fotoPerfil: ''
  };

  constructor(
    private clienteService: ClienteService,
    private router: Router
  ) { }

  guardar() {
    this.clienteService.save(this.formCliente).subscribe(() => {
      console.log("Cliente guardado", this.formCliente);
      this.router.navigate(['/cliente/table']);
    });
  }
}
