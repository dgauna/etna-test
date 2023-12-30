import { Component, OnInit } from '@angular/core';
import { TasksQueriesService } from '../../services/tasks/Queries/tasks-queries.service';
import { TasksCommandsService } from '../../services/tasks/Commands/tasksCommands.service';
import { Pagination } from '../../interfaces/pagination';
import { TaskReadModel } from '../../interfaces/tasks';
import { LoginService } from '../../services/login/login.service';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  tasks: any[] = []
  searchText: string = ''
  checked!: boolean;
  checkedArray: boolean[] = [];
  tareasSeleccionadas: any[] = [];
  tareaSeleccionadaIndex: number | null = null;
  filtroCompletado: boolean | null = null;

  paginacion: Pagination = {
    page_size:3,
    current_page: 1,
    completed: false,
    searchText: this.searchText
  }
  stateOptions: any

  ngOnInit(): void {
    this.filtroCompletado = false
    this.paginacion.page_size = 3
    this.getTasks(this.paginacion)
  }

  constructor(private taskSvc: TasksQueriesService, private taskCommandSvc: TasksCommandsService, private logSvc: LoginService) {
    this.stateOptions = [
      { label: 'Completas', value: true },
      { label: 'Incompletas', value: false }
    ]
  }

  filtrar() {
    if (this.filtroCompletado !== null) {
      this.paginacion = {
        current_page: 1,
        page_size: this.paginacion.page_size,
        completed: this.filtroCompletado
      }
      this.getTasks(this.paginacion)
    }
  }

  search() {
    this.paginacion.searchText = this.searchText
    this.getTasks(this.paginacion)
  }
  cargarMasTareas() {
    this.paginacion.page_size += 3
    this.getTasks(this.paginacion)
  }
  
  getTasks(paginacion: Pagination) {
    this.taskSvc.getAll(paginacion).subscribe((res) => {
      this.tasks = res.items
    })
  }

  fechaFormateada(fecha: string): string {
    const fechaObjeto = new Date(fecha);

    const dia = fechaObjeto.getDate().toString().padStart(2, '0');
    const mes = (fechaObjeto.getMonth() + 1).toString().padStart(2, '0');
    const anio = fechaObjeto.getFullYear();

    return `${dia}/${mes}/${anio}`;
  }

  horaFormateada(fecha: string): string {
    const fechaObjeto = new Date(fecha);

    const horas = fechaObjeto.getHours().toString().padStart(2, '0');
    const minutos = fechaObjeto.getMinutes().toString().padStart(2, '0');

    return `${horas}:${minutos}`;
  }

  
  onCheckboxChange(index: number) {
    this.checkedArray[index] = !this.checkedArray[index];
    if (this.checkedArray[index]) {
      this.tareaSeleccionadaIndex = index;
      this.tareasSeleccionadas.push(this.tasks[index]);
    } else {
      this.tareaSeleccionadaIndex = null;
      const indexToDelete = this.tareasSeleccionadas.findIndex(task => task === this.tasks[index]);
      if (indexToDelete !== -1) {
        this.tareasSeleccionadas.splice(indexToDelete, 1);
      }
    }
  }

  deleteTarea(id: number) {
    Swal.fire({
      title: 'Eliminar Tarea',
      text: '¿Desea eliminar esta tarea?',
      icon: 'question',
      focusConfirm: true,
      confirmButtonText: 'Aceptar',
      showCancelButton: true,
      cancelButtonText: 'Cancelar',
      cancelButtonColor: 'red',
      confirmButtonColor: '#5230FF',
      allowOutsideClick: false
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.taskCommandSvc.deleteTarea(id).subscribe((res) => {
          if (res.status === 200) {
            Swal.fire({
              title: '¡Tarea eliminada con éxito!',
              icon: 'success',
              focusConfirm: true,
              confirmButtonText: 'Aceptar',
              confirmButtonColor: '#5230FF',
              allowOutsideClick: false
            }).then((confirm) => {
              if (confirm.isConfirmed) {
                window.location.reload()
              }
            })
          }
        })
      }
    })
  }

  onSubmit() {
    if (this.tareasSeleccionadas.length === 0) {
      Swal.fire({
        title: 'Seleccione una tarea',
        text: 'Debe seleccionar la tarea para marcarla como completada',
        icon: 'warning',
        focusConfirm: true,
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#5230FF',
        allowOutsideClick: false
      })
    } else {
      if (this.tareasSeleccionadas.length === 1) {
        const id = this.tareasSeleccionadas[0].id
        Swal.fire({
          title: 'Completar Tarea',
          text: '¿Desea marcar esta tarea como completada?',
          icon: 'question',
          focusConfirm: true,
          confirmButtonText: 'Aceptar',
          confirmButtonColor: '#5230FF',
          allowOutsideClick: false
        }).then((confirm) => {
          if (confirm.isConfirmed) {
            this.taskCommandSvc.completed(id, true).subscribe((res) => {
              if (res.status === 200) {
                Swal.fire({
                  title: '¡Tarea completada con éxito!',
                  icon: 'success',
                  focusConfirm: true,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#5230FF',
                  allowOutsideClick: false
                }).then((confirm) => {
                  if (confirm.isConfirmed) {
                    window.location.reload()
                  }
                })
              } else {
                Swal.fire({
                  title: 'Ocurrio un problema',
                  icon: 'error',
                  focusConfirm: true,
                  confirmButtonText: 'Aceptar',
                  confirmButtonColor: '#5230FF',
                  allowOutsideClick: false
                })
              }
            })
          }
        })
      }
    }
  }
}
