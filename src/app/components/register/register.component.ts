import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { Router } from '@angular/router';
import { User } from '../../models/user';
import { Global } from "../../services/global";
import Swal from 'sweetalert2';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
  providers: [UserService]
})
export class RegisterComponent implements OnInit {

  public user: User;
  public url: any;
  public file: any;
  public password: string;
  public urlImage: string;

  public errorOn: boolean;

  constructor(
    public _userService: UserService,
    public _router: Router
  ) {

    this.password = null;
    this.url = Global.url;
    this.errorOn = true;
    this.urlImage = "https://res.cloudinary.com/dr0wxllnu/image/upload/v1615497606/backend-lector/default/default-user_bur2mh.png";
    this.user = new User('', '','' , '', '', '', null, null, '', null, null, null);

  }

  ngOnInit(): void {

  }

  mostrarImagen(event: any) {
    if (this.user.image != null) {

      if (event.target.files && event.target.files[0]) {
        let reader = new FileReader();

        reader.onload = (e: any) => {
          this.urlImage = e.target.result;
        }

        reader.readAsDataURL(event.target.files[0]);
      }
    }
  }

  getFile(files: FileList) {
    this.file = files.item(0);
  }

  registerUser() {

    this._userService.register(this.user).subscribe(
      response => {
        if (this.user.image) {
          this.uploadimageUser(response.usuario._id);
        }

        this._router.navigate(['/activatoruser/' + response.usuario.email]);

        // Swal.fire(
        //   'Se ha creado el usuario!!',
        //   'El usuario ha sido creado correctamente, por favor ir al boton Login para ingresar',
        //   'success'
        // );

        // this._router.navigate(['/home/']);
      },
      error => {
        console.log({error});
        
        Swal.fire(
          'Error al crear el usuario',
          'Por favor revisar el formulario',
          'error'
        );
      });
  }

  uploadimageUser(userId: any) {
    this._userService.uploadImageUser(this.file, userId).subscribe(
      response => {
      },
      error => {
        console.log('Error al guardar la imagen', error);

      }
    );
  }

  confirmPass(){
    if (this.password !== this.user.password) {
      this.errorOn = true;
    }else{
      this.errorOn = false;
    }
  }
}
