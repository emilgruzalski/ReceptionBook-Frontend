export interface Reservation{
    id: string;
    startDate: Date;
    endDate: Date;
    status: string;
    totalPrice: number;
    customerName: string;
    roomNumber: string;
}