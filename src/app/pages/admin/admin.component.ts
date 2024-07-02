import {Component, computed, inject, model, signal, WritableSignal} from '@angular/core';
import {FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";
import {MatCard, MatCardContent} from "@angular/material/card";
import {MatFormFieldModule, MatLabel} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatChipGrid, MatChipInput, MatChipInputEvent, MatChipRemove, MatChipRow} from "@angular/material/chips";
import {MatIcon} from "@angular/material/icon";
import {
  MatAutocomplete,
  MatAutocompleteSelectedEvent,
  MatAutocompleteTrigger,
  MatOption
} from "@angular/material/autocomplete";
import {COMMA, ENTER} from "@angular/cdk/keycodes";
import {LiveAnnouncer} from "@angular/cdk/a11y";
import {MatButton} from "@angular/material/button";
import {RouterLink} from "@angular/router";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule,
    MatCard,
    MatCardContent,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatChipGrid,
    MatChipRow,
    MatIcon,
    MatChipInput,
    MatAutocompleteTrigger,
    MatAutocomplete,
    MatOption,
    MatChipRemove,
    MatButton,
    RouterLink
  ],
  providers: [
    RequestService
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  token: string | null = localStorage.getItem('token');
  track_file: any;
  image_file: any;
  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  currentCategories = model('');
  readonly categories:WritableSignal<string[]> = signal([]);
  readonly allCategories: string[] = ['Pop', 'Rap', 'Rap hookahs', 'Hip hop', 'Jazz'];
  readonly filteredCategories = computed(() => {
    const currentCategory = this.currentCategories().toLowerCase();
    return currentCategory
      ? this.allCategories.filter(category => category.toLowerCase().includes(currentCategory))
      : this.allCategories.slice();
  });

  constructor(private requestService: RequestService) {  }

  changeTrackInput(file: any) {
    this.track_file = file[0];
  }

  changeImageInput(file: any) {
    this.image_file = file[0];
  }

  form: FormGroup = new FormGroup({
    track_name: new FormControl('', Validators.required),
    track_artist: new FormControl('', Validators.required),
    track_image_url: new FormControl(''),
    track_category: new FormControl('')
  })

  send() {
    let selectedCategories: string[] = [];
    this.categories.update(categories => {
      selectedCategories = categories;
      return categories;
    });

    const lowercaseCategories = selectedCategories.map(category => category.toLowerCase());

    const formData = new FormData();
    formData.append("image_file", this.image_file);
    formData.append("access_token", this.token as string);
    formData.append("track_file", this.track_file);
    formData.append("track_name", this.form.get('track_name')?.value);
    formData.append("track_artist", this.form.get('track_artist')?.value);
    formData.append("track_category", JSON.stringify(lowercaseCategories));
    formData.append("track_image_url", this.form.get('track_image_url')?.value);
    this.requestService.post('http://localhost:8080/admin/track', formData).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      }
    });
  }

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    if (value) {
      this.categories.update(categories => {
        console.log(categories)
        return [...categories, value]
      });
    }

    this.currentCategories.set('');
  }

  remove(category: string): void {
    this.categories.update(categories => {
      const index = categories.indexOf(category);
      if (index < 0) {
        return categories;
      }

      categories.splice(index, 1);
      this.announcer.announce(`Removed ${category}`);
      return [...categories];
    });
  }

  selected(event: MatAutocompleteSelectedEvent): void {
    this.categories.update(categories => [...categories, event.option.viewValue]);
    this.currentCategories.set('');
    event.option.deselect();
  }
}
