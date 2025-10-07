import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Usuario } from 'src/app/model/usuario'; 
import { ClienteService } from 'src/app/services/cliente.service'; // 👈 si vas a traer el usuario desde backend
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-perfil-usuario',
  templateUrl: './perfil-usuario.component.html',
  styleUrls: ['./perfil-usuario.component.css']
})
export class PerfilUsuarioComponent implements OnInit {
  usuario!: Usuario;       // tu modelo real
  form!: FormGroup;
  mensaje: string = '';
  error: string = '';

  showNuevaClave: boolean = false;
  showConfirmarClave: boolean = false;

  constructor(
    private fb: FormBuilder,
    private clienteService: ClienteService, // para consumir backend
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    // Inicializa form vacío primero
    this.form = this.fb.group({
      nombre: ['', Validators.required],
      apellido: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      cedula: ['', Validators.required],
      telefono: [''],
      fotoPerfil: [''],
      nuevaClave: [''],
      confirmarClave: ['']
    });

    // Si el usuario se pasa por ruta: /usuarios/:id
    const id = Number(this.route.snapshot.paramMap.get('idUsuario'));
    if (id) {
      this.clienteService.getById(id).subscribe({
        next: (data: Usuario) => {
          this.usuario = data;
          this.form.patchValue(this.usuario); // carga en el formulario
        },
        error: () => {
          this.error = 'Error cargando el usuario';
        }
      });
    }
  }

  togglePassword(field: string) {
    if (field === 'nuevaClave') this.showNuevaClave = !this.showNuevaClave;
    if (field === 'confirmarClave') this.showConfirmarClave = !this.showConfirmarClave;
  }

  onSubmit() {
    if (this.form.valid) {
      // actualiza el usuario con lo que está en el form
      const updated: Usuario = { ...this.usuario, ...this.form.value };

      this.clienteService.update(updated.idUsuario, updated).subscribe({
        next: () => {
          this.mensaje = 'Perfil actualizado correctamente';
          this.error = '';
        },
        error: () => {
          this.error = 'No se pudo actualizar el perfil';
          this.mensaje = '';
        }
      });
    } else {
      this.error = 'El formulario tiene errores';
      this.mensaje = '';
    }
  }

  onReset() {
    if (this.usuario) {
      this.form.reset(this.usuario); // restaura al usuario cargado
    }
  }
}
