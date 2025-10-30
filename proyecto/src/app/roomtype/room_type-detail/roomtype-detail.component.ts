import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RoomType } from '../../model/roomtype';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-roomtype-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './roomtype-detail.component.html',
  styleUrls: ['./roomtype-detail.component.css']
})
export class RoomTypeDetailComponent implements OnInit {
  @Input() roomtype?: RoomType;   // si te lo pasan desde otro componente
  loading = false;
  error?: string;

  constructor(
    private route: ActivatedRoute,
    private service: RoomTypeService
  ) {}

  ngOnInit(): void {
    // Si ya viene por @Input, no busques por id
    if (this.roomtype) return;

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) return;

    this.loading = true;
    this.service.getRoomType(id).subscribe({
      next: (rt) => { this.roomtype = rt; this.loading = false; },
      error: (err) => {
        this.error = `No se pudo cargar el RoomType (HTTP ${err?.status ?? '—'})`;
        this.loading = false;
      }
    });
  }
}
