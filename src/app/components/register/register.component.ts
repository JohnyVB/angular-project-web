import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import swal from 'sweetalert';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public user: User;
  public validarExtend: any;
  public url: any;
  public errorOn: boolean;
  public file: any;

  constructor(
    public _userService: UserService,
    public _router: Router
  ) {

    this.user = new User('', '', '', '', [], '', '', '', '', '', '', '');

    this.errorOn = false;
  }

  ngOnInit(): void {
  }

  //-----------------------Validar y previsualizar imagen de usuario-------------------------------------------------
  validarImagen(event: any) {
    if (this.user.image != '') {
      let extend = this.user.image.split('.')[1];
      this.validarExtend = extend;

      console.log(this.validarExtend);

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = (e: any) => {
          this.url = e.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }


    }
  }

  //-----------------------Registro de usuario con token-------------------------------------------------
  registerUser() {
    this._userService.register(this.user).subscribe(
      response => {

        this._userService.setToken(response.userStored.token);
        this.uploadimageUser(response.userStored._id);

        swal(
          'Se ha creado el usuario!!',
          'El usuario ha sido creado correctamente, por favor ir al boton Login para ingresar',
          'success'
        );

        this._router.navigate(['/home/']);
      },
      error => {
        console.log(error);
      });
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
