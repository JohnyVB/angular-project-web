import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NotifyService } from "../../services/notify.service";
import { Notify } from '../../models/notify';


@Component({
  selector: 'app-notify',
  templateUrl: './notify.component.html',
  styleUrls: ['./notify.component.css'],
  providers: [NotifyService]
})
export class NotifyComponent implements OnInit {

  public userid: any;
  public notify: Notify[];

  constructor(
    private _notifyService: NotifyService,
    private _route: ActivatedRoute
  ) {
    this.notify = [];
  }

  ngOnInit(): void {
    this.getUserId();
  }

  getUserId() {
    this._route.params.subscribe(response => {
      this.userid = response.id;
      this.getNotify(response.id);
    });
  }

  getNotify(userid: any) {
    this._notifyService.getNotifys(userid).subscribe(
      response => {
        this.notify = response.notificacion;
      },
      error => {
        console.warn(error);
      });
  }

  alertNotify(notify: any) {

    if (notify.alert) {
      let update = {
        alert: false
      }

      this._notifyService.updateAlert(notify._id, update).subscribe(
        response => {
          this.getNotify(this.userid);
        },
        error => {
          console.log('Error al actualizar la notificación: ' + notify._id, error);
        }
      );
    }
  }

}
