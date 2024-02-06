// friends.service.ts

import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { User } from '@prisma/client';
import { ChatService } from '../chat/chat.service';
@Injectable()
export class FriendsService {
  constructor(private readonly prisma: PrismaService,private chatService: ChatService) { }

  async sendFriendRequest(seenderId: number, reeceiverId: number): Promise<void> {
    // Check if the friendship already exists (optional)
    const existingFriendship = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: seenderId,
        receiverId: reeceiverId,
      },
    });
    const existingFriendship1 = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: reeceiverId,
        receiverId: seenderId,
      },
    });
    if (!existingFriendship && !existingFriendship1) {
      // Create a friend request in the database
      await this.prisma.friendRequest.create({
        data: {
          senderId: seenderId,
          receiverId: reeceiverId,
          status: 'pending', // You can set a status to track the request (e.g., 'pending', 'accepted', 'rejected')
        },
      });
  

    }
  }

  async blockedfriends(seenderId: number, reeceiverId: number): Promise<void> {
    // Check if the friendship already exists (optional)
    let status;
    const existingFriendship = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: seenderId,
        receiverId: reeceiverId,
      },
    });
    const existingFriendship1 = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: reeceiverId,
        receiverId: seenderId,
      },
    });
  
      if (!existingFriendship && !existingFriendship1) {
        this.chatService.blockChatTwoUser(Number(seenderId), Number(reeceiverId))
              await this.prisma.friendRequest.create({
          data: {
            senderId: seenderId,
            receiverId: reeceiverId,
            status: 'blocked', 
          },
        });
      }
      else  {
         if(existingFriendship)
          status = existingFriendship.status;
        else 
          status = existingFriendship1.status;
        if(status != 'blocked')
        {
       this.chatService.blockChatTwoUser(Number(seenderId), Number(reeceiverId))
      const friendRequest = await this.prisma.friendRequest.findFirst({
        where: {
          senderId: seenderId,
          receiverId: reeceiverId,
        },
        include: {
          sender: true, // Include the sender of the request
          receiver: true, // Include the receiver of the request
        },
      });
      const friendRequest1 = await this.prisma.friendRequest.findFirst({
        where: {
          senderId: reeceiverId,
          receiverId: seenderId
        },
        include: {
          sender: true, // Include the sender of the request
          receiver: true, // Include the receiver of the request
        },
      });
      if (friendRequest && friendRequest.status != 'blocked') {
        
        await this.prisma.friendRequest.update({
          where: {
            id: friendRequest.id,
          },
          data: {
            status: 'blocked',
          },
        });
      }
      else if (friendRequest1) {
        
        await this.prisma.friendRequest.delete({
          where: {
            id: friendRequest1.id,
          }
        });
        await this.prisma.friendRequest.create({
          data: {
            senderId: seenderId,
            receiverId: reeceiverId,
            status: 'blocked', // You can set a status to track the request (e.g., 'pending', 'accepted', 'rejected')
          },
        })
      
       
      }
    }

    else
    {
     
      throw new NotFoundException('Friend request not found or already blocked.');
    }

    }
  }

  async acceptFriendRequest(requestId: number, sendId: number): Promise<void> {
    const friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: requestId,
        receiverId: sendId,
      },
      include: {
        sender: true, 
        receiver: true, 
      },

    });

    if (!friendRequest || friendRequest.status !== 'pending') {
      throw new NotFoundException('Friend request not found or already accepted/rejected.');
    }
    await this.prisma.friendRequest.update({
      where: {
        id: friendRequest.id,
      },
      data: {
        status: 'accepted',
      },
    });
    await this.prisma.user.update({
      where: {
        id: friendRequest.sender.id,
      },
      data: {
        friends: {
          connect: [{ id: friendRequest.receiver.id }], 
        },
      },
    });

    await this.prisma.user.update({
      where: {
        id: friendRequest.receiver.id,
      },
      data: {
        friends: {
          connect: [{ id: friendRequest.sender.id }], // Connect receiver and sender as friends
        },
      },
    });
  }
  async refuseFriendRequest(requestId: number): Promise<void> {
    // Check if the friend request exists and is pending
    const friendRequest = await this.prisma.friendRequest.findUnique({
      where: {
        id: requestId,
      },
    });


    if (!friendRequest || friendRequest.status !== 'pending') {
      throw new NotFoundException('Friend request not found or already accepted/rejected.');
    }

    // Update the friend request status to 'rejected'
    await this.prisma.friendRequest.update({
      where: {
        id: requestId,
      },
      data: {
        status: 'rejected',
      },
    });
  }
  // friends.service.ts

  async findFriendsByStatus(userId: number, status: string): Promise<User[]> {
    // Find all friend requests with the specified status where the user is either the sender or the receiver
    const friendRequests = await this.prisma.friendRequest.findMany({
      where: {
        status,
        OR: [
          {
            senderId: userId,
          },
          {
            receiverId: userId,
          },
        ],
      },
    });

    // Extract user IDs from the friend request records
    const friendUserIds = friendRequests.flatMap((request) => [
      request.senderId === userId ? request.receiverId : request.senderId,
    ]);
    
    // Fetch the user records for the friendUserIds
    const friendUsers = await this.prisma.user.findMany({
      where: {
        id: {
          in: friendUserIds,
        },
      },
    });
    
    return friendUsers;
  }
  async getReceivedFriendRequests(userId: number, status: string = 'pending') {
    const data_rese = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        receivedFriendRequests: {
          where: {
            status: status,
          },
          select: {
            id: false,
            status: false,
            sender: {
              select:
              {
                id: true,
                username: true,
                foto_user: true, // Include any fields you need from the sender
                // Add other fields as needed
              },
            },
            // Add other fields from the FriendRequest model as needed
          },

        },
      },
    });
    return data_rese.receivedFriendRequests
  }
  async getReceivedFriendBlocked(userId: number, status: string = 'blocked') {
    
    const data_rese = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        receivedFriendRequests: {
          where: {
            status: status,
          },
          select: {
            id: false,
            status: false,
            sender: {
              select:
              {
                id: true,
                username: true,
                foto_user: true, // Include any fields you need from the sender
                // Add other fields as needed
              },
            },
            // Add other fields from the FriendRequest model as needed
          },

        },
      },
    });

    return data_rese.receivedFriendRequests
  }

  async getReceivedFriendRequests1(receiverId: number) {
    return this.prisma.friendRequest.findMany({
      where: {
        receiverId,
        status: 'pending', // You can adjust this to match your data model
      },
      // You can include other options like selecting specific fields or sorting.
    });
  }

  async getSendFriendRequests(userId: number, status: string = 'pending') {
    const data_rese = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentFriendRequests: {
          where: {
            status: status,
          },
          select: {
            id: false,
            status: false,
            receiver: {
              select:
              {
                id: true,
                username: true,
                foto_user: true,
              },
            },

          },
        },
      },
    });
    return data_rese.sentFriendRequests
  }
  async getSendFriendblocked(userId: number, status: string = 'blocked') {
    const data_rese = await this.prisma.user.findUnique({
      where: { id: userId },
      include: {
        sentFriendRequests: {
          where: {
            status: status,
          },
          select: {
            id: false,
            status: false,
            receiver: {
              select:
              {
                id: true,
                username: true,
                foto_user: true,
              },
            },

          },
        },
      },
    });
    return data_rese.sentFriendRequests
  }

  async deleteFriendRequest(requestId: number, sendId: number) {
    let friendRequest = await this.prisma.friendRequest.findFirst({
      where: {
        senderId: requestId,
        receiverId:sendId ,
      },
      include: {
        sender: true, // Include the sender of the request
        receiver: true, // Include the receiver of the request
      },
    });
    if(!friendRequest)
    {
      friendRequest = await this.prisma.friendRequest.findFirst({
        where: {
          senderId: sendId,
          receiverId:requestId ,
        },
        include: {
          sender: true, // Include the sender of the request
          receiver: true, // Include the receiver of the request
        },
      });
    }
  
    if (!friendRequest || (friendRequest.status !== 'pending' && friendRequest.status !== 'blocked')) {
      throw new NotFoundException('Friend request not found or already accepted/rejected.');
    }
    this.chatService.unblockChatTwoUser(Number(sendId), Number(requestId))
    await this.prisma.friendRequest.delete({
      where: {
        id: friendRequest.id
      },
    });
  }
  async unblocked_friend(requestId: number, sendId: number) {
    const friendRequest = await this.prisma.friendRequest.findFirst({
        where: {
          senderId: sendId,
          receiverId:requestId ,
        },
        include: {
          sender: true, // Include the sender of the request
          receiver: true, // Include the receiver of the request
        },
      });
    
  
    if (!friendRequest || (friendRequest.status !== 'blocked')) {
      throw new NotFoundException('Friend request not found or already accepted/rejected.');
    }
    this.chatService.unblockChatTwoUser(Number(sendId), Number(requestId))
    await this.prisma.friendRequest.delete({
      where: {
        id: friendRequest.id
      },
    });
  }
  async CheckIfUserBlock(userId:number){
     const  status = "blocked"
    const existingFriendship = await this.prisma.friendRequest.findMany({
      where: {
        senderId: userId,
        status: status,
         
       
        // receiverId: OpponentId,
      },
      select:
      {
        senderId: true,
        receiverId : true
      }
    
    });
    const existingFriendship1 = await this.prisma.friendRequest.findMany({
      where: {
        status: status,
        receiverId: userId,
      },
      select:
      {
        senderId: true,
        receiverId : true
      }
    
    });
    let list:Array<any> = []
    existingFriendship.map((item)=>{
      list.push(item.receiverId)
      list.push(item.senderId)
    })
    existingFriendship1.map((item)=>{
      list.push(item.senderId)
      list.push(item.receiverId)
    })
    let filteredNumbers = list.filter((num) => num !== userId);
    return filteredNumbers
    // return existingFriendship.push(existingFriendship1)
  // if(existingFriendship && existingFriendship1 )
  // if(existingFriendship  )
  //   return existingFriendship;
  // if(existingFriendship1 )
  //   return existingFriendship1;
  }

}