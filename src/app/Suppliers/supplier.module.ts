import { SupplierComponent } from './supplier/supplier.component';
import { SupplierService } from './service/supplier.service';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageCropperModule } from 'ngx-image-cropper';
import { NewSupplierComponent } from './new-supplier/new-supplier.component';




@NgModule({
  declarations: [
    SupplierComponent,
  NewSupplierComponent],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  exports: [],
  providers: [SupplierService]

})

export class SupplierModule {}

