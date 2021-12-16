import { EditProvinceComponent } from './../edit-province/edit-province.component';
import { NewProvinceComponent } from './../new-province/new-province.component';
import { Province } from './../../../models/province';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ConfigService } from '../../Service/config.service';

@Component({
  selector: 'app-province-list',
  templateUrl: './province-list.component.html'
})
export class ProvinceListComponent implements OnInit {

  itemImage: 'assets/';

  localStorage = new LocalStorageUtils();
  errors: any[] = [];
  provinces: Province[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private configService: ConfigService
    ) { }

  ngOnInit(): void {

    this.configService.getProvincies()
    .subscribe(

        provinces => {

          this.provinces = provinces;
        }
    );


  }

  open() {
    const modalRef = this.modalService.open(NewProvinceComponent);
  }

  openEdit(provinceId: Number) {


    const modalRef = this.modalService.open(EditProvinceComponent);


    modalRef.componentInstance.fromParent = provinceId;
    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {
    });
  }


}
