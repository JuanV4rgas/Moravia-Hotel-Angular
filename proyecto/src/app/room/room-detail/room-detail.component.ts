import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Room } from 'src/app/model/room';
import { RoomService } from 'src/app/services/room.service';

@Component({
  selector: 'app-room-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './room-detail.component.html',
  styleUrls: ['./room-detail.component.css']
})
export class RoomDetailComponent implements OnInit {
  room?: Room;
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private roomService: RoomService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.error = 'ID de habitación no encontrado en la ruta.';
      return;
    }

    this.loading = true;
    this.roomService.getRoom(id).subscribe({
      next: (r) => { this.room = r; this.loading = false; },
      error: (err) => {
        this.error = 'No se pudo cargar la habitación.';
        console.error(err);
        this.loading = false;
      }
    });
  }

  volver(): void {
    this.router.navigate(['/room/table']);
  }
}
