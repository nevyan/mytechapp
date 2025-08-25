import { Routes } from '@angular/router';
import { TechnologyList } from './components/technology-list/technology-list';
import { CreateTechnology } from './create-technology/create-technology';
import { UpdateTechnology } from './components/update-technology/update-technology';
export const routes: Routes = [
  {
    path: 'technology-list',
    component: TechnologyList,
  },
  { path: '', redirectTo: '/technology-list', pathMatch: 'full' },
  {
    path: 'create',
    component: CreateTechnology,
  },
  {
    path: 'edit/:name', // use the technology name as unique ID
    component: UpdateTechnology,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full'
  }
];





