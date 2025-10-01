import { Component } from '@angular/core';
import { Cliente } from '../cliente';

@Component({
  selector: 'app-cliente-table',
  templateUrl: './cliente-table.component.html',
  styleUrls: ['./cliente-table.component.css']
})
export class ClienteTableComponent {

    //Atributos 
  selectedCliente!: Cliente;
  
    //Base de datos
    clientesList: Cliente[] = [
    {
      id: 1,
      email: "juan.perez@example.com",
      password: "clave123",
      name: "Juan",
      surename: "Pérez",
      cedula: 1234567890,
      phone: "+57 3001234567",
      pfp: "https://randomuser.me/api/portraits/men/1.jpg"
    },
    {
      id: 2,
      email: "maria.gomez@example.com",
      password: "pass456",
      name: "María",
      surename: "Gómez",
      cedula: 9876543210,
      phone: "+57 3012345678",
      pfp: "https://randomuser.me/api/portraits/women/2.jpg"
    },
    {
      id: 3,
      email: "carlos.lopez@example.com",
      password: "secure789",
      name: "Carlos",
      surename: "López",
      cedula: 1122334455,
      phone: "+57 3023456789",
      pfp: "https://randomuser.me/api/portraits/men/3.jpg"
    },
    {
      id: 4,
      email: "laura.martinez@example.com",
      password: "clave987",
      name: "Laura",
      surename: "Martínez",
      cedula: 2233445566,
      phone: "+57 3034567890",
      pfp: "https://randomuser.me/api/portraits/women/4.jpg"
    },
    {
      id: 5,
      email: "andres.ramirez@example.com",
      password: "pass321",
      name: "Andrés",
      surename: "Ramírez",
      cedula: 3344556677,
      phone: "+57 3045678901",
      pfp: "https://randomuser.me/api/portraits/men/5.jpg"
    },
    {
      id: 6,
      email: "sofia.torres@example.com",
      password: "sofia456",
      name: "Sofía",
      surename: "Torres",
      cedula: 4455667788,
      phone: "+57 3056789012",
      pfp: "https://randomuser.me/api/portraits/women/6.jpg"
    },
    {
      id: 7,
      email: "pedro.morales@example.com",
      password: "pedro789",
      name: "Pedro",
      surename: "Morales",
      cedula: 5566778899,
      phone: "+57 3067890123",
      pfp: "https://randomuser.me/api/portraits/men/7.jpg"
    },
    {
      id: 8,
      email: "camila.hernandez@example.com",
      password: "camila123",
      name: "Camila",
      surename: "Hernández",
      cedula: 6677889900,
      phone: "+57 3078901234",
      pfp: "https://randomuser.me/api/portraits/women/8.jpg"
    },
    {
      id: 9,
      email: "diego.flores@example.com",
      password: "diego456",
      name: "Diego",
      surename: "Flores",
      cedula: 7788990011,
      phone: "+57 3089012345",
      pfp: "https://randomuser.me/api/portraits/men/9.jpg"
    },
    {
      id: 10,
      email: "valentina.rojas@example.com",
      password: "valen789",
      name: "Valentina",
      surename: "Rojas",
      cedula: 8899001122,
      phone: "+57 3090123456",
      pfp: "https://randomuser.me/api/portraits/women/10.jpg"
    }
  ];
  
    mostrarCliente(cliente:Cliente){
      this.selectedCliente= cliente;
    }
  
    agregarCliente(cliente:Cliente){
      this.clientesList.push(cliente);
    }
  
    eliminarCliente(cliente:Cliente){
      var index = this.clientesList.indexOf(cliente);
      this.clientesList.splice(index,1);
    }
  

}
