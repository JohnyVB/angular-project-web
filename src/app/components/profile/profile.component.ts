import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { User } from '../../models/user';
import { UserService } from '../../services/user.service';
import { Global } from '../../services/global';
import { HeaderComponent } from '../header/header.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css'],
  providers: [UserService, HeaderComponent]
})
export class ProfileComponent implements OnInit {

  public user: User;
  public userUpdate: any;
  public url: string;
  public imgUrl: any;
  public validarExtend: any;
  public file: any;
  public userEdit: boolean;
 


  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private _HeaderComponent: HeaderComponent

  ) {

    this.url = Global.url;
    this.userEdit = false;

    this.user = new User('', '', '', '', [], '', '', '', '', null, '', '');
  }

  ngOnInit(): void {

    this._route.params.subscribe(params => {

      this._userService.getUserPopulateArticle(params.id).subscribe(response => {

        this.user = response.user;
        this.validarUsuario();

      },
        error => {
          console.log(error);

        });

    },
      error => {
        console.log('Error al obtener el id del usuario', error);

      });
    
  }

  validarUsuario() {

    this._userService.getUserLogged().subscribe(
      response => {

        if (this.user._id === response['user']._id) {
          this.userEdit = true;
        } else {
          this.userEdit = false;
        }

      },
      error => {
        console.log('No hay usuario logeado', error);
        this.userEdit = false;

      }
    );
  }
  editUser() {
    this._userService.updateUser(this.user._id, this.user).subscribe(
      response => {

        if (this.file != '' || this.file != null || this.file != undefined) {
          this.uploadimageUser(response.user._id);
        }
        
        console.log('Se ha editado el usuario correctamente!!');
        this.ngOnInit(); 
      },
      error => {
        console.log('Error al editar el usuario', error);

      }
    );
    this._HeaderComponent.ngOnInit();
    this.ngOnInit();
    var close = document.getElementById('close') as any;
    close.click();
  }

  validarImagen(event: any) {
    if (this.user.image != '') {
      let extend = this.user.image.split('.')[1];
      this.validarExtend = extend;

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = (e: any) => {
          this.imgUrl = e.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  getFile(files: FileList) {
    this.file = files.item(0);
  }

  uploadimageUser(userId: any) {
    this._userService.uploadImageUser(this.file, userId).subscribe(
      response => {
        console.log('La imagen se guardo con exito', response);
      },
      error => {
        console.log('Error al guardar la imagen', error);

      }
    );
  }






}
