import { Component } from '@angular/core';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-dynamic-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './forms.html',
  styleUrls: ['./forms.scss'],
})
export class DynamicFormComponent {
  form: FormGroup;
  isAdult = false;

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      age: [null, [Validators.required, Validators.min(0)]],
      // fields for adults
      drivingLicense: [{ value: '', disabled: true }, []],
      voterId: [{ value: '', disabled: true }, []],
      // field that is disabled when under 18
      creditCard: [{ value: '', disabled: true }, []],
    });

    this.setupAgeListener();
  }

  private setupAgeListener(): void {
    this.form.get('age')!.valueChanges.subscribe((age: number | null) => {
      this.isAdult = !!age && age >= 18;

      const drivingLicense = this.form.get('drivingLicense')!;
      const voterId = this.form.get('voterId')!;
      const creditCard = this.form.get('creditCard')!;

      if (this.isAdult) {
        drivingLicense.enable();
        voterId.enable();
        creditCard.enable();
        drivingLicense.setValidators([Validators.required]);
        voterId.setValidators([Validators.required]);
      } else {
        drivingLicense.disable();
        voterId.disable();
        creditCard.disable(); // disabled based on validation condition
        drivingLicense.clearValidators();
        voterId.clearValidators();
      }

      drivingLicense.updateValueAndValidity({ emitEvent: false });
      voterId.updateValueAndValidity({ emitEvent: false });
      creditCard.updateValueAndValidity({ emitEvent: false });
    });
  }

  onSubmit(): void {
    if (this.form.valid) {
      console.log(this.form.getRawValue());
    } else {
      this.form.markAllAsTouched();
    }
  }
}
