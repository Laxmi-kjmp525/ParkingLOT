using ParkingLot.Api.Domain.Enums;

namespace ParkingLot.Api.Domain.Entities;

public class Ticket
{
    public string TicketId { get; set; } = Guid.NewGuid().ToString("N");
    public string NumberPlate { get; set; } = "";
    public VehicleType VehicleType { get; set; }
    public int SpotId { get; set; }

    public DateTime EntryTime { get; set; } = DateTime.UtcNow;
    public DateTime? ExitTime { get; set; }
    public decimal? Amount { get; set; }
}