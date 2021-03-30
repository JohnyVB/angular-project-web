import { Component, OnInit, Input } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router'
import Swal from 'sweetalert2';


@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  providers: [UserService]
})
export class SidebarComponent implements OnInit {

  @Input() chapterOff: boolean;

  constructor(
    private _userService: UserService,
    private _router: Router
  ) {
    this.chapterOff = false;
  }

  ngOnInit(): void {
  }

  sendIdUser() {
    const token = this._userService.getToken();
    if (token) {
      this._router.navigate(['/newbook/']);
    } else {
      Swal.fire({
        title: 'No hay usuario logueado',
        text: 'Para poder utilizar esta funcion tiene que loguearse',
        icon: 'info'
      });

    }

  }

}
