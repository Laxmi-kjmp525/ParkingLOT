using ParkingLot.Api.Domain.Entities;
using ParkingLot.Api.Domain.Enums;
using ParkingLot.Api.Domain.Interfaces;

namespace ParkingLot.Api.Services;

public class ParkingAllocatorService
{
    private readonly IParkingRepository _repo;

    public ParkingAllocatorService(IParkingRepository repo)
    {
        _repo = repo;
    }

    public ParkingSpot? AllocateSpot(Vehicle vehicle)
    {
        var all = _repo.GetAllSpots();

        bool IsCompatible(SpotType spotType, VehicleType vType) => vType switch
        {
            VehicleType.Bike => true,
            VehicleType.Car => spotType is SpotType.Medium or SpotType.Large,
            VehicleType.Truck => spotType is SpotType.Large,
            _ => false
        };

        var spot = all
            .Where(s => s.Status == SpotStatus.Free && IsCompatible(s.SpotType, vehicle.Type))
            .OrderBy(s => s.Floor)
            .ThenBy(s => s.Id)
            .FirstOrDefault();

        if (spot == null) return null;

        spot.Status = SpotStatus.Occupied;
        spot.CurrentVehicle = vehicle;
        _repo.UpdateSpot(spot);

        return spot;
    }

    public void FreeSpot(int spotId)
    {
        var spot = _repo.GetSpotById(spotId);
        if (spot == null) return;

        spot.Status = SpotStatus.Free;
        spot.CurrentVehicle = null;
        _repo.UpdateSpot(spot);
    }
}