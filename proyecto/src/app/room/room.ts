import { Habitacion } from './../habitacion/habitacion';
export interface Room{
    id:number
    numeroHabitacion:string
    disponible:boolean
    tipo:Habitacion
}