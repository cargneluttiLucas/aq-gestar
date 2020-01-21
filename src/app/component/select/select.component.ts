import {
  Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewChild,
  ElementRef, AfterContentInit, ChangeDetectionStrategy, ChangeDetectorRef, OnChanges
} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BehaviorSubject, Observable, Subject, Subscription, fromEvent } from 'rxjs';
import { SelectResultsComponent } from './select-results/select-results.component';
import { ModalDialogService } from '../../utils/services/modal/modal-dialog.service';
import { NavigatorService } from '../../utils/services/navigator/navigator.service';

@Component({
  selector: 'app-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss']
})
export class SelectComponent implements OnInit, AfterContentInit, OnDestroy, OnChanges {
  @Input() placeholderDefault = 'Seleccione una opción';
  @Input() disabled = false;
  @Input() isDesktop = false;
  @Input() defaultValue = null;
  @Input() required = false;
  @Input() items = [{ id: 0, description: '', disabled: false }];
  @Input() submit: Observable<boolean>;
  @Output() itemSelected = new EventEmitter<any>();
  @Output() handlerError = new EventEmitter<any>();
  @Input() item = null;
  @Input() dropUp = true;

  @Input() dispatchSuccess: string;
  @Input() dispatchHint: string;
  @Input() dispatchError: string;

  @Input() select: FormControl;

  @ViewChild('selectRef', { static: true }) selectRef: ElementRef;

  selectResultsWidth: number;
  iconOpen = false;
  validationMoment: BehaviorSubject<boolean>;
  errors: any;
  isErrorLine = false;
  inFocus = false;
  isMobileSelect = false;
  outputSubject: Subject<any>;
  outputSubject$: Observable<any>;
  outputSubscription: Subscription;
  resizeSubscription: Subscription;
  onAfterClose: Subject<void>;

  constructor(
    private modalService: ModalDialogService,
    private deviceDetector: NavigatorService) {
    this.submit = new Observable<boolean>();
    this.validationMoment = new BehaviorSubject<boolean>(null);
  }

  ngAfterContentInit(): void {
    this.widthSelectResults();
    if (!this.isMobileSelect) {
      this.resizeSubscription = fromEvent(window, 'resize').subscribe(() => this.widthSelectResults());
    }
  }

  ngOnInit(): void {
    this.createForm();
    if (!this.isDesktop) {
      this.isMobileSelect = this.deviceDetector.isMobile;
    }

    if (this.isMobileSelect) {
      this.outputSubject = new Subject<any>();
      this.onAfterClose = new Subject<void>();

      this.outputSubject$ = this.outputSubject.asObservable();
      this.outputSubscription = this.outputSubject$.subscribe((event) => {
        this.itemSelect(event);
      });
    }

    this.submit.subscribe((result) => {
      if (result) {
        this.validationMoment.next(true);
        this.statusLinesErrorSuccess();
      }
    });
  }

  ngOnChanges() {
    this.widthSelectResults();
  }

  widthSelectResults(): void {
    this.selectResultsWidth = this.selectRef.nativeElement.offsetWidth;
  }

  ngOnDestroy(): void {
    if (this.isMobileSelect) {
      this.outputSubscription.unsubscribe();
    }
    if (this.resizeSubscription) {
      this.resizeSubscription.unsubscribe();
    }
  }

  handleControl(event) {
    this.errors = Object.keys(event);
    this.handlerError.emit(this.errors);

    this.isErrorLine = false;
  }

  createForm(): void {
    if (this.required) {
      this.select = new FormControl(this.item, Validators.required);
    } else {
      this.select = new FormControl(this.item);
    }
  }

  openItemsResult() {
    this.widthSelectResults();
    if (!this.disabled) {
      this.inFocus = true;
      if (this.isMobileSelect) {
        this.openModalDialog();
      } else {
        if (this.iconOpen) {
          this.validationMoment.next(true);
          this.statusLinesErrorSuccess();
        }

        this.iconOpen = !this.iconOpen;
      }

    }
  }

  openModalDialog(): void {
    this.modalService.openDialog(SelectResultsComponent, {
      childComponent: SelectResultsComponent,
      data: {
        selectedItems: this.items,
        defaultValue: this.defaultValue,
        isMobile: this.isMobileSelect
      },
      outputData: this.outputSubject,
      isOverlay: true,
      onAfterClose: this.onAfterClose
    });
  }

  itemSelect(event) {
    this.item = event !== null ? event : null;

    this.iconOpen = false;
    this.itemSelected.emit(this.item);
    this.isErrorLine = false;

    if (this.inFocus) {
      this.validationMoment.next(true);
      this.select.setValue(this.item);
      this.inFocus = false;
      this.statusLinesErrorSuccess();
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

  statusLinesErrorSuccess() {
    if (this.errors && this.errors[0] !== 'success') {
      this.isErrorLine = true;
    }
  }
}
