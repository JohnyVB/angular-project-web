import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { map } from 'rxjs/operators'

@Injectable({
  providedIn: 'root'
})
export class SocketIoService {

  constructor(private socket: Socket) {}

  sendMenssage(msg: string) {
    this.socket.emit('message', msg);
  }

  getMessage() {
    return this.socket.fromEvent('message').pipe(map((data) => data));
  }
}
