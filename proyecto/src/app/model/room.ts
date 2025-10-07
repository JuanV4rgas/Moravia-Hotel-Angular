import { Habitacion } from "../habitacion/habitacion"

//import { Habitacion } from './../habitacion/habitacion';
export interface Room{
    id:string
    habitacionNumber:string
    type: Habitacion
    available:boolean
}