import { Component, OnInit } from '@angular/core';
import { MovieService } from '../services/movie.service';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private movieService: MovieService, private authService: AuthService) {
    this.authService.isLoggedIn.subscribe((value) => {
      this.isLoggedIn = value;
    });
  }
  isLoggedIn = false;
  genres = {};
  movies;
  moviesCopy;
  sortBy = 'name';
  soryByList = ['name', 'director', '99popularity'];
  triggerGenreChange = true;

  ngOnInit() {
    this.getMovies();
    this.getGenres();
  }
  getMovies(): void {
    this.movieService.getMovies().subscribe((movies) => {
      this.movies = movies;
      this.moviesCopy = movies;
    });
  }
  getGenres(): void {
    this.movieService.getGenres().subscribe((genreList: [{ name: string }]) => {
      genreList.forEach((genre) => {
        this.genres[genre.name] = false;
      });
    });
  }
  onSearch(value) {
    value = value.trim();
    if (value === '') {
      this.movies = this.moviesCopy;
      return;
    }
    this.movies = this.moviesCopy.filter(
      (movie) =>
        movie.name.toLowerCase() === value.toLowerCase() ||
        movie.director.toLowerCase() === value.toLowerCase()
    );
  }
  deleteMovie(id) {
    this.movieService.deleteMovie(id).subscribe((response: { message }) => {
      if (response.message === 'Success') this.getMovies();
    });
  }
}
