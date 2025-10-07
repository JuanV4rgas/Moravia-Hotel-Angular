import { Component, Input } from '@angular/core';
import { Cliente } from 'src/app/model/cliente';
import { ClienteService } from 'src/app/services/cliente.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-cliente-detail',
  templateUrl: './cliente-detail.component.html',
  styleUrls: ['./cliente-detail.component.css']
})
export class ClienteDetailComponent {

  @Input()
  cliente!: Cliente;

  //Inyectar dependencias
  constructor(
    private clienteService: ClienteService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  //Se llama una única vez cuando el componente se renderiza
  ngOnInit(): void {
    console.log("ngOnInit de ClienteDetail");
    this.route.paramMap.subscribe(params => {
      const id = Number(params.get('idUsuario')); 
      this.clienteService.getById(id).subscribe(
        (data) => {
          this.cliente = data;
        }
      )
    });
  }

  //Dado que el componente tiene una propiedad input
  ngOnChanges(): void {
    console.log("ngOnChanges de ClienteDetail");
  }

  siguiente() {
    let nextID = this.cliente.idUsuario + 1;
    this.router.navigate(['/cliente/detail', nextID]);
  }
}
