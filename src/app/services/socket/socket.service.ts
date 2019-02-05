import { Injectable } from '@angular/core';
import { Socket } from 'ng-socket-io';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Observable } from 'rxjs';


@Injectable()
export class SocketService {

  constructor(
    private socket: Socket,
    private storage: LocalStorageService
  ) {
    socket.on('connect', () => {
      const token = this.storage.getItem('token');
      if (token) {
        this.sendMessage(
          'welcome-message',
          {
            userToken: token.token_session,
            idUser: token.id_user,
            status: 'READY',
            userType: 'OPERATOR'
          });  
      }
    });
  }

  public sendMessage(messageName: string, msg: any): void {
    this.socket.emit(messageName, msg);
  }

  public getMessage<T = any>(event: string): Observable<T> {
    return this.socket
      .fromEvent<T>(event);
  }

  public removeListener(event: string): void {
    this.socket.removeListener(event);
  }

}
