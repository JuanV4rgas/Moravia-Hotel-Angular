// src/app/roomtype/roomtype-form/roomtype-form.component.ts
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomTypeService } from 'src/app/services/roomtype.service';
import { RoomType } from 'src/app/model/roomtype';

@Component({
  selector: 'app-roomtype-form',
  templateUrl: './roomtype-form.component.html'
})
export class RoomTypeFormComponent implements OnInit {
  form: RoomType = {
    id: '',
    name: '',
    description: '',
    price: 0,          
    capacity: '',      
    numberOfBeds: 1,
    image: ''
  };

  isEdit = false;
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.roomTypeService.getRoomType(id).subscribe({
        next: (rt) => {
          // garantiza que capacity quede como string por si el back envía número
          this.form = {
            ...rt,
            capacity: rt.capacity != null ? String(rt.capacity) : ''
          };
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar el tipo.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  save(): void {
    if (!this.form.name?.trim()) {
      this.error = 'El nombre es obligatorio.';
      return;
    }

    this.loading = true;

    // 👇 capacity se envía tal cual string
    const payload: RoomType = {
      ...this.form,
      capacity: this.form.capacity ?? ''
    };

    console.log('[RoomType payload]', payload); // útil para ver lo que se manda

    const req$ = this.isEdit
      ? this.roomTypeService.updateRoomType(this.form.id, payload)
      : this.roomTypeService.addRoomType(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.router.navigate(['/roomtype/lista']);
      },
      error: (err) => {
        console.error('Error al guardar RoomType', err);
        const backendMsg =
          err?.error?.message ||
          err?.error?.error ||
          (typeof err?.error === 'string' ? err.error : '') ||
          `HTTP ${err?.status ?? '—'}`;
        this.error = `No se pudo guardar el tipo: ${backendMsg}`;
        this.loading = false;
      }
    });
  }

  onClear(): void {
    this.form = {
      id: '',
      name: '',
      description: '',
      price: 0,
      capacity: '',     // 👈 string
      numberOfBeds: 1,
      image: ''
    };
  }
}
