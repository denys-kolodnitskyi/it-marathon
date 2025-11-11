using CSharpFunctionalExtensions;
using Epam.ItMarathon.ApiService.Application.UseCases.User.Queries;
using Epam.ItMarathon.ApiService.Domain.Abstract;
using Epam.ItMarathon.ApiService.Domain.Shared.ValidationErrors;
using FluentValidation.Results;
using MediatR;
using RoomAggreagate = Epam.ItMarathon.ApiService.Domain.Aggregate.Room.Room;

namespace Epam.ItMarathon.ApiService.Application.UseCases.User.Handlers
{
	/// <summary>
	/// Handler for Users removal request.
	/// </summary>
	/// <param name="roomRepository">Implementation of <see cref="IRoomRepository"/> for operating with database.</param>
	/// <param name="userRepository">Implementation of <see cref="IUserReadOnlyRepository"/> for operating with database.</param>
	public class DeleteUsersHandler(IRoomRepository roomRepository, IUserReadOnlyRepository userRepository)
        : IRequestHandler<DeleteUsersRequest, Result<RoomAggreagate, ValidationResult>>
    {
        /// <inheritdoc/>
        public async Task<Result<RoomAggreagate, ValidationResult>> Handle(DeleteUsersRequest request,
            CancellationToken cancellationToken)
        {
            // Check that user with code exists
            var userResult = await userRepository.GetByCodeAsync(request.UserCode, cancellationToken);
            if (userResult.IsFailure)
            {
				return Result.Failure<RoomAggreagate, ValidationResult>(new NotFoundError([
	                new ValidationFailure("userCode", "User with the specified userCode was not found.")
                ]));
			}

            // Get room by user code
            var roomResult = await roomRepository.GetByUserCodeAsync(request.UserCode, cancellationToken);
            if (roomResult.IsFailure)
            {
                return roomResult;
            }

			// Check that the user is admin
			var user = userResult.Value;
			var room = roomResult.Value;
			if (!room.IsAdmin(user))
			{
				return Result.Failure<RoomAggreagate, ValidationResult>(new NotAuthorizedError([
					new ValidationFailure("userCode", "User does not have administrative privileges to perform this action.")
				]));
			}

			// Check that user is not trying to delete himself
			if (user.Id == request.UserId)
			{
				return Result.Failure<RoomAggreagate, ValidationResult>(new BadRequestError([
					new ValidationFailure("userId", "An administrator cannot remove themselves from the room.")
				]));
			}

			// Delete user by id in room's users
			var deletingResult = room.DeleteUser(request.UserId);
			if (deletingResult.IsFailure)
			{
				return deletingResult;
			}

			// Update room in repository
			var updatingRoomResult = await roomRepository.UpdateAsync(room, cancellationToken);
			if (updatingRoomResult.IsFailure)
			{
				return Result.Failure<RoomAggreagate, ValidationResult>(new BadRequestError([
					new ValidationFailure(string.Empty, updatingRoomResult.Error)
				]));
			}

			// Get updated room
			var updatedRoomResult = await roomRepository.GetByUserCodeAsync(request.UserCode, cancellationToken);
            return updatedRoomResult;
        }
    }
}