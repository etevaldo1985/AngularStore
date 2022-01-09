import { UserListComponent } from './user-list/user-list.component';
import { LoginComponent } from './login/login.component';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserService } from './service/user.service';
import { NewUserComponent } from './new-user/new-user.component';
import { EditUserComponent } from './edit-user/edit-user.component';
import { CustomFormsModule } from 'ng2-validation';
@NgModule({
  declarations: [
    LoginComponent,
    UserListComponent,
    NewUserComponent,
    EditUserComponent

  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    CustomFormsModule

  ],
  exports: [],
  providers: [UserService]
})

export class UserModule { }
