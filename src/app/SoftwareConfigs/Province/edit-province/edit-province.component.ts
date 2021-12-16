import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ConfigService } from 'src/app/SoftwareConfigs/Service/config.service';
import { Component, OnInit, AfterViewInit, ElementRef, ViewChildren, Input } from '@angular/core';
import { FormControlName, FormGroup, Validators, FormBuilder} from '@angular/forms';
import { Province } from 'src/app/models/province';
import { DisplayMessage, GenericValidator, ValidationMessages } from 'src/app/Utils/generic-form-validation';
import { LocalStorageUtils } from 'src/app/Utils/localstorageutils';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable, fromEvent, merge } from 'rxjs';


@Component({
  selector: 'app-edit-province',
  templateUrl: './edit-province.component.html'
})
export class EditProvinceComponent implements OnInit, AfterViewInit {

  @Input() fromParent;
  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;

  localStorage = new LocalStorageUtils();

  provinceForm: FormGroup;
 errors: any[] = [];

 province: Province;


  constructor(
    public activeModal: NgbActiveModal,
    private fb: FormBuilder,
    private configService: ConfigService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute) {

      this.validationMessages = {

        nameProvince: {
          required: 'Please, fill up the name.'
       }
      };
      this.genericValidator = new GenericValidator(this.validationMessages);

    }

  ngOnInit(): void {

    console.log(this.fromParent);

    this.configService.getProvinceById(this.fromParent)
    .subscribe(
      provinceSingle => {

        this.province = provinceSingle;
        this.fillUpForm();

      },
      error => console.log(error));



    this.provinceForm = this.fb.group({
        nameProvince: ['', Validators.required]
      });


  }

  ngAfterViewInit(): void {
    const controlBlurs: Observable<any>[] = this.formInputElements
    .map((formControl: ElementRef) => fromEvent(formControl.nativeElement, 'blur'));

    merge(...controlBlurs)
    .subscribe(() => {
      this.displayMessage = this.genericValidator.processMessages(this.provinceForm);
    });

  }



  updateProvince(){

    this.province = Object.assign({}, this.province, this.provinceForm.value);

    this.configService.updateProvince(this.province)
    .subscribe(
      success => {this.processSuccess(success); },
      fail => {this.processFail(fail); }
    );

  }

  processSuccess(response: any) {
    this.errors = [];

    const toast = this.toastr.success('Province Updated succefully', 'Good Job!', {timeOut: 1500});
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
  fillUpForm() {

    this.provinceForm.patchValue({
      nameProvince: this.province.nameProvince
    });

}

}
