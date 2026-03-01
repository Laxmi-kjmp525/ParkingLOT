using ParkingLot.Api.Domain.Enums;

namespace ParkingLot.Api.Domain.Entities;

public class ParkingSpot
{
    public int Id { get; set; }
    public int Floor { get; set; }
    public SpotType SpotType { get; set; }
    public SpotStatus Status { get; set; } = SpotStatus.Free;

    public Vehicle? CurrentVehicle { get; set; }
}