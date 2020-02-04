import {
  Component, Input,
  EventEmitter, Output, OnInit,
  ChangeDetectionStrategy, ChangeDetectorRef,
  ViewChild, ElementRef, OnDestroy, Renderer2, AfterViewInit, forwardRef
} from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { FormGroup, FormControl, AbstractControl, ValidationErrors, Validators, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ModalService } from '../modal/service/modal.service';
import { KeypressService, DocumentService, NavigatorService } from '../../utils/index';
import { debounceTime } from 'rxjs/operators';
import { isEmpty } from '../form';

@Component({
  selector: 'app-textfield-predictive',
  templateUrl: './textfield-predictive.component.html',
  styleUrls: ['./textfield-predictive.component.scss'],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => TextfieldPredictiveComponent),
    multi: true
  }],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextfieldPredictiveComponent implements OnInit, AfterViewInit, OnDestroy {

  constructor(
    private modalServiceNg: ModalService,
    private keypressService: KeypressService,
    private cdRef: ChangeDetectorRef,
    private documentService: DocumentService,
    private deviceDetector: NavigatorService,
    private renderer: Renderer2) {
    this.isMobile = this.deviceDetector.isMobile;
  }
  @Input() items: any;
  @Input() item = null;
  @Input() urlImg: string;
  @Input() defaultValue = null;
  @Input() autocomplete;
  @Input() submit$: Observable<boolean> = new Observable();
  @Input() required = true;
  @Input() text = '';
  @Input() id = '';
  @Input() minLength = -1;
  @Input() timeFilter = 0;
  @Input() selectFormControl: FormControl;
  @Input() dispatchSuccess: string;
  @Input() dispatchHint: string;
  @Input() dispatchError: string;
  @Input() disabled = false;

  @Output() itemSelected = new EventEmitter<any>();
  @Output() handlerError = new EventEmitter<any>();

  @ViewChild('textfieldModal', { static: false }) textfieldModal: ElementRef;

  private statusChangesSubscription: Subscription;
  private data: any;

  itemsFilter = [];
  isMobile: boolean;
  inFocus = false;
  iconOpen = false;
  errors: any;
  isErrorLine = false;
  form: FormGroup;
  flagDefault = false;

  keypressSubscription: Subscription = new Subscription();

  private outputSubject: Subject<any> = new Subject();
  outputSubject$: Observable<any>;

  onAfterClose: Subject<void>;

  iconName = 'icon-angle-down';

  private validationMoment: Subject<any> = new Subject();
  public validationMoment$ = this.validationMoment.asObservable();

  public itemsFilterEmpty(control: AbstractControl): ValidationErrors | null {
    if (!isEmpty(control.value)) {
      return { itemsFilterEmpty: true };
    }
    return null;
  }

  ngOnInit() {
    // this.createForm();
  }

  createForm() {
    if (this.selectFormControl === undefined) {
      this.selectFormControl = new FormControl('');
    }
    if (this.required) {
      this.selectFormControl.validator ?
        this.selectFormControl.setValidators([this.selectFormControl.validator, Validators.required]) :
        this.selectFormControl.setValidators(Validators.required);
    } else {
      this.selectFormControl.validator ?
        this.selectFormControl.setValidators([this.selectFormControl.validator]) :
        this.selectFormControl.setValidators(Validators.nullValidator);
    }
  }

  ngAfterViewInit() {

    if (this.deviceDetector.isBrowser) {
      this.keypressSubscription = this.keypressService.keyPressEscape().subscribe((response) => {
        if (response === true) {
          this.closeModalForOtherMotive();
        }
      });
    }

    this.submit$.subscribe((result) => {
      if (result) {
        this.validationMoment.next(true);
        this.statusLinesErrorSuccess();
      }
    });

    this.selectFormControl.valueChanges.pipe(
      debounceTime(this.timeFilter)).subscribe((data) => {
        this.flagDefault = false;
        this.itemsFilter = [];
        if (data === '' || data === null) {
          return;
        }
        if (data.length >= this.minLength) {
          this.filter(data);
        }
      });
    this.cdRef.detectChanges();
  }

  private filter(data) {
    this.flagDefault = true;
    const aux = [];
    let text = '';
    if (this.selectFormControl.value) {
      text = this.selectFormControl.value.toLowerCase();
    }
    const searchText = this.normalizeText(text);
    if (this.items) {
      this.items.filter((item) => {
        if (this.normalizeText(item.description).indexOf(searchText) !== -1) {
          aux.push(item);
        }
      });
    }
    this.itemsFilter = aux;
    if (this.itemsFilter.length === 0 && this.selectFormControl.dirty) {
      this.selectFormControl.setValidators([this.selectFormControl.validator, this.itemsFilterEmpty]);
      this.validationMoment.next(true);
    } else {
      this.selectFormControl.setValidators([Validators.required]);
    }
    this.cdRef.detectChanges();
  }

  normalizeText(text: string): string {
    return text.normalize('NFD').replace(/([aeio])\u0301|(u)[\u0301\u0308]/gi, '$1$2')
      .normalize().toLowerCase();
  }

  closeModalForOtherMotive(event?) {
    if (this.id !== '' && this.documentService.nativeDocument.body.querySelectorAll(`#${this.id}`).length > 0) {
      this.closeModal(this.id);
    }
  }

  itemSelect(event) {
    this.item = event !== null ? event : null;

    this.iconOpen = false;
    this.itemSelected.emit(this.item);
    this.isErrorLine = false;

    if (this.inFocus) {
      this.validationMoment.next(true);
      this.inFocus = false;
      this.statusLinesErrorSuccess();
    }

    if (this.isMobile) {
      this.closeModal(this.id);
    }
  }

  statusLinesErrorSuccess() {
    if (this.errors && this.errors[0] !== 'success') {
      this.isErrorLine = true;
    }
  }

  clickOutside(event) {
    event === null ? this.iconOpen = false : this.iconOpen = this.iconOpen;

    if (this.inFocus) {
      event === null ? this.validationMoment.next(true) : this.validationMoment.next(false);
      this.statusLinesErrorSuccess();
    }
    if (this.inFocus && !this.item) {
      this.inFocus = false;
    }
  }

  handleControl(event) {
    this.errors = event;

    this.handlerError.emit(this.errors);
    this.isErrorLine = false;
    if (event[0] === 'success' && this.item === null) {
      this.selectFormControl.setValidators([this.selectFormControl.validator, this.itemsFilterEmpty]);
      this.selectFormControl.updateValueAndValidity();
    }
    if (event[0] === 'itemsFilterEmpty' && this.item !== null) {
      this.selectFormControl.setValidators([Validators.required]);
      this.selectFormControl.updateValueAndValidity();
    }
  }

  openDialog(event, id: string) {
    if (event.focusOn && this.isMobile) {
      setTimeout(() => {
        const textfieldModalPredictive = this.renderer.selectRootElement(`#${this.id}-mobile`);
        textfieldModalPredictive.focus();
      });
      this.modalServiceNg.open(id);
    }
    if (!this.disabled && event.focusOn) {
      this.inFocus = true;

      if (this.iconOpen) {
        this.validationMoment.next(true);
        this.statusLinesErrorSuccess();
      }
      this.iconOpen = !this.iconOpen;
    }
  }

  closeModal(id: string) {
    this.modalServiceNg.close(id);
  }

  itemSelectedList(event) {
    if (event) {
      this.itemSelect(event[1]);
    }
  }

  ngOnDestroy() {
    this.keypressSubscription.unsubscribe();
  }

  private propagateChange = (_: any) => {
  }

  writeValue(obj: any): void {
    if (obj) {
      this.data = obj;
      this.cdRef.detectChanges();
    }
  }

  registerOnChange(fn: any): void {
    this.propagateChange = fn;
  }

  registerOnTouched(fn: any): void {
  }

  setDisabledState?(isDisabled: boolean): void {
  }
}
