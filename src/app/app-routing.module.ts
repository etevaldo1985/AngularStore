import { SupplierComponent } from './Suppliers/supplier/supplier.component';
import { ItemComponent } from './Items/item/item.component';
import { LoginComponent } from './User/login/login.component';
import { HomeComponent } from './home/home.component';
import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CustomerComponent } from './Customer/customer/customer.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent },
  { path: 'item', component: ItemComponent },
  { path: 'supplier', component: SupplierComponent },
  { path: 'customer', component: CustomerComponent },
  {path: 'config',
loadChildren: () => import('./SoftwareConfigs/config.module')
.then(m => m.ConfigModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
