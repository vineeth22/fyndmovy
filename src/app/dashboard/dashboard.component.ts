import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { MovieService } from '../services/movie.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  constructor(private movieService: MovieService, private cd: ChangeDetectorRef) {}

  genres = {};
  movies;
  moviesCopy;
  sortBy = 'name';
  soryByList = ['name', 'director', '99popularity'];
  triggerGenreChange = true;

  ngOnInit() {
    this.movieService.getMovies().subscribe((movies) => {
      this.movies = movies;
      this.moviesCopy = movies;
    });
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
}
