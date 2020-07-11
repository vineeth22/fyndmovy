import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { MovieService } from '../services/movie.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

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
    private modalService: NgbModal
  ) {}

  dropdownSettings = {
    itemsShowLimit: 5,
  };
  movie = {
    _id: '5f098de1825dc439d04ebef2',
    '99popularity': 83,
    director: 'Victor Fleming',
    genre: ['Adventure', 'Family', 'Fantasy', 'Musical'],
    imdb_score: 8.3,
    name: 'The Wizard of Oz',
  };
  genres;
  ngOnInit(): void {
    this.getMovie();
    this.getGenres();
  }
  getMovie(): void {
    const id = this.route.snapshot.paramMap.get('id');
    // this.movieService.getMovie(id).subscribe((movie) => (this.movie = movie));
  }
  getGenres(): void {
    this.movieService.getGenres().subscribe((genreList: [{ name: string }]) => {
      this.genres = genreList.map((genre) => genre.name);
    });
  }
  goBack(): void {
    this.location.back();
  }
  openModal(content) {
    this.modalService
      .open(content, { ariaLabelledBy: 'modal-basic-title' })
      .result.then((result) => {
        console.log(result);
      }, () => {});
  }
}
