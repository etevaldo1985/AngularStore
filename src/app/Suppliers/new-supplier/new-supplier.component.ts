
import { City } from './../../models/city';
import { ConfigService } from './../../SoftwareConfigs/Service/config.service';
import { SupplierService } from './../service/supplier.service';
import { Supplier } from './../../models/supplier';
import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';

import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ImageTransform, Dimensions, ImageCroppedEvent } from 'ngx-image-cropper';
import { Province } from 'src/app/models/province';

@Component({
  selector: 'app-new-supplier',
  templateUrl: './new-supplier.component.html'
})
export class NewSupplierComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  imageChangedEvent = '';
  croppedImage = '';
  canvasRotation = 0;
  rotation = 0;
  scale = 1;
  showCropper = false;
  containWithinAspectRatio = false;
  transform: ImageTransform = {};
  imageUrl: string;
  imageName: string;

  localStorage = new LocalStorageUtils();

 supplierForm: FormGroup;
 errors: any[] = [];
 cities: City[];
 provincie: Province;
 city: City;

 supplier: Supplier;
 supplierArray: Supplier[];






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

  newSupplier(){

    this.supplier = Object.assign({}, this.supplier, this.supplierForm.value);

    // tslint:disable-next-line: radix
    this.supplier.address.city.id = parseInt(this.supplier.address.city.nameCity);


    this.configService.getCities()
    .subscribe(
        city =>{

          this.cities = city;

          const found = city.filter(results => results.id === parseInt(this.supplier.address.city.nameCity))
          if (found.length === 0 ) {

          }else {

            this.supplier.address.city.nameCity= found[0].nameCity;
            this.supplier.address.city.province.nameProvince = found[0].province.nameProvince;
            this.supplierService.newSupplier(this.supplier)
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

    const toast = this.toastr.success('Supplier Registered succefully', 'Good Job!', {timeOut: 1500});
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

fileChangeEvent(event: any): void {
  this.imageChangedEvent = event;
  this.imageName = event.currentTarget.files[0].name;
}
imageCropped(event: ImageCroppedEvent) {
  this.croppedImage = event.base64;
}
imageLoaded() {
  this.showCropper = true;
}
cropperReady(sourceImageDimensions: Dimensions) {
  console.log('Cropper ready', sourceImageDimensions);
}
loadImageFailed() {
  this.errors.push('The file format ' + this.imageName + ' is not accepted');
}

}

