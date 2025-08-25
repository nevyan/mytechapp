import { TechnologyService } from '../services/technology';
import { Technology } from './../models/technology';
import { Component, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
@Component({
  selector: 'app-create-technology',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './create-technology.html',
  styleUrls: ['./create-technology.scss']
})
export class CreateTechnology {
  private fb = inject(FormBuilder);
  private technologyService = inject(TechnologyService);
  public technologies = this.technologyService.technologies;

  technologyForm: FormGroup;

  constructor() {
    this.technologyForm = this.fb.group({
      name: ['', Validators.required],
      usage: ['frontend', Validators.required],
      difficulty: ['medium', Validators.required],
      popularity: ['high', Validators.required],
      firstRelease: [new Date().getFullYear(), [Validators.required, Validators.pattern("^[0-9]*$")]],
      typescript: [true, Validators.required],
      description: ['', Validators.required]
    });
  }

  createTechnology(): void {
    if (this.technologyForm.invalid) {
      console.error('Form is invalid');
      // Mark all fields as touched to show validation errors
      this.technologyForm.markAllAsTouched();
      return;
    }

    const newTechnology: Technology = this.technologyForm.getRawValue();
    this.technologyService.addTechnology(newTechnology);

    this.technologyForm.reset({
      usage: 'frontend',
      difficulty: 'medium',
      popularity: 'high',
      firstRelease: new Date().getFullYear(),
      typescript: true
    });
  }
}