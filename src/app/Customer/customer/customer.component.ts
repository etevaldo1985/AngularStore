import { NewCustomerComponent } from './../new-customer/new-customer.component';
import { ConfigService } from './../../SoftwareConfigs/Service/config.service';
import { CustomerService } from './../Service/customer.service';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { Component, OnInit } from '@angular/core';
import { Customer } from 'src/app/models/customer';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-customer',
  templateUrl: './customer.component.html'
})
export class CustomerComponent implements OnInit {

  localStorage: LocalStorageUtils;
  errors: any[] = [];
  customers: Customer[];

  constructor(

    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private customerService: CustomerService,
    private configService: ConfigService

  ) { }

  ngOnInit(): void {

    this.customerService.getCustomers()
    .subscribe(
      customers => {
        this.customers = customers;
      }
    );

  }

  open() {

    const modalRef = this.modalService.open(NewCustomerComponent);
  }

}
