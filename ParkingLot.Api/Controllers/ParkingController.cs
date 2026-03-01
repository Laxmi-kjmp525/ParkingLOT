using Microsoft.AspNetCore.Mvc;
using ParkingLot.Api.Domain.Entities;
using ParkingLot.Api.Domain.Interfaces;
using ParkingLot.Api.DTOs;
using ParkingLot.Api.Services;

namespace ParkingLot.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ParkingController : ControllerBase
{
    private readonly IParkingRepository _repo;
    private readonly ParkingAllocatorService _allocator;
    private readonly TicketService _ticketService;

    public ParkingController(
        IParkingRepository repo,
        ParkingAllocatorService allocator,
        TicketService ticketService)
    {
        _repo = repo;
        _allocator = allocator;
        _ticketService = ticketService;
    }

    [HttpPost("park")]
    public IActionResult Park([FromBody] ParkRequest request)
    {
        if (string.IsNullOrWhiteSpace(request.NumberPlate))
            return BadRequest("NumberPlate is required.");

        try
        {
            var vehicle = new Vehicle(request.NumberPlate.Trim(), request.VehicleType);

            var spot = _allocator.AllocateSpot(vehicle);
            if (spot == null)
                return Conflict("No parking spot available for this vehicle type.");

            var ticket = _ticketService.CreateTicket(vehicle, spot);

            return Ok(new
            {
                ticket.TicketId,
                ticket.NumberPlate,
                ticket.VehicleType,
                ticket.EntryTime,
                Spot = new { spot.Id, spot.Floor, spot.SpotType }
            });
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpPost("unpark/{ticketId}")]
    public IActionResult Unpark(string ticketId)
    {
        try
        {
            var ticket = _ticketService.CloseTicket(ticketId);
            _allocator.FreeSpot(ticket.SpotId);

            var durationMinutes = (ticket.ExitTime!.Value - ticket.EntryTime).TotalMinutes;

            return Ok(new
            {
                ticket.TicketId,
                ticket.NumberPlate,
                ticket.VehicleType,
                ticket.EntryTime,
                ticket.ExitTime,
                DurationMinutes = Math.Round(durationMinutes, 2),
                ticket.Amount,
                FreedSpotId = ticket.SpotId
            });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(ex.Message);
        }
        catch (Exception ex)
        {
            return BadRequest(ex.Message);
        }
    }

    [HttpGet("status")]
    public IActionResult Status()
    {
        var spots = _repo.GetAllSpots()
            .OrderBy(s => s.Floor)
            .ThenBy(s => s.Id)
            .Select(s => new
            {
                s.Id,
                s.Floor,
                s.SpotType,
                s.Status,
                CurrentVehicle = s.CurrentVehicle == null ? null : new
                {
                    s.CurrentVehicle.NumberPlate,
                    s.CurrentVehicle.Type
                }
            });

        return Ok(spots);
    }
}