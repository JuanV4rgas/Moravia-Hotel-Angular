import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RoomTypeService } from 'src/app/services/roomtype.service';
import { RoomType } from '../../model/roomtype';

@Component({
  selector: 'app-roomtype-form',
  templateUrl: './roomtype-form.component.html',
  styleUrls: ['./roomtype-form.component.css']
})
export class RoomTypeFormComponent implements OnInit {
  roomType: RoomType = {
    id: '',
    name: '',
    description: '',
    price: 0,
    capacity: '',
    numberOfBeds: 1,
    image: '',
  };

  modoEdicion = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomTypeService: RoomTypeService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.modoEdicion = true;
      this.roomTypeService.getRoomType(id).subscribe({
        next: (data) => (this.roomType = data),
        error: (err) => console.error('Error al cargar roomtype', err),
      });
    }
  }

  guardar(): void {
    if (this.modoEdicion) {
      this.roomTypeService.updateRoomType(this.roomType.id, this.roomType).subscribe({
        next: () => this.router.navigate(['/roomtypes']),
        error: (err) => console.error('Error al actualizar el roomtype', err),
      });
    } else {
      this.roomTypeService.addRoomType(this.roomType).subscribe({
        next: () => this.router.navigate(['/roomtypes']),
        error: (err) => console.error('Error al crear el roomtype', err),
      });
    }
  }
}