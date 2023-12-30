import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { catchError } from 'rxjs';
import { environment } from '../../environments/environment';
import { Categories } from '../../interfaces/categories';
@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private apiUrl: string = `${environment.apiUrl}/Categories`;
  constructor(private _http: HttpClient) { }

  getCategories() {
    return this._http.get<Categories[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Error fetching categories:', error);
        throw error; 
      })
    );
  }
}
