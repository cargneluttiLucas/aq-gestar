import {
    Component, forwardRef, Input, OnInit, Output,
    EventEmitter, ViewChild, AfterViewInit, ChangeDetectorRef, ChangeDetectionStrategy
} from '@angular/core';
import { FormControl, NG_VALUE_ACCESSOR, ControlValueAccessor, Validators } from '@angular/forms';
import { Observable, Subject, Subscription } from 'rxjs';

export const TextfieldComponentType = {
    TEXT: 'text',
    PASSWORD: 'password',
    PHONE: 'tel'
};

export const MomentValidateTexfield = {
    ONFOCUS: 'onFocus',
    OUTFOCUS: 'outFocus',
    SUBMIT: 'submit'
};

@Component({
    selector: 'app-textfield',
    templateUrl: './textfield.component.html',
    styleUrls: ['./textfield.component.scss'],
    providers: [{
        provide: NG_VALUE_ACCESSOR,
        useExisting: forwardRef(() => TextfieldComponent),
        multi: true
    }],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class TextfieldComponent implements ControlValueAccessor, OnInit, AfterViewInit {

    @ViewChild('box', { static: false }) boxTextfield;

    @Output() handlerError = new EventEmitter<any>();
    // tslint:disable-next-line: no-output-native
    @Output() focus = new EventEmitter<any>();
    @Input() submit$: Observable<boolean> = new Observable();
    @Input() id = '';
    @Input() text = '';
    @Input() autocomplete = 'on';
    @Input() disabled = false;
    @Input() mask: string;
    @Input() prefix: string;
    @Input() suffix: string;
    @Input() hiddenInput: any;

    @Input() dispatchSuccess: string;
    @Input() dispatchHint: string;
    @Input() dispatchError: string;
    @Input() notControlMessage = false;

    @Input() public control: FormControl;

    private statusChangesSubscription: Subscription;
    private data: any;

    @Input()
    set type(type: string) {
        switch (type) {
            case TextfieldComponentType.TEXT: {
                this.typeInput = TextfieldComponentType.TEXT;
                break;
            }
            case TextfieldComponentType.PASSWORD: {
                this.typeInput = TextfieldComponentType.PASSWORD;
                break;
            }
            case TextfieldComponentType.PHONE: {
                this.typeInput = TextfieldComponentType.PHONE;
                break;
            }
            default: {
                this.typeInput = TextfieldComponentType.TEXT;
            }
        }
    }
    public typeInput = TextfieldComponentType.TEXT;

    @Input()
    set momentOfValidate(momentOfValidate: string) {
        switch (momentOfValidate) {
            case MomentValidateTexfield.ONFOCUS: {
                this.moment = MomentValidateTexfield.ONFOCUS;
                break;
            }
            case MomentValidateTexfield.OUTFOCUS: {
                this.moment = MomentValidateTexfield.OUTFOCUS;
                break;
            }
            case MomentValidateTexfield.SUBMIT: {
                this.moment = MomentValidateTexfield.SUBMIT;
                break;
            }
            default: {
                this.moment = MomentValidateTexfield.OUTFOCUS;
            }
        }
    }
    public moment = MomentValidateTexfield.OUTFOCUS;

    public typeValidators = [];
    public isFocusLine = false;
    public isErrorLine = false;
    public isSuccessLine = false;
    public showCustomValidation = true;
    private validationMoment: Subject<any> = new Subject();
    public validationMoment$ = this.validationMoment.asObservable();
    public errors: any;

    public value: any;

    public controlMessagesProyection = false;
    public checkboxProyection: boolean;

    flagRequired = false;

    constructor(private cdRef: ChangeDetectorRef) { }

    ngOnInit(): void {
        this.createForm();

        if (this.disabled){
            this.control.disable();
        }

        if (this.control.validator === Validators.required) {
            this.flagRequired = this.control.validator === Validators.required;
        }

        this.submit$.subscribe((result) => {
            if (result) {
                this.moment = MomentValidateTexfield.OUTFOCUS;
                const event = { type: 'outfocus' };
                this.focusOutFunction(event);
            }
            if (!result && result !== null) {
                this.moment = MomentValidateTexfield.SUBMIT;
            }
        });

        this.control.valueChanges.subscribe(() => {
            if (this.control.dirty) {
                this.isFocusLine = true;
                this.isErrorLine = false;
                this.isSuccessLine = false;
            }

            if (this.moment === MomentValidateTexfield.ONFOCUS) {
                this.validationMoment.next(true);
                this.statusLinesErrorSuccess();
                this.isRequired();
            }

            this.writeValue(this.control.value);
        });
    }

    ngAfterViewInit() {
        const controlMessages = this.boxTextfield.nativeElement.querySelectorAll('[ControlMessages]');
        if (controlMessages.length > 0) {
            this.controlMessagesProyection = true;
        }

        if (this.notControlMessage) {
            this.controlMessagesProyection = this.notControlMessage;
        }

        const containerIcon = this.boxTextfield.nativeElement.querySelectorAll('.checkbox-container');
        if (containerIcon.length > 0) {
            this.checkboxProyection = true;
        }
        this.cdRef.detectChanges();
    }

    focusFunction() {
        this.isFocusLine = true;
        this.focus.next({ focusOn: true });
        // this.focus.emit({ focusOn: true });
        this.isRequired();
    }

    focusOutFunction(event) {
        if (event.type === 'focusout') {
            this.isFocusLine = false;
            this.focus.next({ focusOut: true });
            // this.focus.emit({ focusOut: true });
        }

        if (this.moment === MomentValidateTexfield.OUTFOCUS || this.moment === MomentValidateTexfield.ONFOCUS) {
            this.validationMoment.next(true);
            this.statusLinesErrorSuccess();
        }
    }

    statusLinesErrorSuccess() {
        this.isSuccessLine = false;
        if (this.errors && this.errors[0] !== 'success') {
            this.isErrorLine = true;
        }
    }

    handleControl(event) {
        this.errors = Object.keys(event);
        this.handlerError.emit(this.errors);
        this.isErrorLine = false;
        if (this.errors[0] === 'success' && this.dispatchSuccess) {
            this.isSuccessLine = true;
        }
    }

    isRequired() {
        if (this.errors && this.errors[0] === 'required') {
            this.validationMoment.next(false);
            this.isErrorLine = false;
        }
    }

    createForm() {
        if (this.control === undefined) {
            this.control = new FormControl('');
        }
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
