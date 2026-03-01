using ParkingLot.Api.Domain.Entities;
using ParkingLot.Api.Domain.Enums;
using ParkingLot.Api.Domain.Interfaces;

namespace ParkingLot.Api.Infrastructure.InMemory;

public class InMemoryParkingRepository : IParkingRepository
{
    private readonly Dictionary<int, ParkingSpot> _spots = new();
    private readonly Dictionary<string, Ticket> _tickets = new();
    private readonly object _lock = new();

    public InMemoryParkingRepository()
    {
        SeedSpots();
    }

    private void SeedSpots()
    {
        // 2 floors, 12 spots (you can change later)
        var spots = new List<ParkingSpot>
        {
            new() { Id=1, Floor=1, SpotType=SpotType.Small },
            new() { Id=2, Floor=1, SpotType=SpotType.Small },
            new() { Id=3, Floor=1, SpotType=SpotType.Medium },
            new() { Id=4, Floor=1, SpotType=SpotType.Medium },
            new() { Id=5, Floor=1, SpotType=SpotType.Medium },
            new() { Id=6, Floor=1, SpotType=SpotType.Large },

            new() { Id=7, Floor=2, SpotType=SpotType.Small },
            new() { Id=8, Floor=2, SpotType=SpotType.Small },
            new() { Id=9, Floor=2, SpotType=SpotType.Medium },
            new() { Id=10, Floor=2, SpotType=SpotType.Medium },
            new() { Id=11, Floor=2, SpotType=SpotType.Medium },
            new() { Id=12, Floor=2, SpotType=SpotType.Large },
        };

        foreach (var s in spots) _spots[s.Id] = s;
    }

    public IReadOnlyCollection<ParkingSpot> GetAllSpots()
        => _spots.Values.ToList();

    public ParkingSpot? GetSpotById(int spotId)
        => _spots.TryGetValue(spotId, out var s) ? s : null;

    public void UpdateSpot(ParkingSpot spot)
    {
        lock (_lock)
        {
            _spots[spot.Id] = spot;
        }
    }

    public Ticket SaveTicket(Ticket ticket)
    {
        lock (_lock)
        {
            _tickets[ticket.TicketId] = ticket;
            return ticket;
        }
    }

    public Ticket? GetTicket(string ticketId)
        => _tickets.TryGetValue(ticketId, out var t) ? t : null;

    public void UpdateTicket(Ticket ticket)
    {
        lock (_lock)
        {
            _tickets[ticket.TicketId] = ticket;
        }
    }

    public Ticket? GetActiveTicketByPlate(string numberPlate)
    {
        return _tickets.Values.FirstOrDefault(t =>
            t.NumberPlate.Equals(numberPlate, StringComparison.OrdinalIgnoreCase)
            && t.ExitTime == null);
    }
}