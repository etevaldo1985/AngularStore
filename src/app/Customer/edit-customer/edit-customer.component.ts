import { CustomerService } from './../Service/customer.service';
import { Component, OnInit, AfterViewInit, ElementRef, Input, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { City } from 'src/app/models/city';
import { Customer } from 'src/app/models/customer';
import { Province } from 'src/app/models/province';
import { ConfigService } from 'src/app/SoftwareConfigs/Service/config.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';

@Component({
  selector: 'app-edit-customer',
  templateUrl: './edit-customer.component.html'
})
export class EditCustomerComponent implements OnInit, AfterViewInit {

  @Input() fromParent;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  localStorage = new LocalStorageUtils();

  errors: any[] = [];
  cities: City[];
  provincie: Province;
  city: City;

  customerForm: FormGroup;
  customer: Customer;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private toastr: ToastrService,
    private configService: ConfigService
  ) {
    this.validationMessages = {

      name: {
        required: 'Please, fill up the name.'
      },
      phone: {
        required: 'Please, fill up the phone.'
      },
      street: {
        required: 'Please, fill up the adress.'
      },
      nameCity: {
        required: 'Please, fill up the city.'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.customerService.getCustomerById(this.fromParent)
      .subscribe(
        customerSingle => {
          this.customer = customerSingle;
          this.fillUpForm();


        }
      );

    this.customerForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      active: [''],
      address: this.fb.group({
        street: ['', Validators.required],
        city: this.fb.group({
          nameCity: ['', Validators.required],
          province: this.fb.group({
            nameProvince: ['']
          })
        })
      })
    });

    this.configService.getCities()
      .subscribe(
        cities => {
          this.cities = cities;

        }
      );
  }
  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(this.customerForm);
      });

  }

  updateCustomer() {

    this.customer = Object.assign({}, this.customer, this.customerForm.value);

    // tslint:disable-next-line: radix
    this.customer.address.city.id = parseInt(this.customer.address.city.nameCity);

    this.configService.getCities()
      .subscribe(
        city => {

          this.cities = city;

          // tslint:disable-next-line: radix
          const found = city.filter(results => results.id === parseInt(this.customer.address.city.nameCity));

          if (found.length === 0) {


          } else {

            this.customer.address.city.nameCity = found[0].nameCity;
            this.customer.address.city.province.nameProvince = found[0].province.nameProvince;
            this.customerService.updateCustomer(this.customer)
              .subscribe(
                success => { this.processSuccess(success); },
                fail => { this.processFail(fail); }
              );
          }
        }

      );
  }

  processSuccess(response: any) {
    this.errors = [];

    const toast = this.toastr.success('Customer updated succefully', 'Good Job!', { timeOut: 1500 });
    if (toast) {
      toast.onHidden.subscribe(() => {
        this.router.navigate(['']);
      });
    }

  }



  processFail(fail: any) {
    this.errors = fail.error.errors;
    this.toastr.error('Something went wrong', 'Ops!', { timeOut: 1500 });

  }

  fillUpForm() {

    this.customerForm.patchValue({
      name: this.customer.name,
      active: this.customer.active,
      phone: this.customer.phone,
      address: {
        street: this.customer.address.street,
        nameCity: this.customer.address.city.nameCity
      }

    });
  }
}
