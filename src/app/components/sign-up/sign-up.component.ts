import { Component, OnDestroy } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { ToastService } from '../../services/toast.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
    styleUrls: ['./sign-up.component.scss']
})
export class SignupComponent implements OnDestroy {
    signUpForm: FormGroup;
    id:string ='default-id';
    passwordStrength: string = 'Weak';
    private unsubscribe$ = new Subject<void>();
    passwordCriteria = {
        length: false,
        uppercase: false,
        lowercase: false,
        number: false,
        specialChar: false 
      };
    

    constructor(private fb: FormBuilder,public authService: AuthService,   private toastService: ToastService,public router: Router,    private route: ActivatedRoute) {
        this.id = this.route.snapshot.paramMap.get('id')?? 'default-id';
        this.signUpForm = this.fb.group({
          email: ['', [Validators.required, Validators.email]],
          name: ['', Validators.required],
          surname: ['', Validators.required],
          password: ['', [Validators.required, this.passwordValidator.bind(this)]],
          confirmPassword: ['', Validators.required],
          day: ['', Validators.required],
          month: ['', Validators.required],
          year: ['', Validators.required],
          gender: ['', Validators.required]
        }, { validator: this.passwordsMatchValidator });
      }
    
      // Custom validator to check each requirement and update the criteria
      passwordValidator(control: AbstractControl): ValidationErrors | null {
        const value = control.value || '';
        this.passwordCriteria.length = value.length >= 10;
        this.passwordCriteria.uppercase = /[A-Z]/.test(value);
        this.passwordCriteria.lowercase = /[a-z]/.test(value);
        this.passwordCriteria.number = /[0-9]/.test(value);
        this.passwordCriteria.specialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
        const passwordValid = Object.values(this.passwordCriteria).every(criteria => criteria);

        if (passwordValid) {
            this.passwordStrength = 'Strong';
        } else if (value.length >= 8 && (this.passwordCriteria.uppercase || this.passwordCriteria.lowercase) && this.passwordCriteria.number) {
            this.passwordStrength = 'Medium';
        } else {
            this.passwordStrength = 'Weak';
        }
        return passwordValid ? null : { requirements: true };
      }
    
      passwordsMatchValidator(group: FormGroup): ValidationErrors | null {
        const password = group.get('password')?.value;
        const confirmPassword = group.get('confirmPassword')?.value;
        return password === confirmPassword ? null : { notMatching: true };
      }
    onSubmit() {
        if (this.signUpForm.valid) {
            const { email, password, name, surname } = this.signUpForm.value;
            this.authService.signUp(email, password, name, surname)
                .pipe(takeUntil(this.unsubscribe$))
                .subscribe({
                    next: () =>   this.router.navigate([`/${this.id}/login`]),
                    error: (error) =>  this.toastService.showToast(error.message, 'error')
                });
        }
    }

    onSkip() {
        // Define behavior for the "Skip this step" button.
    }

    ngOnDestroy() {
        // Emit and complete the unsubscribe$ subject to prevent memory leaks
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }
}
