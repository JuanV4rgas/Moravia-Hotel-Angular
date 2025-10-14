// src/app/room/room-form/room-form.component.ts
import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { Room } from '../../model/room';
import { RoomType } from '../../model/roomtype';

import { RoomService } from '../../services/room.service';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-room-form',
  templateUrl: './room-form.component.html'
})
export class RoomFormComponent implements OnInit {
  @Output() saved = new EventEmitter<void>();

  // Importante: id:string, numeroHabitacion:string, disponible:boolean, type:RoomType
  formRoom: Room = {
    id: 0,
    habitacionNumber: '',
    available: false,
    type: {} as RoomType
  };

  roomTypes: RoomType[] = [];
  loading = false;
  isEdit = false;
  error?: string;

  constructor(
    private roomService: RoomService,
    private roomTypeService: RoomTypeService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadRoomTypes();

    // Si hay :id en la URL, es edición
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.loading = true;
      this.roomService.getRoom(Number(id)).subscribe({
        next: (room) => {
          this.formRoom = room;
          this.loading = false;
        },
        error: (err) => {
          this.error = 'No se pudo cargar la habitación.';
          console.error(err);
          this.loading = false;
        }
      });
    }
  }

  private loadRoomTypes(): void {
    this.roomTypeService.getAllRoomTypes().subscribe({
      next: (types) => {
        this.roomTypes = types;
        // Si es creación, setea un tipo por defecto para evitar nulls
        if (!this.isEdit && types.length && !this.formRoom.type?.id) {
          this.formRoom.type = types[0];
        }
      },
      error: (err) => {
        this.error = 'No se pudieron cargar los tipos de habitación.';
        console.error(err);
      }
    });
  }

  addRoomForm(): void {
    if (!this.formRoom.id) {
      this.error = 'El id es obligatorio.';
      return;
    }
    if (!this.formRoom.habitacionNumber?.trim()) {
      this.error = 'El número de habitación es obligatorio.';
      return;
    }
    if (!this.formRoom.type || !this.formRoom.type.id) {
      this.error = 'Selecciona un tipo de habitación.';
      return;
    }

    this.loading = true;

  
    const payload: Room = this.formRoom;

    const req$ = this.isEdit
      ? this.roomService.updateRoom(Number(this.formRoom.id), payload)
      : this.roomService.addRoom(payload);

    req$.subscribe({
      next: () => {
        this.loading = false;
        this.saved.emit();          // notifica al padre (si lo usas)
        // Opcional: volver a la tabla
        // this.router.navigate(['/room/table']);

        if (!this.isEdit) {
          // reset si fue creación
          this.formRoom = {
            id: 0,
            habitacionNumber: '',
            available: false,
            type: this.roomTypes[0] ?? ({} as RoomType)
          };
        }
      },
      error: (err) => {
        this.error = 'No se pudo guardar la habitación.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  onClear(): void {
  this.formRoom = {
    id: 0,
    habitacionNumber: '',
    available: false,
    // Usa el primer RoomType cargado; si no hay, usa un placeholder tipado
    type: this.roomTypes[0] ?? ({ id: '', name: '', price: 0, description: '', capacity: '', numberOfBeds: 0, image: '' } as RoomType)
  };
}
}
