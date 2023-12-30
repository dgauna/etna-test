import { Component, OnInit } from '@angular/core';
import { Categories } from 'src/app/core/interfaces/categories';
import { CategoriesService } from 'src/app/core/services/categories/categories.service';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { TasksCommandsService } from 'src/app/core/services/tasks/Commands/tasksCommands.service';
import { ActivatedRoute } from '@angular/router';
import { TaskWriteModel } from 'src/app/core/interfaces/tasks';
import { prioridad, espacios, soloLetras, validationMsg } from 'src/app/core/shared/validators';
import Swal from 'sweetalert2';
import { Router } from '@angular/router';
type ValidationMessages = {
  [key: string]: { type: string, message: string }[]
}

@Component({
  selector: 'app-create-task',
  templateUrl: './create-task.component.html',
  styleUrls: ['./create-task.component.scss']
})
export class CreateTaskComponent implements OnInit {
  taskForm!: FormGroup;
  categoriesList: Categories[] = []
  validationMsg: ValidationMessages = validationMsg;
  mensaje: string = ''
  taskId: number = 0
  categoriaId: number = 0;
  constructor(
    private categoriesSvc: CategoriesService, 
    private taskSvc: TasksCommandsService,
    private router: Router,
    private route:ActivatedRoute
  ) {}
  ngOnInit(): void {
    this.loadCategories()
    this.initForm();
  }

  initForm() {
    return this.taskForm = new FormGroup({
      tarea: new FormControl('', [
        Validators.required,
        Validators.maxLength(50),
        soloLetras,
        espacios
      ]),
      prioridad: new FormControl('', [
        Validators.required,
        prioridad
      ]),
      categoria: new FormControl('', [Validators.required]),
      descripcion: new FormControl('', [
        Validators.required,
        Validators.maxLength(500),
        espacios
      ])
    });
  }

  loadCategories() {
    this.categoriesSvc.getCategories().subscribe(
      (res) => {
        this.categoriesList = res;
      },
      (error) => {
        console.error('Error loading categories in component:', error);
      }
    );
  }

  selectCategoria(event: any) {
    const categoria = event.value
    this.categoriaId = categoria.id
  }
  getValidationMessage(controlName: string): any[] {
    const control = this.taskForm.get(controlName);
    let nombre = ''
    switch (controlName) {
      case "tarea":
        nombre = "tarea"
        break;
      case "prioridad":
        nombre = "prioridad"
        break;
      case "descripcion":
        nombre = "descripción"
        break;
      case "categoria":
        nombre = "categoría"
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
    this.taskForm.markAllAsTouched()
    if (this.taskForm.invalid) {
      let errorShown = false;
      for (const controlName in this.taskForm.controls) {
        if (this.taskForm.controls[controlName].invalid && !errorShown) {
          const validationMessages = this.getValidationMessage(controlName);
          const control = this.taskForm.get(controlName);
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
      const task: TaskWriteModel = {
        title: this.taskForm.get('tarea')?.value,
        description: this.taskForm.get('descripcion')?.value,
        priority: this.taskForm.get('prioridad')?.value,
        category_id: this.categoriaId
      }
      this.taskSvc.create(task).subscribe((res) => {
        if (res) {
          Swal.fire({
            title: 'Tarea creada con éxito',
            icon: 'success',
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#5230FF',
            allowOutsideClick: false
          }).then((confirm) => {
            if (confirm.isConfirmed) {
              this.router.navigateByUrl('/home')
            }
          })
        } else {
          Swal.fire({
            title: 'Ocurrió un problema',
            icon: 'error',
            focusConfirm: true,
            confirmButtonText: 'Aceptar',
            confirmButtonColor: '#5230FF',
          })
        }
      })
    }
  }

  goBack() {
    if (this.taskForm.pristine) {
      Swal.fire({
        title: 'Regresar',
        icon: 'question',
        text: '¿Desea regresar al listado? Al no guardar los cambios realizados estos se perderan',
        focusConfirm: true,
        showCancelButton: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5230FF',
        cancelButtonText: 'Cancelar',
        cancelButtonColor: 'red'
      }).then((confirm) => {
        if (confirm.isConfirmed) {
          this.router.navigateByUrl('/home')
        }
      })
    } else {
      this.router.navigateByUrl('/home')
    }

  }
}
