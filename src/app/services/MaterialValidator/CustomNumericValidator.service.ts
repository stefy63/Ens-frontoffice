import { FormControl, ValidationErrors } from '@angular/forms';

export class PhoneValidator {
  static validPhone(fc: FormControl): ValidationErrors | null {
    if (!!fc.value && isNaN(Number(fc.value))) {
      return { PhoneValidator: true };
    } else {
      return null;
    }
  }
}
