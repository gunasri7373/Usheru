import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { RegistrationService } from 'src/services/registration/registration.service';
import { catchError, debounceTime, switchMap } from 'rxjs/operators';
import { of } from 'rxjs';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.component.html',
  styleUrls: ['./registration.component.scss'],
})
export class RegistrationComponent {
  registrationForm!: FormGroup;
  countries: any[] = [];
  usernameAvailable: boolean | null = null;
  users: any = [];
  registerError: boolean = false;
  constructor(
    private fb: FormBuilder,
    private registrationService: RegistrationService
  ) {}

  ngOnInit(): void {
    this.registrationForm = this.fb.group({
      username: [
        '',
        [Validators.required, Validators.pattern('^[a-z0-9]{1,20}$')],
      ],
      country: ['', Validators.required],
    });

    this.loadCountries();
    this.getAllUsers();
  }
  get f() {
    return this.registrationForm.controls;
  }

  get username() {
    return this.registrationForm.get('username');
  }

  loadCountries() {
    this.registrationService.getCountries().subscribe({
      next: (response: any) => {
        this.countries = Object.keys(response.data).map((key) => ({
          code: key,
          name: response.data[key].country,
        }));
      },
      error: (error: Error) => {
        console.error('Error loading countries:', error);
      },
    });
  }
  getAllUsers() {
    this.registrationService.geAllUsers().subscribe({
      next: (response: any) => {
        this.users = response.data;
      },
      error: (error: Error) => {
        console.error('Error loading countries:', error);
      },
    });
  }

  checkUsernameAvailability() {
    const usernameControl = this.registrationForm.get('username');
    if (usernameControl) {
      const username = usernameControl.value;
      if (username) {
        const findUser = this.users.find(
          (user: any) => user.team.toLowerCase() == username.toLowerCase()
        );
        if (findUser) {
          usernameControl.setErrors({ taken: true });
        } else {
          usernameControl.setErrors(null);
        }
      } else {
        usernameControl.setErrors(null);
      }
    }
  }

  onSubmit() {
    if (this.registrationForm.valid) {
      const { username, country } = this.registrationForm.value;
      this.registrationService.registerUser(username, country).subscribe({
        next: (response: any) => {
          this.registerError = false;
          console.log('User registered successfully:', response);
        },
        error: (error: Error) => {
          this.registerError = true;
          console.error('Error during registration:', error);
        },
      });
    }
  }
}
