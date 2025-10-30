// src/app/roomtype/roomtype-table/roomtype-table.component.ts
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { RoomTypeService } from 'src/app/services/roomtype.service';
import { RoomType } from '../../model/roomtype';

@Component({
  selector: 'app-roomtype-table',
  standalone: true,
  imports: [CommonModule, RouterModule],   // 👈 necesario para [routerLink]
  templateUrl: './roomtype-table.component.html',
  styleUrls: ['./roomtype-table.component.css']
})
export class RoomTypeTableComponent implements OnInit {
  roomtypes: RoomType[] = [];
  loading = false;
  error?: string;

  constructor(private service: RoomTypeService) {}
  ngOnInit(): void {
    this.loading = true;
    this.service.getAllRoomTypes().subscribe({
      next: (data) => { this.roomtypes = data; this.loading = false; },
      error: (err) => { this.error = `No se pudieron cargar los tipos (HTTP ${err?.status ?? '—'})`; this.loading = false; }
    });
  }

  eliminarRoomType(id: number): void {
    this.service.deleteRoomType(id).subscribe({
      next: () => this.roomtypes = this.roomtypes.filter(rt => rt.id !== id),
      error: (err) => console.error('Error al eliminar roomtype', err),
    });
  }
}
