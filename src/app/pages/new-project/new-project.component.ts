import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/component';
import { KeypressService, DocumentService, NavigatorService, BeforeunloadService } from 'src/app/utils';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FORMS_CUSTOM_VALIDATORS } from 'src/app/component/form';
import { greaterThanTodayValidator, greaterThanDateValidator } from 'src/app/custom-validators/date.validator';
import * as moment from 'moment';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {

    newProyectFormGroup: FormGroup;

    typeProject = [];
    stateProject = [];
    projectRisk = [];
    managementAreaInCharge = [];
    priority = [];
    complexityLevels = [];
    areas = [];
    regions = [];

    typeProjectSelected = {
        id: null,
        description: null,
        disabled: false
    };
    stateProjectSelected = {
        id: null,
        description: null,
        disabled: false
    };
    projectRiskSelected = {
        id: null,
        description: null,
        disabled: false
    };
    managementAreaInChargeSelected = {
        id: null,
        description: null,
        disabled: false
    };
    prioritySelected = {
        id: null,
        description: null,
        disabled: false
    };
    complexityLevelSelected = {
        id: null,
        description: null,
        disabled: false
    };
    areaSelected = {
        id: null,
        description: null,
        disabled: false
    };
    regionSelected = {
        id: null,
        description: null,
        disabled: false
    };

    errorMessage; string;

    errorMessageDate = '';

    saveText = 'Guardar';
    saveAndExitText = 'Guardar y salir';

    public sessionId: string;
    // public sessionId = '5047a0e4dcd5441082527100b3ad1d1d';
    public projectId: number;
    public proyectName: string;
    public backtofld: number;
    private proyectAcction: string;

    managementAreaInChargeDisabled = false;

    private flagClose = false;

    keypressSubscription: Subscription;

    sponsorSelected = { id: null, description: '', disabled: false };

    clientSelected = { id: null, description: '', disabled: false };

    coordinatorSelected = { id: null, description: '', disabled: false };

    requestedByUserSelected = { id: null, description: '', disabled: false };

    checkbox = { id: 1, disabled: false, selected: false, indeterminate: false, text: 'Sin número' };
    disabledPurchaseNumber = false;

    historicalDescription: string;

    private loggedUserInfo: any;

    private flagBeforunload = true;


    constructor(
        private newProyectService: NewProjectService,
        private cookieService: CookieService,
        private modalServiceNg: ModalService,
        private documentService: DocumentService,
        private beforeunloadService: BeforeunloadService,
        @Inject(FORMS_CUSTOM_VALIDATORS) private customValidators: any,
        private router: Router) { }


    ngOnInit() {
        this.beforeunloadService.beforeunload().subscribe((data) => {
            if (this.flagBeforunload) {
                data.preventDefault();
                data.returnValue = '';
            }
        });

        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        this.router.routerState.root.queryParams.forEach((item) => {
            this.projectId = item.doc_id;
            this.proyectAcction = item.action;
            this.backtofld = item.backtofld;
        });
        if (this.projectId && this.proyectAcction === 'open') {
            this.saveText = 'Modificar';
            this.saveAndExitText = 'Modificar y salir';
            this.openProyect(this.projectId);
        } else {
            this.cargarNewProject();
        }
        this.createForm();

        this.newProyectService.loggedUserInfo(this.sessionId).subscribe((response) => {
            if (response) {
                this.loggedUserInfo = response.usuario.userFullName.value;
            }
        });
    }

    handlerErrorDate(event) {
        if (event[0] === 'maskserror') {
            this.errorMessageDate = 'La fecha no es válida.';
        }
    }

    createForm() {
        this.newProyectFormGroup = new FormGroup({
            id: new FormControl(''),
            client: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
            projectType: new FormControl(''),
            state: new FormControl(''),

            qualitativebenefits: new FormControl(''),
            quantitativebenefits: new FormControl(''),

            dateStart: new FormControl(''),
            dateEnd: new FormControl(''),
            dateStartReal: new FormControl(''),
            dateEndReal: new FormControl(''),

            estimatedHours: new FormControl(''),
            realHours: new FormControl(''),

            repositorySVN: new FormControl(''),
            purchaseNumber: new FormControl(''),
            projectRisk: new FormControl(''),
            managementAreaInCharge: new FormControl(''),
            description: new FormControl(''),
            sponsor: new FormControl(''),
            coordinator: new FormControl(''),
            requestedbyuser: new FormControl(''),
            displayname: new FormControl(''),
            priority: new FormControl(''),
            solvedpercent: new FormControl(''),
        });
    }

    cargarNewProject() {
        this.newProyectService.getNewProyect(this.sessionId).subscribe((response) => {
            if (response) {
                setTimeout(() => {
                    this.cargarCombos(response);
                    this.loadFilds(response);
                    this.initDateValidations();
                }, 200);
            }
        });
    }

    cargarCombos(response) {

        if (response) {
            this.typeProject = response.proyecto.keywords[0].options;

            this.stateProject = response.proyecto.keywords[1].options;

            this.projectRisk = response.proyecto.keywords[2].options;

            this.managementAreaInCharge = response.proyecto.keywords[3].options;

            this.priority = response.proyecto.keywords[4].options;

            this.complexityLevels = response.proyecto.keywords[5].options;

            this.areas = response.proyecto.keywords[6].options;

            this.regions = response.proyecto.keywords[7].options;
        }
    }

    openProyect(projectId: number) {
        this.newProyectService.getOpenProyect(projectId, this.sessionId).subscribe((response) => {
            if (response) {
                setTimeout(() => {
                    this.cargarCombos(response);
                    this.loadFilds(response);
                    this.initDateValidations();
                }, 200);
            }
        });
    }

    private loadFilds(response) {
        this.managementAreaInChargeDisabled = false;
        this.newProyectFormGroup.get('id').setValue(response.proyecto.id.value);
        this.newProyectFormGroup.get('name').setValue(response.proyecto.projectName.value);
        this.proyectName = response.proyecto.projectName.value;


        this.newProyectFormGroup.get('client').setValue(response.proyecto.customer.value);
        this.clientSelected.id = response.proyecto.customerId.value;
        this.clientSelected.description = response.proyecto.customer.value;

        this.newProyectFormGroup.get('sponsor').setValue(response.proyecto.sponsor.value);
        this.sponsorSelected.id = response.proyecto.sponsorid.value;
        this.sponsorSelected.description = response.proyecto.sponsor.value;

        this.newProyectFormGroup.get('coordinator').setValue(response.proyecto.coordinator.value);
        this.coordinatorSelected.id = response.proyecto.coordinatorId.value;
        this.coordinatorSelected.description = response.proyecto.coordinator.value;

        this.newProyectFormGroup.get('requestedbyuser').setValue(response.proyecto.requestedByUser.value);
        this.requestedByUserSelected.id = response.proyecto.requestedByUserId.value;
        this.requestedByUserSelected.description = response.proyecto.requestedByUser.value;

        this.newProyectFormGroup.get('displayname').setValue(response.proyecto.displayname.value);

        // historicalDescription
        this.historicalDescription = response.proyecto.description.value;
        // this.newProyectFormGroup.get('description').setValue(response.proyecto.description.value);

        this.newProyectFormGroup.get('qualitativebenefits').setValue(response.proyecto.qualitativeBenefits.value);
        this.newProyectFormGroup.get('quantitativebenefits').setValue(response.proyecto.quantitativeBenefits.value);

        // queda armar la parte de que si viene el sin 'sinOrdenCompra'
        this.newProyectFormGroup.get('purchaseNumber').setValue(response.proyecto.nDeCompra.value);
        this.disabledPurchaseNumber = response.proyecto.sinOrdenCompra.value === 1 ? false : true;
        this.checkbox.selected = response.proyecto.sinOrdenCompra.value === 1 ? false : true;
        this.newProyectFormGroup.get('repositorySVN').setValue(response.proyecto.repositorioSvn.value);
        if (response.proyecto.startDate.value) {
            this.newProyectFormGroup.get('dateStart').setValue(
                moment(response.proyecto.startDate.value));
        }
        if (response.proyecto.endDate.value) {
            this.newProyectFormGroup.get('dateEnd').setValue(
                moment(response.proyecto.endDate.value));
        }
        if (response.proyecto.realStartDate.value) {
            this.newProyectFormGroup.get('dateStartReal').setValue(
                moment(response.proyecto.realStartDate.value));
        }
        if (response.proyecto.realEndDate.value) {
            this.newProyectFormGroup.get('dateEndReal').setValue(
                moment(response.proyecto.realEndDate.value));
        }
        this.newProyectFormGroup.get('estimatedHours').setValue(
            response.proyecto.estimatedHours.value === 0 ? '' : response.proyecto.estimatedHours.value);
        this.newProyectFormGroup.get('realHours').setValue(
            response.proyecto.realHours.value === 0 ? '' : response.proyecto.realHours.value);
        this.newProyectFormGroup.get('solvedpercent').setValue(
            response.proyecto.solvedpercent.value === 0 ? '' : response.proyecto.solvedpercent.value);

        // combos
        if (response.proyecto.projectTypeId.value) {
            this.typeProjectSelected = {
                id: response.proyecto.projectTypeId.value,
                description: response.proyecto.projectType.value,
                disabled: false
            };
        }
        if (response.proyecto.projectStateId.value) {
            this.stateProjectSelected = {
                id: response.proyecto.projectStateId.value,
                description: response.proyecto.projectState.value,
                disabled: false
            };
        }
        if (response.proyecto.managementAreaInChargeId.value) {
            this.managementAreaInChargeDisabled =
                this.typeProjectSelected.id === 4370 && this.projectId ? true : false;
            this.managementAreaInChargeSelected = {
                id: response.proyecto.managementAreaInChargeId.value,
                description: response.proyecto.managementAreaInCharge.value,
                disabled: false
            };
        }
        if (response.proyecto.projRiesgoId.value) {
            this.projectRiskSelected = {
                id: response.proyecto.projRiesgoId.value,
                description: response.proyecto.projRiesgo.value,
                disabled: false
            };
        }
        if (response.proyecto.priorityId.value) {
            this.prioritySelected = {
                id: response.proyecto.priorityId.value,
                description: response.proyecto.priority.value,
                disabled: false
            };
        }

        if (response.proyecto.areaId.value) {
            this.areaSelected = {
                id: response.proyecto.areaId.value,
                description: response.proyecto.area.value,
                disabled: false
            };
        }

        if (response.proyecto.regionId.value) {
            this.regionSelected = {
                id: response.proyecto.regionId.value,
                description: response.proyecto.region.value,
                disabled: false
            };
        }

        if (response.proyecto.complexityLevelId.value) {
            this.complexityLevelSelected = {
                id: response.proyecto.complexityLevelId.value,
                description: response.proyecto.complexitylevel.value,
                disabled: false
            };
        }
    }

    private transformDateToString(value): any {
        if (!value) {
            return value;
        }
        return `${value.slice(8, 10)}${value.slice(5, 7)}${value.slice(0, 4)}`;
    }

    selectedItem(item, select: string) {
        if (item && select) {
            switch (select) {
                case 'typeProject': {
                    this.typeProjectSelected = item;
                    break;
                }
                case 'stateProject': {
                    this.stateProjectSelected = item;
                    break;
                }
                case 'projectRisk': {
                    this.projectRiskSelected = item;
                    break;
                }
                case 'managementAreaInCharge': {
                    this.managementAreaInChargeSelected = item;
                    break;
                }
                case 'priority': {
                    this.prioritySelected = item;
                    break;
                }
                case 'complexityLevel': {
                    this.complexityLevelSelected = item;
                    break;
                }
                case 'area': {
                    this.areaSelected = item;
                    break;
                }
                case 'region': {
                    this.regionSelected = item;
                    break;
                }
            }
        }
    }

    itemSelectedPredictiveSponsor(event) {
        if (event.id) {
            this.sponsorSelected = event;
        }
    }

    itemSelectedPredictiveClients(event) {
        if (event.id) {
            this.clientSelected = event;
        }
    }

    itemSelectedPredictiveCoordinators(event) {
        if (event.id) {
            this.coordinatorSelected = event;
        }
    }

    itemSelectedPredictiveRequestedByUsers(event) {
        if (event.id) {
            this.requestedByUserSelected = event;
        }
    }

    validForm(): boolean {
        // tener en cuenta que para esto hay que ver que combos son obligatorios
        return this.newProyectFormGroup.valid
            && this.clientSelected.id !== null
            && this.typeProjectSelected.id !== null;
    }

    checkSelectedPurchaseNumber() {
        this.checkbox.selected = !this.checkbox.selected;
        this.disabledPurchaseNumber = !this.disabledPurchaseNumber;
        if (this.disabledPurchaseNumber) {
            this.newProyectFormGroup.get('purchaseNumber').disable();
        } else {
            this.newProyectFormGroup.get('purchaseNumber').enable();
        }
        this.newProyectFormGroup.get('purchaseNumber').reset();
    }

    private buildForm() {
        return {
            proyecto: {
                projectName: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('name').value
                },
                projectType: {
                    visible: true,
                    enabled: true,
                    value: this.typeProjectSelected.description ? this.typeProjectSelected.description : null
                },
                projectTypeId: {
                    visible: true,
                    enabled: true,
                    value: this.typeProjectSelected.id ? this.typeProjectSelected.id : null
                },
                projectState: {
                    visible: true,
                    enabled: true,
                    value: this.stateProjectSelected.description ? this.stateProjectSelected.description : null
                },
                projectStateId: {
                    visible: true,
                    enabled: true,
                    value: this.stateProjectSelected.id ? this.stateProjectSelected.id : null
                },
                startDate: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('dateStart').value || null,
                },
                endDate: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('dateEnd').value || null,
                },
                sinOrdenCompra: {
                    visible: true,
                    enabled: true,
                    value: this.disabledPurchaseNumber ? 0 : 1
                },
                repositorioSvn: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('repositorySVN').value
                },
                nDeCompra: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('purchaseNumber').value === '' ?
                        null : this.newProyectFormGroup.get('purchaseNumber').value
                },
                estimatedHours: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('estimatedHours').value === '' ?
                        null : +this.newProyectFormGroup.get('estimatedHours').value
                },
                realHours: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('realHours').value === '' ?
                        null : +this.newProyectFormGroup.get('realHours').value
                },
                solvedpercent: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('solvedpercent').value === '' ?
                        null : +this.newProyectFormGroup.get('solvedpercent').value
                },
                realStartDate: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('dateStartReal').value || null,
                },
                realEndDate: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('dateEndReal').value || null,
                },
                customer: {
                    visible: true,
                    enabled: true,
                    value: this.clientSelected.description ? this.clientSelected.description : null
                },
                customerId: {
                    visible: true,
                    enabled: true,
                    value: this.clientSelected.id ? this.clientSelected.id : null
                },
                projRiesgo: {
                    visible: true,
                    enabled: true,
                    value: this.projectRiskSelected.description ? this.projectRiskSelected.description : null
                },
                projRiesgoId: {
                    visible: true,
                    enabled: true,
                    value: this.projectRiskSelected.id ? this.projectRiskSelected.id : null
                },
                id: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('id').value === '' ?
                        null : this.newProyectFormGroup.get('id').value
                },
                displayname: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('displayname').value
                },
                description: {
                    visible: true,
                    enabled: true,
                    value: this.buildDescription(),
                },
                managementAreaInCharge: {
                    visible: true,
                    enabled: true,
                    value: this.managementAreaInChargeSelected.description ? this.managementAreaInChargeSelected.description : null
                },
                managementAreaInChargeId: {
                    visible: true,
                    enabled: true,
                    value: this.managementAreaInChargeSelected.id ? this.managementAreaInChargeSelected.id : null
                },
                sponsor: {
                    visible: true,
                    enabled: true,
                    value: this.sponsorSelected.description ? this.sponsorSelected.description : null
                },
                sponsorid: {
                    visible: true,
                    enabled: true,
                    value: this.sponsorSelected.id ? this.sponsorSelected.id : null
                },
                coordinator: {
                    visible: true,
                    enabled: true,
                    value: this.coordinatorSelected.description ? this.coordinatorSelected.description : null
                },
                coordinatorid: {
                    visible: true,
                    enabled: true,
                    value: this.coordinatorSelected.id ? this.coordinatorSelected.id : null
                },
                priority: {
                    visible: true,
                    enabled: true,
                    value: this.prioritySelected.description ? this.prioritySelected.description : null
                },
                priorityId: {
                    visible: true,
                    enabled: true,
                    value: this.prioritySelected.id ? this.prioritySelected.id : null
                },
                complexitylevel: {
                    visible: true,
                    enabled: true,
                    value: this.complexityLevelSelected.description ? this.complexityLevelSelected.description : null
                },
                complexityLevelId: {
                    visible: true,
                    enabled: true,
                    value: this.complexityLevelSelected.id ? this.complexityLevelSelected.id : null
                },
                area: {
                    visible: true,
                    enabled: true,
                    value: this.areaSelected.description ? this.areaSelected.description : null
                },
                areaId: {
                    visible: true,
                    enabled: true,
                    value: this.areaSelected.id ? this.areaSelected.id : null
                },
                region: {
                    visible: true,
                    enabled: true,
                    value: this.regionSelected.description ? this.regionSelected.description : null
                },
                regionId: {
                    visible: true,
                    enabled: true,
                    value: this.regionSelected.id ? this.regionSelected.id : null
                },
                qualitativeBenefits: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('qualitativebenefits').value
                },
                quantitativeBenefits: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('quantitativebenefits').value
                },
                comments: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                requestedbyuser: {
                    visible: true,
                    enabled: true,
                    value: this.requestedByUserSelected.description ? this.requestedByUserSelected.description : null
                },
                requestedbyuserid: {
                    visible: true,
                    enabled: true,
                    value: this.requestedByUserSelected.id ? this.requestedByUserSelected.id : null
                },
                keywords: []
            }
        };
    }

    buildDescription() {
        if (this.newProyectFormGroup.get('description').value !== '') {
            let aux = `${moment().toLocaleString()} - ${this.loggedUserInfo} : ${this.newProyectFormGroup.get('description').value};`;
            aux += this.historicalDescription;
            return aux;
        }
        return this.historicalDescription;
    }

    initDateValidations() {
        const dateStartControl = this.newProyectFormGroup.get('dateStart');
        const dateEndControl = this.newProyectFormGroup.get('dateEnd');
        const dateStartRealControl = this.newProyectFormGroup.get('dateStartReal');
        const dateEndRealControl = this.newProyectFormGroup.get('dateEndReal');

        const dateStartDefaultValidator = dateStartControl.validator;
        const dateEndDefaultValidator = dateEndControl.validator;
        const dateStartRealDefaultValidator = dateStartRealControl.validator;
        const dateEndRealDefaultValidator = dateEndRealControl.validator;

        dateStartControl.setValidators([dateStartDefaultValidator,greaterThanTodayValidator]);
        if (dateStartControl.value) {
            dateEndControl.setValidators([dateEndDefaultValidator, greaterThanDateValidator(dateStartControl.value)]);
        }
        dateStartControl.valueChanges.subscribe(
            () => {
                if (dateStartControl.value){
                    dateEndControl.setValidators([dateEndDefaultValidator, greaterThanDateValidator(dateStartControl.value)]);
                } else {
                    dateEndControl.setValidators(dateEndDefaultValidator);
                }
                dateEndControl.updateValueAndValidity();
            }
        );

        dateStartRealControl.setValidators([dateStartRealDefaultValidator, greaterThanTodayValidator]);
        if (dateStartRealControl.value) {
            dateEndRealControl.setValidators([dateEndRealDefaultValidator, greaterThanDateValidator(dateStartRealControl.value)]);
        }
        dateStartRealControl.valueChanges.subscribe(
            () => {
                if (dateStartRealControl.value){
                    dateEndRealControl.setValidators([dateEndRealDefaultValidator, greaterThanDateValidator(dateStartRealControl.value)]);
                } else {
                    dateEndRealControl.setValidators(dateEndRealDefaultValidator);
                }
                dateEndRealControl.updateValueAndValidity();
            }
        );
    }

    save() {
        if (this.validForm()) {
            if (this.projectId) {
                this.newProyectService.putChangeProject(this.buildForm(), this.projectId, this.sessionId).subscribe((response) => {
                    if (response) {
                        if (response.message) {
                            window.alert(response.message[0]);
                        }
                        if (response.message === null) {
                            window.alert('Se modificó el documento de manera exitosa.');
                        }
                        if (response.status === 200 && this.flagClose) {
                            this.close();
                        }
                    }
                });
            } else {
                this.newProyectService.putSaveProject(this.buildForm(), this.sessionId).subscribe((response) => {
                    if (response) {
                        if (response.id) {
                            window.alert(response.message[0] + ` ID de proyecto: ${response.id.toFixed(0)}.`);
                        } else {
                            window.alert(response.message[0]);
                        }
                        if (response.status === 200) {
                            this.projectId = response.docId;
                            this.changeTextButtons();
                            if (this.flagClose) {
                                this.close();
                            }
                        }
                    }
                });
            }
        }
    }


    saveAndClose() {
        if (this.validForm()) {
            this.flagBeforunload = false;
            this.save();
            this.flagClose = true;
        }
    }

    private changeTextButtons() {
        if (this.projectId) {
            this.saveText = 'Modificar';
            this.saveAndExitText = 'Modificar y salir';
            this.openProyect(this.projectId);
        }
    }

    // modal
    close() {
        this.flagClose = false;
        document.location.href = `${environment.addresses.closeProject.close}${this.backtofld}`;
    }

    openDialog() {
        this.modalServiceNg.open('requirement');
    }

    closeModal() {
        this.modalServiceNg.close('requirement');
    }

    closeModalForOtherMotive(event?) {
        if (this.documentService.nativeDocument.body.querySelectorAll('app-modal').length > 0) {
            this.closeModal();
        }
    }

    ngOnDestroy() {
        if (this.keypressSubscription) {
            this.keypressSubscription.unsubscribe();
        }
    }
}
