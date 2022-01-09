import { Component, ElementRef, OnInit, ViewChildren, AfterViewInit, Input } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { City } from 'src/app/models/city';
import { Province } from 'src/app/models/province';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ConfigService } from '../../Service/config.service';

@Component({
  selector: 'app-edit-city',
  templateUrl: './edit-city.component.html'
})
export class EditCityComponent implements OnInit, AfterViewInit {


  @Input() fromParent;
  @ViewChildren(FormControlName, { read: ElementRef }) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  localStorage = new LocalStorageUtils();

  cityForm: FormGroup;
  errors: any[] = [];

  city: City;
  provincies: Province[];

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private configService: ConfigService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {

    this.validationMessages = {

      nameCity: {
        required: 'Please, fill up the name.'
      },
      nameProvince: {
        required: 'Please, fill up the province.'
      }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);


  }

  ngOnInit(): void {

    this.configService.getCityById(this.fromParent)
      .subscribe(
        citySingle => {

          this.city = citySingle;
          this.fillUpForm();
        },
        error => console.log(error)
      );

    this.configService.getProvincies()
      .subscribe(
        provincies => {
          this.provincies = provincies;
        }
      );

    this.cityForm = this.fb.group({
      nameCity: ['', Validators.required],

      province: this.fb.group({
        nameProvince: ['', Validators.required]
      })

    });
  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
      .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
      .subscribe(() => {
        this.displayMessage = this.genericValidator.processMessages(this.cityForm);
      });

  }

  updateCity() {

    this.city = Object.assign({}, this.city, this.cityForm.value);



    // tslint:disable-next-line: radix
    this.city.province.id = parseInt(this.city.province.nameProvince);

    this.configService.getProvincies()
      .subscribe(
        provincies => {
          this.provincies = provincies;

          // tslint:disable-next-line: radix
          const found = provincies.filter(results => results.id === parseInt(this.city.province.nameProvince));

          if (found.length === 0) {

          } else {
            this.city.province.nameProvince = found[0].nameProvince;
            this.configService.updateCity(this.city)
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

    const toast = this.toastr.success('City Updated succefully', 'Good Job!', { timeOut: 1500 });
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

    this.cityForm.patchValue({
      nameCity: this.city.nameCity,
      nameProvince: this.city.province.nameProvince
    });
  }
}
