import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { City } from 'src/app/models/city';
import { Province } from 'src/app/models/province';
import { Supplier } from 'src/app/models/supplier';
import { SupplierService } from 'src/app/Suppliers/service/supplier.service';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ConfigService } from '../../Service/config.service';

@Component({
  selector: 'app-new-city',
  templateUrl: './new-city.component.html'
})
export class NewCityComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;



  localStorage = new LocalStorageUtils();

 cityForm: FormGroup;
 errors: any[] = [];

 provincies: Province[];
 city: City;
  formResult = '';

  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private configService: ConfigService
  ) {
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
    this.cityForm = this.fb.group({
      nameCity: ['', Validators.required],

      province: this.fb.group({
        nameProvince: ['', Validators.required]
      })

    });
    this.configService.getProvincies()
      .subscribe(
        provincies => {
          this.provincies = provincies;
        }
      );

  }





  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
    .subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.cityForm);
      this.formResult = JSON.stringify(this.cityForm);

    });

  }

  newCity(){

    this.city = Object.assign({}, this.city, this.cityForm.value);

    console.log(this.city)

    this.city.province.id = parseInt(this.city.province.nameProvince)

    this.configService.getProvincies()
      .subscribe(
        provincies => {
          this.provincies = provincies;

          const found = provincies.filter(results => results.id === parseInt(this.city.province.nameProvince));

        if (found.length === 0 ) {

        }else {

          this.city.province.nameProvince = found[0].nameProvince
          this.configService.newCity(this.city)
    .subscribe(
      success => {this.processSuccess(success); },
          fail => {this.processFail(fail); }
    );
        }

        }
      );



  }



  processSuccess(response: any) {
    this.errors = [];

    const toast = this.toastr.success('Item Registered succefully', 'Good Job!', {timeOut: 1500});
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
