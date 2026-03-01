using ParkingLot.Api.Domain.Entities;

namespace ParkingLot.Api.Domain.Interfaces;

public interface IParkingRepository
{
    IReadOnlyCollection<ParkingSpot> GetAllSpots();
    ParkingSpot? GetSpotById(int spotId);
    void UpdateSpot(ParkingSpot spot);

    Ticket SaveTicket(Ticket ticket);
    Ticket? GetTicket(string ticketId);
    void UpdateTicket(Ticket ticket);

    Ticket? GetActiveTicketByPlate(string numberPlate);
}