import {
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketGateway,
} from '@nestjs/websockets';
import { Socket } from 'socket.io';
import { GisMedicalService } from './gis-medical.service';

@WebSocketGateway({
  namespace: 'gis-medical',
})
export class GISMedicalGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  constructor(private gisMedicalService: GisMedicalService) {}

  handleConnection(socket: Socket) {
    this.gisMedicalService.handleConnection(socket);
  }

  handleDisconnect(socket: Socket) {
    this.gisMedicalService.handleDisconnection(socket);
  }
}
