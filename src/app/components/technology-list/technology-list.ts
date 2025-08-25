import { Component, computed, inject, signal } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Technology } from '../../models/technology';
import { TechnologyService } from '../../services/technology';
import { FilterDropdown } from '../filter-dropdown/filter-dropdown';
import { MatButtonModule } from '@angular/material/button';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { RouterLink } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

type SortKey = 'popularity' | 'difficulty' | 'firstRelease';

@Component({
  selector: 'app-technology-list',
  standalone: true,
  imports: [
    CommonModule, TitleCasePipe, FormsModule, FilterDropdown,
    MatButtonModule, MatMenuModule, MatIconModule,
    RouterLink, MatProgressSpinnerModule
  ],
  templateUrl: './technology-list.html',
  styleUrl: './technology-list.scss'
})
export class TechnologyList {
  private technologyService = inject(TechnologyService);

  searchTerm = signal('');
  activeFilters = signal<Record<string, string[]>>({});
  sortBy = signal<SortKey>('popularity');

  technologies = this.technologyService.technologies;
  error = this.technologyService.error;
  loading = this.technologyService.loading;

  readonly sortOptions = {
    popularity: 'Most popular',
    difficulty: 'Easiest', 
    firstRelease: 'Earliest'
  } as const;

  readonly filterConfigs = [
    { key: 'usage', label: 'Usage', options: ['Frontend', 'Backend', 'Full stack'] },
    { key: 'difficulty', label: 'Difficulty', options: ['Easy', 'Medium', 'Hard'] },
    { key: 'popularity', label: 'Popularity', options: ['High', 'Medium', 'Low'] },
    { key: 'firstRelease', label: 'First release', options: ['2010', '2012', '2014', '2015', '2016'] },
    { key: 'typescript', label: 'Typescript', options: ['Yes', 'No'] }
  ];

  sortedAndFilteredTechnologies = computed(() => {
    const technologies = this.technologies();
    const searchTerm = this.searchTerm().toLowerCase();
    const filters = this.activeFilters();

    return technologies
      .filter(tech => this.matchesSearch(tech, searchTerm) && this.matchesFilters(tech, filters))
      .sort(this.getSortFunction());
  });

  currentSortLabel = computed(() => this.sortOptions[this.sortBy()]);

  setSortBy(sortType: string): void {
    this.sortBy.set(sortType as SortKey);
  }

applyFilter(filterType: string, values: string[]): void {
  this.activeFilters.update(current => {
    // If the filter has values, add or update it
    if (values.length > 0) {
      return {
        ...current,
        [filterType]: values
      };
    }
    // If the filter is empty, remove it from the active filters
    const { [filterType]: _, ...rest } = current;
    return rest;
  });
}

  clearFilters(): void {
    this.activeFilters.set({});
    this.searchTerm.set('');
  }

  // helper methods
  private matchesSearch(tech: Technology, searchTerm: string): boolean {
    return !searchTerm || 
           tech.name.toLowerCase().includes(searchTerm) || 
           tech.description.toLowerCase().includes(searchTerm);
  }

  private matchesFilters(tech: Technology, filters: Record<string, string[]>): boolean {
    return Object.entries(filters).every(([key, values]) => {
      if (!values?.length) return true;
      
      if (key === 'typescript') {
        return values.includes(tech.typescript ? 'Yes' : 'No');
      }
      
      return values.some(value => 
        value.toLowerCase() === String(tech[key as keyof Technology]).toLowerCase()
      );
    });
  }

  private getSortFunction() {
    const sortFunctions = {
      popularity: (a: Technology, b: Technology) => {
        const order = { high: 3, medium: 2, low: 1 };
        return order[b.popularity] - order[a.popularity];
      },
      difficulty: (a: Technology, b: Technology) => {
        const order = { easy: 1, medium: 2, hard: 3 };
        return order[a.difficulty] - order[b.difficulty];
      },
      firstRelease: (a: Technology, b: Technology) => a.firstRelease - b.firstRelease
    };
    
    return sortFunctions[this.sortBy()];
  }
}