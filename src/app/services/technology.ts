import { inject, Injectable, signal, effect, computed } from '@angular/core';
import { HttpClient, HttpErrorResponse, httpResource } from '@angular/common/http';
import { Technology } from '../models/technology';

@Injectable({
  providedIn: 'root'
})
export class TechnologyService {
  private apiUrl = 'http://localhost:3000/';
  private technologiesState = signal<Technology[]>([]);
  public technologies = this.technologiesState.asReadonly();

  private technologiesResource = httpResource<Technology[]>(() => this.apiUrl);

  public error = computed(() => this.technologiesResource.error() as HttpErrorResponse | null);
  public loading = computed(() => this.technologiesResource.isLoading());


  constructor() {
    effect(() => {
      const fetchedData = this.technologiesResource.value();
      if (fetchedData) {
        this.technologiesState.set(fetchedData);
      }
    });
  }

  getTechnologyByName(name: string): Technology | undefined {
    return this.technologiesState().find(tech => tech.name.toLowerCase() === name.toLowerCase());
  }

  addTechnology(technology: Technology) {
    this.technologiesState.update(allTechs => [...allTechs, technology]);
  }

  updateTechnology(updatedTech: Technology) {
    this.technologiesState.update(allTechs =>
      allTechs.map(tech => (tech.name === updatedTech.name ? updatedTech : tech))
    );
  }

  deleteTechnology(techName: string) {
    this.technologiesState.update(allTechs =>
      allTechs.filter(tech => tech.name !== techName)
    );
  }
}