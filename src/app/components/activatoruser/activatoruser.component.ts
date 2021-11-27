import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { UserService } from 'src/app/services/user.service';
import { FormBuilder, FormGroup, FormControl, Validators} from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-activatoruser',
  templateUrl: './activatoruser.component.html',
  styleUrls: ['./activatoruser.component.css'],
  providers: [UserService]
})
export class ActivatoruserComponent implements OnInit {

  public form: FormGroup;
  public email: string;

  public validationData = {
    email: '',
    code: ''
  }

  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _userService: UserService,
    private fb: FormBuilder
  ) { 
    this.form = fb.group({
      code: ['', [Validators.required, Validators.pattern("^[0-9]*$"), Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit(): void {
    this.getparams();
  }

  getparams() {
    this._route.params.subscribe(
      response => {
        this.email = response.email;
      },
      error => {
        console.log('Error al traer el email de validación');
      }
    );
  }

  validateUser(){
    this._userService.validateCode(this.email, this.form.value.code).subscribe(
      response => {
        Swal.fire(
          'Validación',
          'Se ha activado su cuenta, ya puede ingresar',
          'success'
        );
        this._router.navigate(['/home']);
      },
      error => {
        Swal.fire(
          'Error',
          'El codigo de validación que ingreso es incorrecto',
          'error'
        );
      }
    );
  }



}
