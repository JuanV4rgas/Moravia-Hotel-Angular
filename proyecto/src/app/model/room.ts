import { RoomType } from './roomtype';

export interface Room {
  id: number;
  habitacionNumber: string;
  type: RoomType;
  available: boolean;
}
