import { Reservation } from "./reservation.model";

export interface Customer{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;

    reservations?: Reservation[]
}