import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/component';
import { KeypressService, DocumentService, NavigatorService, BeforeunloadService } from 'src/app/utils';
import { Subscription, Subject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FORMS_CUSTOM_VALIDATORS } from 'src/app/component/form';
import * as moment from 'moment';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, OnDestroy {

    newProyectFormGroup: FormGroup;

    projectTypes = [];
    projectStates = [];
    projectRisks = [];
    managementAreasInCharge = [];
    priorities = [];
    complexityLevels = [];
    areas = [];
    regions = [];

    projectTypeSelected = {
        id: null,
        description: null,
        disabled: false
    };
    projectStateSelected = {
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
    // public sessionId = '98a2e0ea54674182b93fc5b7fc8e14e2';
    public projectId: number;
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
    disabledPurchaseNumber = true;

    historicalDescription: string;

    private loggedUserInfo: any;

    private flagBeforunload = true;

    hoursMin = 0;
    hoursMax = 99999999;

    docIsNew = false;

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
        this.docIsNew = this.proyectAcction === 'new';
        if (!this.docIsNew) {
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

        this.disableExistentDocFields();
        this.disableReadOnlyFields();
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

            estimatedHours: new FormControl('', [Validators.min(this.hoursMin), Validators.max(this.hoursMax)]),
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
            complexityLevel: new FormControl(''),
            area: new FormControl(''),
            region: new FormControl(''),
        },
        this.formValidators.bind(this)
        );
    }

    cargarNewProject() {
        this.newProyectService.getNewProyect(this.sessionId).subscribe((response) => {
            if (response) {
                setTimeout(() => {
                    this.cargarCombos(response);
                    this.loadFilds(response);
                }, 200);
            }
        });
    }

    cargarCombos(response) {

        if (response) {
            this.projectTypes = response.proyecto.keywords[0].options;

            this.projectStates = response.proyecto.keywords[1].options;

            this.projectRisks = response.proyecto.keywords[2].options;

            this.managementAreasInCharge = response.proyecto.keywords[3].options;

            this.priorities = response.proyecto.keywords[4].options;

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
                }, 200);
            }
        });
    }

    private loadFilds(response) {
        this.managementAreaInChargeDisabled = false;
        this.newProyectFormGroup.get('id').setValue(response.proyecto.id.value);
        this.newProyectFormGroup.get('name').setValue(response.proyecto.projectName.value);

        this.clientSelected.id = response.proyecto.customerId.value;
        this.clientSelected.description = response.proyecto.customer.value;
        this.newProyectFormGroup.get('client').setValue(this.clientSelected);

        this.sponsorSelected.id = response.proyecto.sponsorid.value;
        this.sponsorSelected.description = response.proyecto.sponsor.value;
        this.newProyectFormGroup.get('sponsor').setValue(this.sponsorSelected);

        this.coordinatorSelected.id = response.proyecto.coordinatorId.value;
        this.coordinatorSelected.description = response.proyecto.coordinator.value;
        this.newProyectFormGroup.get('coordinator').setValue(this.coordinatorSelected);

        this.requestedByUserSelected.id = response.proyecto.requestedByUserId.value;
        this.requestedByUserSelected.description = response.proyecto.requestedByUser.value;
        this.newProyectFormGroup.get('requestedbyuser').setValue(this.requestedByUserSelected);

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
            this.projectTypeSelected = {
                id: response.proyecto.projectTypeId.value,
                description: response.proyecto.projectType.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('projectType').setValue(this.projectTypeSelected);

        if (response.proyecto.projectStateId.value) {
            this.projectStateSelected = {
                id: response.proyecto.projectStateId.value,
                description: response.proyecto.projectState.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('state').setValue(this.projectStateSelected);

        if (response.proyecto.managementAreaInChargeId.value) {
            this.managementAreaInChargeSelected = {
                id: response.proyecto.managementAreaInChargeId.value,
                description: response.proyecto.managementAreaInCharge.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('managementAreaInCharge').setValue(this.managementAreaInChargeSelected);

        if (response.proyecto.projRiesgoId.value) {
            this.projectRiskSelected = {
                id: response.proyecto.projRiesgoId.value,
                description: response.proyecto.projRiesgo.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('projectRisk').setValue(this.projectRiskSelected);

        if (response.proyecto.priorityId.value) {
            this.prioritySelected = {
                id: response.proyecto.priorityId.value,
                description: response.proyecto.priority.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('priority').setValue(this.prioritySelected);

        if (response.proyecto.areaId.value) {
            this.areaSelected = {
                id: response.proyecto.areaId.value,
                description: response.proyecto.area.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('area').setValue(this.areaSelected);

        if (response.proyecto.regionId.value) {
            this.regionSelected = {
                id: response.proyecto.regionId.value,
                description: response.proyecto.region.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('region').setValue(this.regionSelected);

        if (response.proyecto.complexityLevelId.value) {
            this.complexityLevelSelected = {
                id: response.proyecto.complexityLevelId.value,
                description: response.proyecto.complexitylevel.value,
                disabled: false
            };
        }
        this.newProyectFormGroup.get('complexityLevel').setValue(this.complexityLevelSelected);
    }

    validForm(): boolean {
        // tener en cuenta que para esto hay que ver que combos son obligatorios
        return this.newProyectFormGroup.valid
            && this.newProyectFormGroup.get('client').value.id
            && this.newProyectFormGroup.get('projectType').value.id;
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
        const project = {
            projectName: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('name').value,
            },
            projectType: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('projectType').value.description,
            },
            projectTypeId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('projectType').value.id,
            },
            projectState: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('state').value.description,
            },
            projectStateId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('state').value.id,
            },
            startDate: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('dateStart').value,
            },
            endDate: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('dateEnd').value,
            },
            sinOrdenCompra: {
                visible: true,
                enabled: true,
                value: this.disabledPurchaseNumber ? 0 : 1,
            },
            repositorioSvn: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('repositorySVN').value,
            },
            nDeCompra: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('purchaseNumber').value,
            },
            estimatedHours: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('estimatedHours').value,
            },
            realHours: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('realHours').value,
            },
            solvedpercent: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('solvedpercent').value,
            },
            realStartDate: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('dateStartReal').value,
            },
            realEndDate: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('dateEndReal').value,
            },
            customer: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('client').value.description,
            },
            customerId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('client').value.id,
            },
            projRiesgo: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('projectRisk').value.description,
            },
            projRiesgoId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('projectRisk').value.id,
            },
            id: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('id').value,
            },
            displayname: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('displayname').value,
            },
            description: {
                visible: true,
                enabled: true,
                value: this.buildDescription(),
            },
            managementAreaInCharge: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('managementAreaInCharge').value.description,
            },
            managementAreaInChargeId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('managementAreaInCharge').value.id,
            },
            sponsor: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('sponsor').value.description,
            },
            sponsorid: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('sponsor').value.id,
            },
            coordinator: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('coordinator').value.description,
            },
            coordinatorid: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('coordinator').value.id,
            },
            priority: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('priority').value.description,
            },
            priorityId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('priority').value.id,
            },
            complexitylevel: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('complexityLevel').value.description,
            },
            complexityLevelId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('complexityLevel').value.id,
            },
            area: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('area').value.description,
            },
            areaId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('area').value.id,
            },
            region: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('region').value.description,
            },
            regionId: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('region').value.id,
            },
            qualitativeBenefits: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('qualitativebenefits').value,
            },
            quantitativeBenefits: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('quantitativebenefits').value,
            },
            comments: {
                visible: true,
                enabled: true,
                value: null
            },
            requestedbyuser: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('requestedbyuser').value.description,
            },
            requestedbyuserid: {
                visible: true,
                enabled: true,
                value: this.newProyectFormGroup.get('requestedbyuser').value.id,
            },
            keywords: []
        };
        this.sanitizeValues(project);
        return {
            proyecto: project,
        };
    }

    buildDescription() {
        if (this.newProyectFormGroup.get('description').value) {
            const valueNewDescription = this.newProyectFormGroup.get('description').value;
            let aux = `${new Date().toLocaleString()} - ${this.loggedUserInfo}: ${valueNewDescription} ; `;
            aux += this.historicalDescription || '';
            return aux;
        } else {
            return this.historicalDescription;
        }
    }

    formValidators(formGroup: FormGroup){
        const dateStartControl = formGroup.get('dateStart');
        const dateEndControl = formGroup.get('dateEnd');
        const dateStartRealControl = formGroup.get('dateStartReal');
        const dateEndRealControl = formGroup.get('dateEndReal');

        const dateStart = dateStartControl.value;
        const dateEnd = dateEndControl.value;
        const dateStartReal = dateStartRealControl.value;
        const dateEndReal = dateEndRealControl.value;

        dateEndControl.setErrors(null);
        if (dateEnd && !dateStart) {
            dateEndControl.setErrors({ 'startDateIsNotSet': true })
        } else {
            if (dateEnd && !dateEnd.isSameOrAfter(dateStart, 'day')) {
                dateEndControl.setErrors({ 'dateIsNotGreaterThanStartDate': true })
            }
        }

        dateEndRealControl.setErrors(null);
        if (dateEndReal && !dateStartReal) {
            dateEndRealControl.setErrors({ 'startDateIsNotSet': true })
        } else {
            if (dateEndReal && !dateEndReal.isSameOrAfter(dateStartReal, 'day')) {
                dateEndRealControl.setErrors({ 'dateIsNotGreaterThanStartDate': true })
            }
        }
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
                            this.docIsNew = false;
                            this.disableExistentDocFields();
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

    private getValidValueOrNull(value) {
        // tslint:disable-next-line: use-isnan
        if (value === undefined || value === NaN || value === '') {
            return null;
        } else {
            return value;
        }
    }

    private sanitizeValues(project) {
        for (const [key] of Object.entries(project)) {
            project[key].value = this.getValidValueOrNull(project[key].value);
        }
    }

    disableExistentDocFields(){
        if (!this.docIsNew) {
            /*this.newProyectFormGroup.get('name').disable();*/
        }
    }

    disableReadOnlyFields(){
        this.newProyectFormGroup.get('realHours').disable();
        this.newProyectFormGroup.get('solvedpercent').disable();
    }

    ngOnDestroy() {
        if (this.keypressSubscription) {
            this.keypressSubscription.unsubscribe();
        }
    }
}
