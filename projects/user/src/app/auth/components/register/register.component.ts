import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { CreateAccount } from '../../constant/DTO';
import { LoginService } from '../../services/login.service';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  constructor(
    private fb: FormBuilder,
    private services: LoginService,
    private toaster: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.createForm();
  }

  createForm() {
    this.registerForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', Validators.required],
        confirmPassword: ['', Validators.required],
        username: ['', Validators.required],
      },
      { validators: this.checkPassword }
    );
  }

  createAccount() {
    const MODEL: CreateAccount = {
      email: this.registerForm.value['email'],
      username: this.registerForm.value['username'],
      password: this.registerForm.value['password'],
      role: 'user',
    };
    this.services.createUser(MODEL).subscribe((res: any) => {
      this.toaster.success('Account Has Been Created Successfully!', 'success');
      this.router.navigate(['/tasks']);
    });
    console.log(this.registerForm);
  }

  checkPassword: ValidatorFn = (
    group: AbstractControl
  ): ValidationErrors | null => {
    let password = group.get('password')?.value;
    let confirmPassword = group.get('confirmPassword')?.value;
    return password == confirmPassword ? null : { notMatched: true };
  };
}
