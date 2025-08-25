import { Component, Input, Output, EventEmitter, signal} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-filter-dropdown',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './filter-dropdown.html',
  styleUrls: ['./filter-dropdown.scss']
})
export class FilterDropdown  {
  @Input() label: string = ''; 
  @Input() options: string[] = []; 
  @Input() activeOptions: string[] = []; 
  @Output() apply = new EventEmitter<string[]>(); 

  public isOpen = signal(false);
  public selectedOptions: { [key: string]: boolean } = {};


  
  toggleDropdown(): void {
    this.isOpen.update(open => !open);
  }

  clearSelection(): void {
    Object.keys(this.selectedOptions).forEach(key => {
      this.selectedOptions[key] = false;
    });
  }

  applyFilters(): void {
    const selected = Object.keys(this.selectedOptions).filter(key => this.selectedOptions[key]);
    this.apply.emit(selected);
    this.isOpen.set(false);
  }
}