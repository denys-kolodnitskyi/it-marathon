using CSharpFunctionalExtensions;
using FluentValidation.Results;
using MediatR;
using RoomAggreagate = Epam.ItMarathon.ApiService.Domain.Aggregate.Room.Room;

namespace Epam.ItMarathon.ApiService.Application.UseCases.User.Queries
{
    /// <summary>
    /// Request for removal Users from Room.
    /// </summary>
    /// <param name="UserCode">User authorization code.</param>
    /// <param name="UserId">User's unique identifier.</param>
    public record DeleteUsersRequest(string UserCode, ulong? UserId)
        : IRequest<Result<RoomAggreagate, ValidationResult>>;
}