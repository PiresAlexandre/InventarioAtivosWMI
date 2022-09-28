import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  editForm: FormGroup;
  changePasswordForm: FormGroup;
  hideOldPassword = true;
  hideNewPassword = true;
  error_edit: string | null = null;
  error_password: string | null = null;
  user: any

  constructor(private fb: FormBuilder, private userService: UserService) {
    this.editForm = this.fb.group({
      first_name: ['', [Validators.required]],
      last_name: ['', [Validators.required]],
      email: ['', []],
      phone_number: ['', [Validators.required]],
    });

    this.changePasswordForm = this.fb.group({
      oldPassword: ['', [Validators.required]],
      newPassword: ['', [Validators.required]]
    });

    this.editForm.disable()
    this.changePasswordForm.disable()
  }

  ngOnInit(): void {
    this.getUserProfile()
  }

  cancel() {
    this.editForm.disable()
    this.editForm.patchValue(this.user);
    this.error_edit = null
  }

  saveChanges() {
    const userEdit = {
      first_name: this.editForm.get('first_name')?.value,
      last_name: this.editForm.get('last_name')?.value,
      phone_number: this.editForm.get('phone_number')?.value
    }
    this.userService.editProfile(userEdit).subscribe(
      data => {
        this.getUserProfile()
        this.editForm.disable()    
        this.error_edit = null   
      },
      error => {
        this.error_edit = error.error.message;        
      }
    )
  }

  changePassword(){
    this.userService.changePassword(this.changePasswordForm.value).subscribe(
      data => {
        this.disableChangePassword()  
      },
      error => {
        this.error_password = error.error.message;        
      }
    )
  }

  enableChangePassword() {
    this.changePasswordForm.enable();
  }

  disableChangePassword() {
    this.changePasswordForm.disable();
    this.changePasswordForm.reset();
    this.error_password = null;
  }


  edit() {
    this.editForm.enable()
    this.editForm.get('email')?.disable();
  }

  getUserProfile() {
    this.userService.getProfile().subscribe(data => {
      this.user = data
      this.editForm.patchValue(this.user);
    });
  }




}

