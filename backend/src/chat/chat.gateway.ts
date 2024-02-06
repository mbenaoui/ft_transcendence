import { SubscribeMessage, WebSocketGateway } from '@nestjs/websockets';
import { Socket } from 'socket.io'
import { ChatService } from './chat.service';

@WebSocketGateway({
  cors: {
    origin: '*'
  }, namespace: 'ChatGateway'
})

export class ChatGateway {

  constructor(private chatService: ChatService) {
  }


  listId: Map<Socket, number> = new Map()

  handleConnection(client: Socket) {
    if (Number(client.handshake.query.userId) == 0)
      return
    this.listId.set(client, Number(client.handshake.query.userId))
    let a = this.listId.get(client)
  }

  handleDisconnect(client: Socket) {
    if (Number(client.handshake.query.userId) == 0)
      return
    this.listId.delete(client)
  }

  @SubscribeMessage('message')
  handleMessage(client: Socket, data: any) {
    this.listId.forEach((value, socket) => {
      if (value == data.receiverId || value == data.senderId)
        socket.emit('message', data)
    })
  }

  @SubscribeMessage('room')
  async handleRoom(client: Socket, data: any) {
    try {
      let people = await this.chatService.allUsersChannel(data.roomId)
      people.map((item) => {
        item.id
      })
      this.listId.forEach((value, socket) => {
        if (people.find((item) => item.id == value))
          socket.emit('message', data)
      })
    } catch (error) {
    }
  }
  @SubscribeMessage('updateConv')
  handlupdateConv(client: Socket, data: any) {
    this.listId.forEach((value, socket) => {
      if (value == data.participantId)
        socket.emit('updateConv', data)
    })
  }
}