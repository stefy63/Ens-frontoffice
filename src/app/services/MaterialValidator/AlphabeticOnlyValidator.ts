import {AbstractControl, ValidationErrors} from '@angular/forms';

export class AlphabeticOnlyValidator {
  static alphabeticOnly(AC: AbstractControl): ValidationErrors | null {
    if (AC && AC.value && !/^[A-zÀ-ú]+([\sA-zÀ-ú]+)?$/.test(AC.value )) {
        return {alphabeticOnly: true};
    }
    return null;
  }
}
