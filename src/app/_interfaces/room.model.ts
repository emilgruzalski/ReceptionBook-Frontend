import { Reservation } from "./reservation.model";

export interface Room{
    id: string;
    number: string;
    type: string;
    price: number;

    reservations?: Reservation[];
}