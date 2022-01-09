import { NewUserComponent } from './../new-user/new-user.component';
import { UserService } from './../service/user.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { SupplierService } from 'src/app/Suppliers/service/supplier.service';
import { User } from 'src/app/models/user';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { EditUserComponent } from '../edit-user/edit-user.component';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html'
})
export class UserListComponent implements OnInit {

  localStorage = new LocalStorageUtils();
  errors: any[] = [];

  users: User[];

  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private supplierService: SupplierService,
    private userService: UserService) { }

  ngOnInit(): void {

    this.userService.getUsers()
      .subscribe(
        users => {
          this.users = users;
        }
      );
  }

  open() {

    const modalRef = this.modalService.open(NewUserComponent);
  }

  editUser(userId: Number) {

    const modalRef = this.modalService.open(EditUserComponent);

    modalRef.componentInstance.fromParent = userId;

    modalRef.result.then((result) => {
      console.log(result);
    }, (reason) => {

    });
  }

}
