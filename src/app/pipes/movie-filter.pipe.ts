import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'movieFilter',
})
export class MovieFilterPipe implements PipeTransform {
  transform(movies: [{ genre: [] }], genres, sortBy, triggerGenreChange) {
    try {
      const allCheck = Object.keys(genres).every((genre) => genres[genre] === false);
      return movies
        .filter(
          (movie) =>
            allCheck ||
            movie.genre.reduce((acc, gen) => {
              return acc || genres[gen];
            }, false)
        )
        .sort((a, b) => {
          return sortBy === '99popularity'
            ? a[sortBy] > b[sortBy]
              ? -1
              : 1
            : a[sortBy] > b[sortBy]
            ? 1
            : -1;
        });
    } catch (err) {
      return [];
    }
  }
}
