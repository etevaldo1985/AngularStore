import { AfterViewInit, Component, ElementRef, OnInit, ViewChildren } from '@angular/core';
import { FormControlName, FormGroup, FormBuilder, Validators } from '@angular/forms';
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
  selector: 'app-new-province',
  templateUrl: './new-province.component.html'
})
export class NewProvinceComponent implements OnInit, AfterViewInit {

  @ViewChildren(FormControlName, { read: ElementRef}) formInputElements: ElementRef[];

  displayMessage: DisplayMessage = {};
  genericValidator: GenericValidator;
  validationMessages: ValidationMessages;



  localStorage = new LocalStorageUtils();

 provinceForm: FormGroup;
 errors: any[] = [];

 province: Province;
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

      nameProvince: {
        required: 'Please, fill up the name.'
     }
    };
    this.genericValidator = new GenericValidator(this.validationMessages);
  }

  ngOnInit(): void {
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
      this.formResult = JSON.stringify(this.provinceForm);

    });

  }

  newProvince(){

    this.province = Object.assign({}, this.province, this.provinceForm.value);

    this.configService.newProvince(this.province)
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



}
