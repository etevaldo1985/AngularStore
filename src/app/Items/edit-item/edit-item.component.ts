import { Component, ElementRef, Input, OnInit, ViewChildren, AfterViewInit } from '@angular/core';
import { FormBuilder, FormControlName, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { Dimensions, ImageCroppedEvent, ImageTransform } from 'ngx-image-cropper';
import { ToastrService } from 'ngx-toastr';
import { Observable, fromEvent, merge } from 'rxjs';
import { Item } from 'src/app/models/item';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ItemService } from '../service/item.service';

@Component({
  selector: 'app-edit-item',
  templateUrl: './edit-item.component.html'
})
export class EditItemComponent implements OnInit, AfterViewInit {

  @Input() fromParent;

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
}
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {

    this.itemService.getItemsById(this.fromParent)
    .subscribe(

      itemSingle => {

        this.item = itemSingle;
        this.fillUpForm();
      }
    );

    this.itemForm = this.fb.group({
      name: ['', Validators.required],
      model: ['', Validators.required],
      price: ['', Validators.required],
      costPrice: ['', Validators.required],
      image: ['', Validators.required],
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



  fillUpForm(){

    this.itemForm.patchValue({
      name: this.item.name,
      model: this.item.model,
      costPrice: this.item.costPrice,
      price: this.item.price,
      active: this.item.active
    });
  }

  updateItem(){}

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
