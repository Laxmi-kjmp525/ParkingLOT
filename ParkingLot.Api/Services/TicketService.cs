using ParkingLot.Api.Domain.Entities;
using ParkingLot.Api.Domain.Interfaces;

namespace ParkingLot.Api.Services;

public class TicketService
{
    private readonly IParkingRepository _repo;
    private readonly PricingService _pricing;

    public TicketService(IParkingRepository repo, PricingService pricing)
    {
        _repo = repo;
        _pricing = pricing;
    }

    public Ticket CreateTicket(Vehicle vehicle, ParkingSpot spot)
    {
        var existing = _repo.GetActiveTicketByPlate(vehicle.NumberPlate);
        if (existing != null)
            throw new InvalidOperationException("Vehicle already parked.");

        var ticket = new Ticket
        {
            NumberPlate = vehicle.NumberPlate,
            VehicleType = vehicle.Type,
            SpotId = spot.Id,
            EntryTime = DateTime.UtcNow
        };

        return _repo.SaveTicket(ticket);
    }

    public Ticket CloseTicket(string ticketId)
    {
        var ticket = _repo.GetTicket(ticketId);
        if (ticket == null)
            throw new KeyNotFoundException("Ticket not found.");

        if (ticket.ExitTime != null)
            throw new InvalidOperationException("Ticket already closed.");

        var exit = DateTime.UtcNow;
        ticket.ExitTime = exit;
        ticket.Amount = _pricing.CalculateAmount(ticket.EntryTime, exit, ticket.VehicleType);

        _repo.UpdateTicket(ticket);
        return ticket;
    }
}