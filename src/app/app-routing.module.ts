import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResultadoComponent } from './resultado/resultado.component';

const routes: Routes = [
  {path: 'resultado', component:ResultadoComponent},
  {path: ' ', redirectTo: 'resultado', pathMatch: 'full'},
  {path: '**', redirectTo: 'resultado', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
