import { Item } from './../../models/item';
import { ItemService } from './../service/item.service';

import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { CustomValidators } from 'ng2-validation';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { ImageTransform, Dimensions, ImageCroppedEvent } from 'ngx-image-cropper';



import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';

@Component({
  selector: 'app-new-item',
  templateUrl: './new-item.component.html'
})
export class NewItemComponent implements OnInit, AfterViewInit {

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

 itemForm: FormGroup;
 errors: any[] = [];

 item: Item;
 itemArray: Item[];






  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private itemService: ItemService,
    private toastr: ToastrService
  ) {
    this.validationMessages = {

      name: {
        required: 'Please, fill up the name.'
     },
     model: {
      required: 'Please, fill up the model.'
   },
   price: {
    required: 'Please, fill up the price.'
 },
 costPrice: {
  required: 'Please, fill up the cost price.'
},
image: {
 required: 'Please, fill up the image.'
},
supplier: {
 required: 'Please, fill up the cost suplier.'
}
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', Validators.required],
      costPrice: ['', Validators.required],
      image: ['', Validators.required],
      supplier: ['', Validators.required],
      active: ['']

    });

  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
    .subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.itemForm);
    });
  }

  newItem(){

    this.item = Object.assign({}, this.item, this.itemForm.value);


    this.item.imageUpload = this.croppedImage.split(',')[1];
    this.item.image = this.imageName;

    this.itemService.newItem(this.item)
    .subscribe(
      success => {this.processSuccess(success); },
          fail => {this.processFail(fail); }
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
