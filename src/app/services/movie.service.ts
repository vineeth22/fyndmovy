import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}
  private moviesUrl = 'http://localhost:3000/movies';

  getMovies() {
    return this.http.get(this.moviesUrl + '/getAllMovies');
  }

  getGenres() {
    return this.http.get(this.moviesUrl + '/getAllGenres');
  }
}
