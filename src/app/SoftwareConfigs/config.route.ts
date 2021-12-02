import { ProvinceListComponent } from './Province/province-list/province-list.component';
import { CityListComponent } from './City/city-list/city-list.component';
import { MainConfigComponent } from './main-config/main-config.component';
import { ConfigAppComponent } from './config.app.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


const configRoutingConfig: Routes = [
  {path: '', component: ConfigAppComponent,
children: [
  {path: 'main-config', component: MainConfigComponent},
  {path: 'city-list', component: CityListComponent},
  {path: 'province-list', component: ProvinceListComponent}
]}
];

@NgModule({
  imports: [RouterModule.forChild(configRoutingConfig)],
  exports: [RouterModule]
})
export class ConfigRoutingModule {}
