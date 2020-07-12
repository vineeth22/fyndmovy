import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../services/movie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-movie',
  templateUrl: './movie.component.html',
  styleUrls: ['./movie.component.css'],
})
export class MovieComponent implements OnInit {
  constructor(
    private route: ActivatedRoute,
    private movieService: MovieService,
    private location: Location,
    private modalService: NgbModal,
    private authService: AuthService
  ) {}

  dropdownSettings = {
    itemsShowLimit: 5,
  };
  movie = {
    _id: null,
    name: null,
    director: null,
    genre: [],
    '99popularity': null,
    imdb_score: null,
  };
  addMovie: boolean;
  genres;

  ngOnInit(): void {
    this.getMovie();
    this.getGenres();
  }
  getMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (!id) {
      this.addMovie = true;
      return;
    }
    this.movieService
      .getMovie(id)
      .subscribe(
        (movie: {
          _id: string;
          name: string;
          director: string;
          genre: [];
          '99popularity': number;
          imdb_score: number;
        }) => (this.movie = movie)
      );
  }
  getGenres(): void {
    this.movieService.getGenres().subscribe((genreList: [{ name: string }]) => {
      this.genres = genreList.map((genre) => genre.name);
    });
  }
  submit(): void {
    const stringInvalid = (str) => {
      return !str || typeof str !== 'string' || str.trim().length === 0;
    };
    if (
      stringInvalid(this.movie.name) ||
      stringInvalid(this.movie.director) ||
      this.movie.genre.length === 0 ||
      typeof this.movie.imdb_score !== 'number' ||
      typeof this.movie['99popularity'] !== 'number'
    ) {
      console.log('Invalid Data');
      return;
    }
    this.movie.name = this.movie.name.trim();
    this.movie.director = this.movie.director.trim();
    if (this.addMovie) {
      this.movieService
        .addMovie({
          name: this.movie.name,
          director: this.movie.director,
          genre: this.movie.genre,
          '99popularity': this.movie['99popularity'],
          imdb_score: this.movie.imdb_score,
        })
        .subscribe((response) => {
          console.log(response);
        });
    } else {
      this.movieService
        .updateMovie(this.movie._id, {
          name: this.movie.name,
          director: this.movie.director,
          genre: this.movie.genre,
          '99popularity': this.movie['99popularity'],
          imdb_score: this.movie.imdb_score,
        })
        .subscribe((response) => {
          console.log(response);
        });
    }
  }
  goBack(): void {
    this.location.back();
  }
  addGenre(genre) {
    const stringInvalid = (str) => {
      return !str || typeof str !== 'string' || str.trim().length === 0;
    };
    if (stringInvalid(genre)) {
      console.log('Invalid Data');
      return;
    }
    genre = genre.trim();
    this.movieService.addGenre(genre).subscribe((response) => {
      console.log(response);
    });
  }
  openModal(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title' }).result.then(
      (result) => {
        this.addGenre(result);
      },
      () => {}
    );
  }
}
