using ParkingLot.Api.Domain.Enums;

namespace ParkingLot.Api.Services;

public class PricingService
{
    public decimal CalculateAmount(DateTime entry, DateTime exit, VehicleType type)
    {
        var totalMinutes = (exit - entry).TotalMinutes;
        if (totalMinutes < 0) totalMinutes = 0;

        var hours = (int)Math.Ceiling(totalMinutes / 60.0);
        if (hours == 0) hours = 1;

        var baseRate = type switch
        {
            VehicleType.Bike => 10m,
            VehicleType.Car => 20m,
            VehicleType.Truck => 30m,
            _ => 20m
        };

        if (hours == 1) return baseRate;

        return baseRate + (hours - 1) * (baseRate / 2);
    }
}