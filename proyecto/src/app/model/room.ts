import { RoomType } from './roomtype';

export interface Room {
  id: string;
  habitacionNumber: string;
  type: RoomType;
  available: boolean;
}
