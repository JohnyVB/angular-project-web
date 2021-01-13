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

  public userid:any;
  public notify: Notify[];

  constructor(
    private _notifyService: NotifyService,
    private _route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.getUserId();
    this.getNotify(this.userid);
  }

  getUserId(){
    this._route.params.subscribe((params) => {
      this.userid = params.id;
    });
  }

  getNotify(userid:any){
    this._notifyService.getNotify(userid).subscribe(
      response => {
        this.notify = response.user.notify;                
      },
      error => {
        console.warn('Error al traer las notificaciones');
        
      });
  }

  alertNotify(notify:any){

    if (notify.alert) {
      let update = {
        alert: false
      }

      this._notifyService.updateAlert(notify._id, update).subscribe(
        response => {
          
          this.ngOnInit();
        },
        error => {
          console.log('Error al actualizar la notificación: ' + notify._id, error); 
        }
      );
    }
  }

}
