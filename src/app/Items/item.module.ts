import { ItemComponent } from './item/item.component';
import { ItemService } from './service/item.service';

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NewItemComponent } from './new-item/new-item.component';
import { ImageCropperModule } from 'ngx-image-cropper';




@NgModule({
  declarations: [
 ItemComponent,
 NewItemComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule
  ],
  exports: [],
  providers: [ItemService]

})

export class ItemModule {}

