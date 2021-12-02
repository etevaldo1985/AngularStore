import { UserService } from './../../User/service/user.service';
import { LoginComponent } from './../../User/login/login.component';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Component, OnInit } from '@angular/core';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Log } from 'src/app/models/log';
import * as moment from 'moment';


@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html'
})
export class MenuComponent implements OnInit {



localStorage = new LocalStorageUtils();
token = '';
  user: any;
  code = '';
  id: any;
  log: Log[];
  errors: any[] = [];



  constructor(
    private modalService: NgbModal,
    private router: Router,
    private toastr: ToastrService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
  }

  open() {
    const modalRef = this.modalService.open(LoginComponent);
  }

  checkUSerLogged(){
    this.user = this.localStorage.getUserToken();

    if (this.user) {
      this.code = this.user;
    }
    return this.user != null;
  }

  logOut() {

    this.userService.getLogs()
    .subscribe(
      log => {
        this.log = log;

        const found = log.filter(logs => this.localStorage.getUserToken() === logs.user.code && logs.logout === null);

        found[0].logout = moment().format('YYYY-MM-DD HH:mm:ss');

        this.userService.logOut(found[0])
        .subscribe(
          success => {this.processSuccess(success); },
          fail => {this.processFail(fail); }
        );

      });

  }

  processSuccess(response: any) {
    this.errors = [];

    this.localStorage.cleanLocalDataUser();

    const toast = this.toastr.success('User Logged Out Successfully', 'Good Job!', {timeOut: 1500});
    if (toast){
      toast.onHidden.subscribe(() => {
        this.router.navigate(['']);
      });
    }

}

processFail(fail: any) {
  this.errors = fail.error.errors;
  this.toastr.error('Something went wrong', 'Ops!', {timeOut: 1500});

}


}
