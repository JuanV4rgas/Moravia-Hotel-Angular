import { RoomType } from './reserva';

export interface Room {
  id?: number;
  habitacionNumber: string;
  available: boolean;
  type: RoomType;
}
