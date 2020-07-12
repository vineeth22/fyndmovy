import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class MovieService {
  constructor(private http: HttpClient) {}
  private moviesUrl = 'http://localhost:3000/api/movies';

  getMovies() {
    return this.http.get(this.moviesUrl + '/getAllMovies');
  }

  getGenres() {
    return this.http.get(this.moviesUrl + '/getAllGenres');
  }

  getMovie(id) {
    return this.http.get(this.moviesUrl + '/getMovie/' + id);
  }
  addMovie(movie) {
    return this.http.post(this.moviesUrl + '/addMovie', movie);
  }
  updateMovie(id, movie) {
    return this.http.post(this.moviesUrl + '/updateMovie/' + id, movie);
  }
  addGenre(genre) {
    return this.http.post(this.moviesUrl + '/addGenre', { name: genre });
  }
}
