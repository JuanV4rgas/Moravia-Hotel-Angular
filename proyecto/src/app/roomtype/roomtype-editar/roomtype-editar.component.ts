import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomType } from '../../model/roomtype';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-roomtype-editar',
  templateUrl: './roomtype-editar.component.html',
})
export class RoomtypeEditarComponent implements OnInit { // <-- usa este mismo nombre
  loading = false;
  error?: string;
  private id!: number;

  form: RoomType = {
    id: 0,
    name: '',
    description: '',
    price: 0,
    capacity: '',          // capacity es string
    numberOfBeds: 1,
    image: '',
    type: '' 
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    this.id = Number(this.route.snapshot.paramMap.get('id')) ?? 0;
    if (!this.id) { this.error = 'ID inválido'; return; }
    this.cargarRoomType();
  }

  private cargarRoomType(): void {
    this.loading = true;
    this.roomTypeService.getRoomType(this.id).subscribe({
      next: (rt) => { this.form = rt; this.loading = false; },
      error: (err) => { this.error = `No se pudo cargar el RoomType (HTTP ${err?.status ?? '—'})`; this.loading = false; }
    });
  }

  guardar(): void {
    if (!this.form.name?.trim()) { this.error = 'El nombre es obligatorio.'; return; }
    if (this.form.price == null) { this.error = 'El precio es obligatorio.'; return; }

    this.loading = true;
    this.roomTypeService.updateRoomType(this.id, this.form).subscribe({
      next: () => { this.loading = false; this.router.navigate(['/roomtype/lista']); },
      error: (err) => { this.error = `No se pudo actualizar el tipo (HTTP ${err?.status ?? '—'})`; this.loading = false; }
    });
  }

  cancelar(): void {
    this.router.navigate(['/roomtype/lista']);
  }
}
