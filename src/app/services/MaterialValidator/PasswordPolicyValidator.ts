import { AbstractControl, ValidationErrors, Validators } from '@angular/forms';

export class PasswordPolicyValidator {
  static policy(control: AbstractControl): ValidationErrors | null {
    const errors = Validators.pattern('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[\\W]).{10,}$')(control);
    if (errors) {
      control.markAsTouched();
      return { policyNotMatch: true };
    }
    return null;
  }
}

