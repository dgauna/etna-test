import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { TaskReadModel } from 'src/app/core/interfaces/tasks';
import { Pagination } from 'src/app/core/interfaces/pagination';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TasksQueriesService {
  private apiUrl: string = `${environment.apiUrl}/Tasks`;
  task!: TaskReadModel
  constructor(private _http: HttpClient) { }


  getAll(paginacion: Pagination): Observable<any> {
    let params = new HttpParams()
      .set('page_size', paginacion.page_size.toString())
      .set('page_number', paginacion.current_page.toString())
      .set('completed', paginacion.completed.toString());

    if (paginacion.searchText) {
      params = params.set('search_text', paginacion.searchText);
    }

    return this._http.get(`${this.apiUrl}?${params.toString()}`);
  }

  getById(id: number) {
    return this._http.get<TaskReadModel>(`${this.apiUrl}/${id}`)
  }
}
