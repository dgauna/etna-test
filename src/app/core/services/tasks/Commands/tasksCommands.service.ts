import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, catchError, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { TaskWriteModel } from '../../../interfaces/tasks';

@Injectable({
  providedIn: 'root'
})
export class TasksCommandsService {
  private apiUrl: string = `${environment.apiUrl}/Tasks`;
  task!: TaskWriteModel
  constructor(private _http: HttpClient) { }

  create(value: TaskWriteModel) {
    return this._http.post<any>(`${this.apiUrl}`, value).pipe(
      tap((res) => {
        this.task = res;
      })
    ).pipe(
      catchError((error) => {
        return error
      })
    )
  }

  update(value: TaskWriteModel) {
    return this._http.put<any>(`${this.apiUrl}`, value, { observe: 'response' });
  }

  completed(id: number, is_completed: boolean) {
    const task = {
      id: id,
      is_completed: is_completed
    }
    return this._http.put<any>(`${this.apiUrl}/status`, task, {observe: 'response'})
  }

  deleteTarea(id: number) {
    return this._http.delete<any>(`${this.apiUrl}/${id}`, {observe: 'response'})
  }
  
}
