using ParkingLot.Api.Domain.Enums;

namespace ParkingLot.Api.DTOs;

public class ParkRequest
{
    public string NumberPlate { get; set; } = "";
    public VehicleType VehicleType { get; set; }
}