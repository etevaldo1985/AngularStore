import { CustomerService } from './Service/customer.service';
import { ImageCropperModule } from 'ngx-image-cropper';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { NewCustomerComponent } from './new-customer/new-customer.component';
import { CustomerComponent } from './customer/customer.component';
import { NgModule } from '@angular/core';



@NgModule({

declarations:[

CustomerComponent,
NewCustomerComponent

],

imports: [

    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule

],

exports: [],

providers: [

  CustomerService
]

})

export class CustomerModule {}
