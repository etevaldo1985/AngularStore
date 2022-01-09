import { CustomValidators } from 'ng2-validation';
import { User } from './../../models/user';
import { UserService } from './../service/user.service';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren } from '@angular/core';
import { FormControlName, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';

@Component({
  selector: 'app-new-user',
  templateUrl: './new-user.component.html'
})
export class NewUserComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;
  localStorage = new LocalStorageUtils();
  errors: any[] = [];

  userForm: FormGroup;
  user: User;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserService,
    private toastr: ToastrService
  ) {

    this.validationMessages = {

      name: {
        required: 'Please, fill up the name.'
      },
      password: {
        required: 'Please, fill up the password.',
        rangeLength: 'The pass must contain between 6 and 15 caractheres'
      },
      confirmPass: {
        required: 'Please, confirm the password',
        passwordMatch: 'Password does not match'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.userForm = this.fb.group({
      name: ['', Validators.required],
      password: ['', [Validators.required, CustomValidators.rangeLength([6, 15])]],
      confirmPass: ['', [Validators.required]]
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

  newUser(){}

}
