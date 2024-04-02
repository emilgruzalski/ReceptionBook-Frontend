import { Customer } from "./customer.model";
import { Room } from "./room.model";

export interface Reservation{
    id: string;
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    customerName: string;
    roomNumber: string;

    room?: Room;
    customer?: Customer;
}