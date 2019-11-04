<<<<<<< Updated upstream
import { AbstractControl, ValidationErrors } from '@angular/forms';

export class PasswordValidator {
  static match(control: AbstractControl): ValidationErrors | null {
    const confirmPassword = control.value;
    const newPassword = (control.parent) ? control.parent.get('new_password').value : '';

    if (newPassword && confirmPassword && newPassword !== confirmPassword){
      control.markAsTouched();
      return { passwordMatch: true };
    }
    return null;
  }
}

=======
import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export class PasswordValidator {
//   static match(control: AbstractControl): ValidationErrors | null {
//     const confirmPassword = control.value;
//     const newPassword = (control.parent) ? control.parent.get('new_password').value : '';

//     if (newPassword && confirmPassword && newPassword !== confirmPassword){
//       control.markAsTouched();
//       return { passwordMatch: true };
//     }
//     return null;
//   }

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
>>>>>>> Stashed changes
