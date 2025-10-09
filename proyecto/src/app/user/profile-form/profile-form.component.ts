import { Component } from '@angular/core';
import { Form, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-profile-form',
  templateUrl: './profile-form.component.html',
  styleUrls: ['./profile-form.component.css']
})
export class ProfileFormComponent {
  perfilForm!: FormGroup
  formChanged: boolean = false;
}
