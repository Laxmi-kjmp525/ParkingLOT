using ParkingLot.Api.Domain.Enums;

namespace ParkingLot.Api.Domain.Entities;

public class Vehicle
{
    public string NumberPlate { get; }
    public VehicleType Type { get; }

    public Vehicle(string numberPlate, VehicleType type)
    {
        NumberPlate = numberPlate;
        Type = type;
    }
}