import { TechnologyService } from './../../services/technology';
import { Technology } from './../../models/technology';
import { Component, inject, Input, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-update-technology',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-technology.html',
  styleUrls: ['./update-technology.scss']
})
export class UpdateTechnology {
  @Input() name!: string;

  technologyForm: FormGroup;

  private technologyService = inject(TechnologyService);
  private fb = inject(FormBuilder);
  private router = inject(Router);
  public technology = signal<Technology | undefined>(undefined);

  constructor() {
    this.technologyForm = this.fb.group({
      name: [{ value: '', disabled: true }, Validators.required],
      usage: ['', Validators.required],
      difficulty: ['', Validators.required],
      popularity: ['', Validators.required],
      firstRelease: ['', [Validators.required, Validators.pattern("^[0-9]*$")]],
      typescript: [false, Validators.required],
      description: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    const techData = this.technologyService.getTechnologyByName(this.name);

    if (techData) {
      this.technology.set(techData);
      this.technologyForm.patchValue(techData);
    } else {
      console.error(`Technology with name '${this.name}' not found.`);
      this.router.navigate(['/']);
    }
  }

  updateTechnology(): void {
    if (this.technologyForm.valid) {
      const updatedTechnology: Technology = {
        ...this.technology()!,
        ...this.technologyForm.getRawValue()
      };
      this.technologyService.updateTechnology(updatedTechnology);
      this.router.navigate(['/']);
    }
  }

  deleteTechnology(): void {
    if (confirm(`Are you sure you want to delete ${this.technology()?.name}?`)) {
      this.technologyService.deleteTechnology(this.technology()!.name);
      this.router.navigate(['/']);
    }
  }
}