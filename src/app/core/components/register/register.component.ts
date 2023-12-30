import { Component, OnInit } from '@angular/core';
import { UserRegister } from '../../interfaces/user';
import { validationMsg, soloLetras, espacios, passCoincidence } from '../../shared/validators';
import { Router } from '@angular/router';
import { UserService } from '../../services/user/user.service';
import { FormBuilder, FormControl, FormGroup, Validators, ValidatorFn } from '@angular/forms';
import Swal from 'sweetalert2';

type ValidationMessages = {
  [key: string]: { type: string, message: string }[]
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  validationMsg: ValidationMessages = validationMsg;
  mensaje: string=''
  val: any;
  showError: boolean = false
  showPassword = false;
  showPasswordConfirm = false;
  constructor(private _userSvc: UserService, private fb: FormBuilder, private router: Router) {}

  ngOnInit() {
    this.initForm();
    this.validarCoincidencia()
  }

  initForm() {
    const regex = /^(?=.*[!@#$%^&*()_+{}\[\]:;<>,.?/~\\-]).*(?=.*\d).*(?=.*[A-Z]).*$/
    return this.registerForm = new FormGroup({
      nombre: new FormControl('',[
        Validators.required,
        soloLetras,
        espacios]),
      apellido: new FormControl('',[Validators.required]),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(regex)]),
      confirmPassword: new FormControl('', [Validators.required, Validators.minLength(8), Validators.pattern(regex)]),
    }, { validators: [passCoincidence] });
  }

  validarCoincidencia() {
    this.registerForm.get('password')?.valueChanges.subscribe(() => {
      this.showValidationError()
    })
    this.registerForm.get('confirmPassword')?.valueChanges.subscribe(() => {
      this.showValidationError()
    })
  }

  togglePasswordVisibility(input: number) {
    if (input === 1) {
      this.showPassword = !this.showPassword
    } else if (input === 2) {
      this.showPasswordConfirm = !this.showPasswordConfirm
    }
  }

  getValidationMessage(controlName: string): any[] {
    const control = this.registerForm.get(controlName);
    let nombre = ''
    switch (controlName) {
      case "nombre":
        nombre = "nombre"
        break;
      case "apellido":
        nombre = "apellido"
        break;
      case "email":
        nombre = "email"
        break;
      case "password":
        nombre = "contraseña"
        break;
      case "confirmPassword":
        nombre = "confirmar contraseña"
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

  showValidationError() {
    const password = this.registerForm.get('password');
    const confirmPassword = this.registerForm.get('confirmPassword');
  
    const passwordsDoNotMatch = password?.value !== confirmPassword?.value;
    const noValidationErrors = !password?.hasError(this.val?.type) && !confirmPassword?.hasError(this.val?.type);
    const notDirtyOrTouched = !password?.dirty || !confirmPassword?.dirty;
    const notTouched = !password?.touched || !confirmPassword?.touched;
  
    this.showError = passwordsDoNotMatch || (noValidationErrors && notDirtyOrTouched && notTouched);
  }

  onSubmit() {
    this.registerForm.markAllAsTouched()
    if (this.registerForm.invalid) {
      let errorShown = false;
      for (const controlName in this.registerForm.controls) {
        if (this.registerForm.controls[controlName].invalid && !errorShown) {
          const validationMessages = this.getValidationMessage(controlName);
          const control = this.registerForm.get(controlName);
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
      const user: UserRegister = {
        first_name: this.registerForm.get('nombre')?.value,
        last_name: this.registerForm.get('apellido')?.value,
        email: this.registerForm.get('email')?.value,
        password: this.registerForm.get('password')?.value
      };

      this._userSvc.register(user).subscribe(
        (res) => {
          if (res.status === 200) {
            Swal.fire({
              title: 'Registro Exitoso',
              text: 'Usuario Creado con Éxito',
              icon: 'success',
              confirmButtonColor: '#5230FF',
              confirmButtonText: 'Aceptar',
              focusConfirm: true
            }).then((confirm) => {
              if (confirm.isConfirmed) {
                this.router.navigateByUrl('/login')
              }
            })
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
