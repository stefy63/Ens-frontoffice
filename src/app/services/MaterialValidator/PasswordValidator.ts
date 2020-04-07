
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {

  static match(test: string): ValidatorFn | null {

    return (thisCtrl: AbstractControl): ValidationErrors | null => {
        const ThisValue = thisCtrl.value;
        const TestValue = (thisCtrl.parent) ? thisCtrl.parent.get(test).value : '';
        


        if (ThisValue && TestValue && ThisValue !== TestValue){
            thisCtrl.markAsTouched();
            return { passwordMatch: true };
          }
          return null;
        };
    }

}
