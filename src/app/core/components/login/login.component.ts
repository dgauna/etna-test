import { Component, OnInit } from '@angular/core';
import { Login } from '../../interfaces/login';
import { validationMsg } from '../../shared/validators';
import { Router } from '@angular/router';
import { LoginService } from '../../services/login/login.service';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';

type ValidationMessages = {
  [key: string]: { type: string, message: string }[]
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  validationMsg: ValidationMessages = validationMsg;
  mensaje: string=''
  constructor(private _logSvc: LoginService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
  }

  initForm() {
    return this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)]),
    });
  }
  getValidationMessage(controlName: string): any[] {
    const control = this.loginForm.get(controlName);
    let nombre = ''
    switch (controlName) {
      case "email":
        nombre = "email"
        break;
      case "password":
        nombre = "contraseña"
        break;
    }
    if (control) {
      const errorMessages: any[] = [];
      if (control.errors?.['required']) {
        errorMessages.push({ type: 'required', message: `El campo ${nombre} es obligatorio.` });
        return errorMessages;
      }
      for (const errorType in control.errors) {
        if (control.errors[errorType]) {
          if (this.validationMsg[controlName]) {
            const validationError = this.validationMsg[controlName].find(
              (msg) => msg.type === errorType
            );
            if (validationError) {
              errorMessages.push(validationError);
            }
          }
        }
      }
      return errorMessages;
    }
    return [];
  }

  onSubmit() {
    this.loginForm.markAllAsTouched()
    if (this.loginForm.invalid) {
      let errorShown = false;
      for (const controlName in this.loginForm.controls) {
        if (this.loginForm.controls[controlName].invalid && !errorShown) {
          const validationMessages = this.getValidationMessage(controlName);
          const control = this.loginForm.get(controlName);
          const errorTypes = Object.keys(control?.errors || {});
    
          for (const errorType of errorTypes) {
            const errorMessage = validationMessages.find(msg => msg.type === errorType);
    
            if (errorMessage) {
              this.mensaje = errorMessage.message;
              Swal.fire({
                title: 'Revise los datos ingresados',
                text: this.mensaje,
                icon: 'warning',
                focusConfirm: true,
                confirmButtonText: 'Aceptar',
                confirmButtonColor: '#5230FF',
                allowOutsideClick: false
              });
              errorShown = true; 
            }
          }
        }
      }
    } else {
      const login: Login = {
        email: this.loginForm.get('email')?.value,
        password: this.loginForm.get('password')?.value
      };

      this._logSvc.login(login).subscribe(
        (res) => {
          if (res.status === 200) {
            const data = res.body;
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('email', data.email);
            this.router.navigateByUrl('/home')
            const sessionTimeout = 90 * 60 * 1000;
            setTimeout(() => {
              this._logSvc.logout();
            }, sessionTimeout);
          }
        },
        (error) => {
          if (error) {
            Swal.fire({
              title: 'Revise los datos ingresados',
              icon: 'error',
              confirmButtonColor: '#5230FF',
              confirmButtonText: 'Aceptar',
              focusConfirm: true,
            });
          }
        }
      );
      
    }
  }
}
