export interface ReservationForCreation {
    startDate: Date;
    endDate: Date;
    totalPrice: number;
    customerId: string;
    roomId: string;
}