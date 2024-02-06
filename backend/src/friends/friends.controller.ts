
import { Controller, Post, Param, UseGuards, Request, NotFoundException, Get, ParseIntPipe, Delete, Req } from '@nestjs/common';
import { FriendsService } from './friends.service';
import { JwtAuthGuard } from '../auth/jwt/jwt-auth.guard';
import { AuthGuard } from '@nestjs/passport';
// import { JwtAuthGuard } from '../auth/jwt-auth.guard'; // You may need authentication to ensure the user is logged in

@Controller('friends')
export class FriendsController {
  constructor(private readonly friendsService: FriendsService) { }

  @Post('send-request/:friendId')
  async sendFriendRequest(
    @Param('friendId') friendId: number,
   
    @Request() req, 
  ): Promise<void> {
  
    const userId = req['id'];
    if (Number(userId) != Number(friendId)) {
      await this.friendsService.sendFriendRequest(Number(userId), Number(friendId));
    }
  }
  @Post('accept-friend-request/:requestId')
  async acceptFriendRequest(@Param('requestId') requestId: number, @Req() req) {
    try {
      await this.friendsService.acceptFriendRequest(Number(requestId), Number(req['id']));

      return { message: 'Friend request accepted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }
  @Post('blocked-friend-request/:requestId')
  async blockedfriends(@Param('requestId') requestId: number, @Param('id') id: number, @Req() req) {
    try {
      await this.friendsService.blockedfriends(Number(req['id']), Number(requestId));

      return { message: 'Friend request accepted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }
  @Post('refuse-friend-request/:requestId')
  async refuseFriendRequest(@Param('requestId') requestId: number) {
    try {
      await this.friendsService.refuseFriendRequest(requestId);
      return { message: 'Friend request refused successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw new NotFoundException(error.message);
      }
    }
  }
  
  @Get('accepted-friends/:userId')
  async getAcceptedFriends(
    @Param('userId', ParseIntPipe) userId: number,@Req() req
  ) {
    const friends = await this.friendsService.findFriendsByStatus(
      userId,
      'accepted',
    );
    return  friends;
  }
  @Get('/received-requests')
  async getReceivedFriendRequests(@Req() req) {
    if (Number(req['id']) > 0)
      return await this.friendsService.getReceivedFriendRequests(Number(req['id']));
    else
      return {}
  }
  @Get('/send-requests')
  async getSendFriendRequests(@Req() req) {
 
    if (Number(req['id']) > 0)
      return  await this.friendsService.getSendFriendRequests(Number(req['id']));
    else
      return {}
  }
  @Get('/received-blocked')
  async getReceivedFriendBlocked( @Req() req) {
    if (Number(req['id']) > 0)
      return  await this.friendsService.getReceivedFriendBlocked(Number(req['id']));
    else
      return {}
  }
  
  @Get('/send-blocked')
  async getSendFriendBlocked( @Req() req) {
    if (Number(req['id']) > 0)
      return await this.friendsService.getSendFriendblocked(Number(req['id']));
    else
      return {}
  }
  @Delete('delete-friend-request/:requestId')
  async deleteFriendRequest(@Param('requestId') requestId: number,  @Req() req) {
    
    return await this.friendsService.deleteFriendRequest(Number(requestId), Number(req['id']));
  }
  @Delete('Unblocked-friend/:requestId')
  async unblocked_friend(@Param('requestId') requestId: number,  @Req() req) {
    
    return  await this.friendsService.unblocked_friend(Number(requestId), Number(req['id']));
  }
  @Get('received/:receiverId')
  async getReceivedFriendRequests1(@Param('receiverId') receiverId: number) {
    return await this.friendsService.getReceivedFriendRequests1(receiverId);
  }
}
