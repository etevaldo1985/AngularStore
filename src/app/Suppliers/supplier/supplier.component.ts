import { EditSupplierComponent } from './../edit-supplier/edit-supplier.component';
import { ConfigService } from './../../SoftwareConfigs/Service/config.service';
import { NewSupplierComponent } from './../new-supplier/new-supplier.component';
import { SupplierService } from './../service/supplier.service';
import { Supplier } from './../../models/supplier';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';



import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';

@Component({
  selector: 'app-supplier',
  templateUrl: './supplier.component.html'
})
export class SupplierComponent implements OnInit {

  itemImage: 'assets/';

  localStorage = new LocalStorageUtils();
  errors: any[] = [];
  suppliers: Supplier[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private supplierService: SupplierService,
    private configService: ConfigService
  ) { }

  ngOnInit(): void {

    this.supplierService.getSuppliers()
      .subscribe(
        suppliers => {
          this.suppliers = suppliers;

        }
      );

  }

  open() {
    const modalRef = this.modalService.open(NewSupplierComponent);
  }

  editSupplier(supplierId: Number) {

    const modalRef = this.modalService.open(EditSupplierComponent);

    modalRef.componentInstance.fromParent = supplierId;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {

    });


  }
}
