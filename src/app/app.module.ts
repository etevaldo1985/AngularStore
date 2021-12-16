import { CustomerModule } from './Customer/customer.module';
import { ConfigModule } from './SoftwareConfigs/config.module';
import { SupplierModule } from './Suppliers/supplier.module';
import { ItemModule } from './Items/item.module';
import { UserService } from './User/service/user.service';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { BrowserModule, HammerModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MenuComponent } from './Navigation/menu/menu.component';
import { FooterComponent } from './Navigation/footer/footer.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './User/login/login.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';






@NgModule({
  declarations: [
    AppComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    LoginComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    CommonModule,
    ToastrModule.forRoot(),
    BrowserAnimationsModule,
    ItemModule,
    HammerModule,
    SupplierModule,
    ConfigModule,
    CustomerModule







  ],
  providers: [UserService],
  bootstrap: [AppComponent]
})
export class AppModule { }
