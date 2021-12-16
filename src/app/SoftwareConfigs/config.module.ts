import { EditProvinceComponent } from './Province/edit-province/edit-province.component';
import { NewProvinceComponent } from './Province/new-province/new-province.component';
import { ProvinceListComponent } from './Province/province-list/province-list.component';
import { ConfigAppComponent } from './config.app.component';
import { ConfigRoutingModule } from './config.route';
import { ConfigService } from './Service/config.service';


import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { ImageCropperModule } from 'ngx-image-cropper';
import { MainConfigComponent } from './main-config/main-config.component';
import { CityListComponent } from './City/city-list/city-list.component';
import { NewCityComponent } from './City/new-city/new-city.component';




@NgModule({
  declarations: [
    MainConfigComponent,
    ConfigAppComponent,
    CityListComponent,
    NewCityComponent,
    ProvinceListComponent,
    NewProvinceComponent,
    EditProvinceComponent
  ],
  imports: [
    CommonModule,
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    ImageCropperModule,
    ConfigRoutingModule
  ],
  exports: [],
  providers: [ConfigService]

})

export class ConfigModule {}

