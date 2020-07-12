import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DashboardComponent } from './dashboard/dashboard.component';
import { MovieComponent } from './movie/movie.component';
import { LogsComponent } from './logs/logs.component';

const routes: Routes = [
  { path: '', component: DashboardComponent },
  { path: 'movie/:id', component: MovieComponent },
  { path: 'newmovie', component: MovieComponent },
  { path: 'logs', component: LogsComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
