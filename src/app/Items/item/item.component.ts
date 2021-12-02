import { ItemService } from './../service/item.service';
import { NewItemComponent } from './../new-item/new-item.component';

import { LocalStorageUtils } from './../../Utils/localstorageutils';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Item } from 'src/app/models/item';


@Component({
  selector: 'app-item',
  templateUrl: './item.component.html'
})
export class ItemComponent implements OnInit {

  itemImage: 'assets/';

  localStorage = new LocalStorageUtils();
  errors: any[] = [];
  item: Item[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private itemService: ItemService
    ) { }

  ngOnInit(): void {

    this.itemService.getItems()
    .subscribe(
      items => {
        this.item = items;
        }
    );

  }

  open() {
    const modalRef = this.modalService.open(NewItemComponent);
  }

}
