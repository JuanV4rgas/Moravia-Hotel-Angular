import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { RoomType } from '../../model/roomtype';
import { RoomTypeService } from '../../services/roomtype.service';

@Component({
  selector: 'app-roomtype-list',
  templateUrl: './roomtype-list.component.html',
  styleUrls: ['./roomtype-list.component.css']
})
export class RoomtypeListComponent implements OnInit {
  roomtypes: RoomType[] = [];
  loading = true;

  constructor(private roomtypeService: RoomTypeService) {}

  ngOnInit() {
    this.roomtypeService.getAllRoomTypes().subscribe({
      next: (data: RoomType[]) => {
        this.roomtypes = data;
        this.loading = false;
      },
      error: (err: HttpErrorResponse) => {
        console.error('Error loading room types:', err);
        this.loading = false;
      }
    });
  }
}
