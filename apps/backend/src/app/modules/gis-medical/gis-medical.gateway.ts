import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { GisMedicalService } from './services';
import { Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'gis-medical',
})
export class GISMedicalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gisMedicalService: GisMedicalService) {}

  handleConnection(socket: Socket) {
    this.gisMedicalService.handleConnectSocket(socket);
  }

  handleDisconnect(socket: Socket) {
    this.gisMedicalService.handleDisconnectSocket(socket);
  }
}
