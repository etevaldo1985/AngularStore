import { City } from './../../../models/city';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';



import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ConfigService } from '../../Service/config.service';
import { NewCityComponent } from '../new-city/new-city.component';

@Component({
  selector: 'app-city-list',
  templateUrl: './city-list.component.html'
})
export class CityListComponent implements OnInit {

  itemImage: 'assets/';

  localStorage = new LocalStorageUtils();
  errors: any[] = [];
  cities: City[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private configService: ConfigService
    ) { }

  ngOnInit(): void {

    this.configService.getCities()
    .subscribe(
      cities => {
        this.cities = cities;

        }
    );

  }

  open() {
    const modalRef = this.modalService.open(NewCityComponent);
  }

}
