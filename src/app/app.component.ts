import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { MenuItem } from 'primeng/api';
import Swal from 'sweetalert2';
import { LoginService } from './core/services/login/login.service';
import { TasksQueriesService } from './core/services/tasks/Queries/tasks-queries.service';
import { Pagination } from './core/interfaces/pagination';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  item!: MenuItem;
  email: string = ''
  title = 'etna-test';
  tasks: number = 0
  isLoginPage: boolean = false

  constructor(private router: Router, private logSvc: LoginService, private taskService: TasksQueriesService) {}
  ngOnInit() {
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {   
        this.isLoginPage = event.url.includes('/login') || event.url.includes('/register'); 

        if (!this.isLoginPage) {
      this.getTasks()
          
        }
      }
    });
      this.getDataUser()
  }

  getDataUser() {
    const data = localStorage.getItem('email')
    if (data !== null) {
      this.email = data
    }
  }

  getTasks() {
    const paginacion: Pagination = {
      page_size: 1,
      current_page: 1,
      completed: false
    }

    this.taskService.getAll(paginacion).subscribe((res) => {
      this.tasks = res.total_items
    })
    
  }

  logout() {
    Swal.fire({
      title: 'Cerrar Sesión',
      text: '¿Desea cerrar sesión?',
      icon: 'question',
      confirmButtonColor: '#5230FF',
      confirmButtonText: 'Aceptar',
      focusConfirm: true,
      showCancelButton: true,
      cancelButtonColor: 'red',
      cancelButtonText: 'Cancelar'
    }).then((confirm) => {
      if (confirm.isConfirmed) {
        this.logSvc.logout()
        this.router.navigateByUrl('/login')
      }
    })
  }
}
