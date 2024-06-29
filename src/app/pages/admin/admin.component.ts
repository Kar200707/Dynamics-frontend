import { Component } from '@angular/core';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {RequestService} from "../../services/request.service";
import {HttpClientModule} from "@angular/common/http";

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    HttpClientModule,
    FormsModule
  ],
  providers: [
    RequestService
  ],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent {
  track_file: any;
  image_file: any;

  constructor(private requestService: RequestService) {  }

  changeTrackInput(file: any) {
    this.track_file = file[0];
  }

  changeImageInput(file: any) {
    this.image_file = file[0];
  }

  send() {

    const formData = new FormData();
    formData.append("image_file", this.image_file);
    formData.append("track_file", this.track_file);
    formData.append("track_name", "Интервью");
    formData.append("track_artist", "janaga");
    formData.append("track_category", "pop");
    formData.append("track_image_url", "pop");

    this.requestService.post('http://localhost:8080/admin/track', formData).subscribe({
      next: (data) => {
        console.log(data);
      },
      error: (error) => {
        console.error('Upload failed:', error);
      }
    });
  }
}
