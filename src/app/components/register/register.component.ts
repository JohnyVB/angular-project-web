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
  public validarExtend: any;
  public file: any;
  public cpassword: any;
  public defaultUrl: any;
  public imageDefault: string;

  public errorOn: boolean;
  public errPass: boolean;
  public errEmail: boolean;
  public emailDupli: boolean;

  public parent: any;
  public evet: any;

  constructor(
    public _userService: UserService,
    public _router: Router
  ) {

    this.user = new User('', '', '', '', [], '', '', '', '', '', '', '');
    this.cpassword = '';

    this.errorOn = true;
    this.errPass = null;
    this.errEmail = null;
    this.emailDupli = null;
    this.imageDefault = 'default-user.png';
    this.defaultUrl = Global.url;

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
        
        if (this.file) {
          this.uploadimageUser(response.userStored._id);
        }
        
        Swal.fire(
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

  validatePassword() {
    if (this.cpassword === this.user.password) {
      this.errPass = false;
    } else {
      this.errPass = true;
    }
  }

  validateEmail(e: any) {

    const emailRegex = /^[-\w.%+]{1,64}@(?:[A-Z0-9-]{1,63}\.){1,125}[A-Z]{2,63}$/i;
    this.evet = e;

    if (emailRegex.test(this.user.email)) {
      this.errEmail = false;
      this._userService.getUserXEmail(this.user.email).subscribe(
        response => {

          if (response.emailOk) {
            this.emailDupli = false;
            this.evet.className = "form-control border-success ng-valid ng-dirty ng-touched";
          }else{
            this.emailDupli = true;
            this.evet.className = "form-control border-danger ng-valid ng-dirty ng-touched";
          }
  
        }
      );
    } else {
      this.errEmail = true;
    }
  }


  validate(e :any){

    this.parent = e.parentElement.lastChild;
    this.evet = e;
    
    if (!e.value) {
      this.parent.hidden = false;
      this.evet.className = "form-control border-danger ng-valid ng-dirty ng-touched";
    }else{
      this.parent.hidden = true;
      this.evet.className = "form-control border-success ng-valid ng-dirty ng-touched";
    }
  }

  validateEmty(){

    if (this.user.name != '' && this.user.lastname != '' && this.user.email != '' && this.user.user != '' && this.user.password != '' && this.cpassword != '') {
      this.errorOn = false;
    }else{
      this.errorOn = true;
    }
  }

}
