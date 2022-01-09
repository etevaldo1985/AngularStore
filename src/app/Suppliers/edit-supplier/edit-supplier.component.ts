import { AfterViewInit, Component, ElementRef, Input, OnInit, ViewChildren } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { City } from 'src/app/models/city';
import { Province } from 'src/app/models/province';
import { Supplier } from 'src/app/models/supplier';
import { ConfigService } from 'src/app/SoftwareConfigs/Service/config.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { SupplierService } from '../service/supplier.service';

@Component({
  selector: 'app-edit-supplier',
  templateUrl: './edit-supplier.component.html'
})
export class EditSupplierComponent implements OnInit, AfterViewInit {

  @Input() fromParent;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  localStorage = new LocalStorageUtils();

  supplierForm: FormGroup;
  errors: any[] = [];
  cities: City[];
  provincie: Province;
  city: City;

  supplier: Supplier;



  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private supplierService: SupplierService,
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
      document: {
        required: 'Please, fill up the cost document.'
      },
      nameCity: {
        required: 'Please, fill up the city.'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.supplierService.getSupplierById(this.fromParent)
      .subscribe(
        supplierSingle => {

          this.supplier = supplierSingle;
          this.fillUpForm();

        }
      );

    this.supplierForm = this.fb.group({
      name: ['', Validators.required],
      phone: ['', Validators.required],
      active: [''],
      document: ['', Validators.required],
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
        this.displayMessage = this.genericValidator.processMessages(this.supplierForm);
      });

  }

  updateSupplier() {

    this.supplier = Object.assign({}, this.supplier, this.supplierForm.value);
    // tslint:disable-next-line: radix
    this.supplier.address.city.id = parseInt(this.supplier.address.city.nameCity);

    this.configService.getCities()
      .subscribe(
        city => {

          this.cities = city;

          // tslint:disable-next-line: radix
          const found = city.filter(results => results.id === parseInt(this.supplier.address.city.nameCity));
          if (found.length === 0) {

          } else {

            this.supplier.address.city.nameCity = found[0].nameCity;
            this.supplier.address.city.province.nameProvince = found[0].province.nameProvince;
            this.supplierService.updateSupplier(this.supplier)
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

    const toast = this.toastr.success('Supplier Registered succefully', 'Good Job!', { timeOut: 1500 });
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
    this.supplierForm.patchValue({
      name: this.supplier.name,
      phone: this.supplier.phone,
      document: this.supplier.document,
      active: this.supplier.active,
      address: {
        street: this.supplier.address.street,
        nameCity: this.supplier.address.city.nameCity
      }


    });

  }

}
