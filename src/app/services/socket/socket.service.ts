import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { LocalStorageService } from '../local-storage/local-storage.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';


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
            userToken: token.token_session
          });  
      }
    });
  }

  public sendMessage(messageName: string, msg: any): void {
    this.socket.emit(messageName, msg);
  }

  public getMessage(event: string): Observable<any> {
    return this.socket
      .fromEvent(event);
  }

  public removeListener(event: string): void {
    this.socket.removeListener(event);
  }

}
