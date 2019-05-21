import {AbstractControl, ValidationErrors} from '@angular/forms';

export class AlphabeticOnlyValidator {
  static alphabeticOnly(AC: AbstractControl): ValidationErrors | null {
    if (AC && AC.value && !/^([^0-9]*)$/.test(AC.value )) {
            return {alphabeticOnly: true};
    }
    return null;
  }
}
