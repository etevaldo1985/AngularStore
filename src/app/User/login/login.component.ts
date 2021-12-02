import { Log } from './../../models/log';
import { UserService } from './../service/user.service';
import { User } from './../../models/user';
import { ValidationMessages, GenericValidator, DisplayMessage } from './../../Utils/generic-form-validation';
import { LocalStorageUtils } from './../../Utils/localstorageutils';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';
import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import * as moment from 'moment';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html'
})
export class LoginComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  localStorage = new LocalStorageUtils();

 userForm: FormGroup;
 errors: any[] = [];

 user: User;
 userArray: User[];
 log = new Log();



  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {
    this.validationMessages = {

      code: {
        required: 'Please, fill up the code.'
     },
   password: {
    required: 'Please, fill up the password',
    rangeLength: 'The pass must contain between 6 and 15 caractheres'
  }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.userForm = this.fb.group({
      code: ['', Validators.required],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]]
    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
    .subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.userForm);
    });
  }

  login(){
    this.user = Object.assign({}, this.user, this.userForm.value);

    this.userService.getUsers()
    .subscribe(
      users => {
      this.userArray = users;

      // tslint:disable-next-line: no-shadowed-variable
      const found = users.filter(users => users.code === this.user.code && users.password === this.user.password);
      console.log(found);
      if ( found.length === 0 ){
        console.log('User not registered or password/code incorrect');
        this.toastr.error('User not registered or password/code incorrect', 'Ops!!!');
      }else {
        this.localStorage.saveToken(found[0].code);
        this.localStorage.saveUser(found[0].id);

        this.log.user = found[0];
        this.log.logIn = moment().format('YYYY-MM-DD HH:mm:ss');
        this.log.logout = null;

        this.userService.login(this.log)
        .subscribe(
          success => {this.processSuccess(success); },
          fail => {this.processFail(fail); }
        );
      }
      });

  }

  processSuccess(response: any) {
    this.errors = [];

    const toast = this.toastr.success('User Logged in Successfully', 'Good Job!', {timeOut: 1500});
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
