import { Component, OnInit, AfterViewInit, OnDestroy, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequierementsService } from 'src/app/services/requirements.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/component';
import { NavigatorService, KeypressService, DocumentService, BeforeunloadService } from 'src/app/utils/index';
import { Subscription } from 'rxjs';
import { environment } from 'src/environments/environment';
import { HttpParams } from '@angular/common/http';
import { FORMS_CUSTOM_VALIDATORS } from 'src/app/component/form';
import { greaterThanTodayValidator, greaterThanDateValidator } from 'src/app/custom-validators/date.validator';
import * as moment from 'moment';

@Component({
    selector: 'app-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit, AfterViewInit, OnDestroy {
    requirementFormGroup: FormGroup;

    aplications = [];
    aplicationsSelected = {
        id: null,
        description: null,
        disabled: false
    };

    modules = [];
    moduleSelected = {
        id: null,
        description: null,
        disabled: false
    };

    businessProces = [];
    businessProcesSelected = {
        id: null,
        description: null,
        disabled: false
    };

    requirementTypes = [];
    requirementTypeSelected = {
        id: null,
        description: null,
        disabled: false
    };

    mainObjects = [];
    mainObjectSelected = {
        id: null,
        description: null,
        disabled: false
    };

    prioritys = [];
    prioritySelected = {
        id: null,
        description: null,
        disabled: false
    };

    regios = [];
    regioSelected = {
        id: null,
        description: null,
        disabled: false
    };

    areas = [];
    areaSelected = {
        id: null,
        description: null,
        disabled: false
    };

    managementAreas = [];
    managementAreaSelected = {
        id: null,
        description: null,
        disabled: false
    };

    complexityLevels = [];
    complexityLevelSelected = {
        id: null,
        description: null,
        disabled: false
    };

    wkfStates = [];

    errorMessage: string;

    // public sessionId = '7a45de40a093416f91957b166abfc3e3';
    public sessionId: string;
    public projectId: number;
    public requirementId: number;
    public requirementName: string;
    public requirementAcction: string;
    public backtofld: number;

    selectedProject = { id: null, description: null, project: null, disabled: false, customer: null, customerid: null };

    requestedByUser = { id: null, description: null, disabled: false };

    activities = [];

    keypressSubscription: Subscription;

    saveText = 'Guardar';
    saveAndExitText = 'Guardar y salir';

    private requirement: any;
    private requirementLoad: any;

    private flagBeforunload = true;
    private flagClose = false;

    errorMessageDate = '';

    historicalDescription: string;

    constructor(
        private requirementService: RequierementsService,
        private modalServiceNg: ModalService,
        private cookieService: CookieService,
        private keypressService: KeypressService,
        private documentService: DocumentService,
        private deviceDetector: NavigatorService,
        private route: ActivatedRoute,
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
        const auxUsers = {
            userFilter: '',
            userOrder: ''
        };
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        this.router.routerState.root.queryParams.forEach((item) => {
            this.requirementId = item.doc_id;
            this.requirementAcction = item.action;
            this.backtofld = item.backtofld;
        });
        this.loadSelects();
        if (this.requirementId && this.requirementAcction === 'open') {
            this.saveText = 'Modificar';
            this.saveAndExitText = 'Modificar y salir';
            this.openRequirement(this.requirementId);
        }
        if (this.requirementAcction === 'new') {
            this.loadNewRequirement();
        }
        this.createForm();
    }

    ngAfterViewInit() {
        if (this.deviceDetector.isBrowser) {
            this.keypressSubscription = this.keypressService.keyPressEscape().subscribe((response) => {
                if (response === true) {
                    this.closeModalForOtherMotive();
                }
            });
        }
    }

    handlerErrorDate(event) {
        if (event[0] === 'maskserror') {
            this.errorMessageDate = 'La fecha no es válida.';
        }
    }

    createForm() {
        this.requirementFormGroup = new FormGroup({
            id: new FormControl(''),
            createdDate: new FormControl(''),
            creator: new FormControl(''),
            title: new FormControl('', Validators.required),
            state: new FormControl(''),
            createdMonth: new FormControl(''),
            displayName: new FormControl(''),
            organization: new FormControl(''),
            realDateEnd: new FormControl(''),
            description: new FormControl(''),
            requestedByUser: new FormControl(''),
            mainObject: new FormControl(''),

            requestDate: new FormControl(''),
            estimatedDateStart: new FormControl(''),
            estimatedDateEnd: new FormControl(''),

            systemEffortinHours: new FormControl(''),
            usersEffortinHours: new FormControl(''),
            solvedpercent: new FormControl(''),
            releaseNumber: new FormControl(''),
            project: new FormControl('', Validators.required),
        });
    }

    openRequirement(requirementId) {
        this.requirementService.getOpenByDocId(requirementId, this.sessionId).subscribe((response) => {
            if (response) {
                this.loadFilds(response);
                this.initDateValidations();
                if (this.requirementLoad && this.requirementLoad.id.value) {
                    const aux = {
                        filter: `referencestoid = ${this.requirementLoad.id.value}`,
                        order: '',
                        fields: ''
                    };
                    this.requirementService.searchActivities(aux, this.sessionId).subscribe((activities) => {
                        if (activities) {
                            activities.activities.forEach((item) => {
                                const activitie = { id: '', title: '', responsable: '', state: '', linkHorus: '', linkEdit: '' };
                                activitie.id = item.Values.ID;
                                activitie.title = item.Values.SUBJET;
                                activitie.state = item.Values.STATE;
                                activitie.responsable = item.Values.RESPONSIBLE;
                                this.activities.push(activitie);
                            });
                        }
                    });
                }
            }
        });

    }

    private loadSelects() {
        const firstElement = {
            id: null,
            description: null,
            disabled: false
        };
        this.requirementService.getNewSelects(this.sessionId).subscribe((response) => {
            if (response) {
                this.aplications.push(firstElement);
                this.modules.push(firstElement);
                this.businessProces.push(firstElement);
                this.requirementTypes.push(firstElement);
                this.prioritys.push(firstElement);
                this.regios.push(firstElement);
                this.areas.push(firstElement);
                this.managementAreas.push(firstElement);
                this.complexityLevels.push(firstElement);

                response.reqKeywords.keywords[0].options.forEach((item) => {
                    this.aplications.push(item);
                });

                response.reqKeywords.keywords[1].options.forEach((item) => {
                    this.modules.push(item);
                });
                response.reqKeywords.keywords[2].options.forEach((item) => {
                    this.businessProces.push(item);
                });
                response.reqKeywords.keywords[3].options.forEach((item) => {
                    this.requirementTypes.push(item);
                });
                response.reqKeywords.keywords[5].options.forEach((item) => {
                    this.prioritys.push(item);
                });
                response.reqKeywords.keywords[6].options.forEach((item) => {
                    this.regios.push(item);
                });
                response.reqKeywords.keywords[7].options.forEach((item) => {
                    this.areas.push(item);
                });
                response.reqKeywords.keywords[9].options.forEach((item) => {
                    this.managementAreas.push(item);
                });
                response.reqKeywords.keywords[10].options.forEach((item) => {
                    this.complexityLevels.push(item);
                });
                // this.modules = response.reqKeywords.keywords[1].options;
                // this.businessProces = response.reqKeywords.keywords[2].options;
                // this.requirementTypes = response.reqKeywords.keywords[3].options;

                // // este se convirtio en un predictivo pero no busca por filtro al back
                // // solo busca en la carga inicial.
                this.mainObjects = response.reqKeywords.keywords[4].options;
                // this.prioritys = response.reqKeywords.keywords[5].options;
                // this.regios = response.reqKeywords.keywords[6].options;
                // this.areas = response.reqKeywords.keywords[7].options;
                // this.managementAreas = response.reqKeywords.keywords[9].options;
                // this.complexityLevels = response.reqKeywords.keywords[10].options;
            }
        });

    }

    private loadNewRequirement() {
        this.requirementService.getNewRequirements(this.sessionId).subscribe((requirement) => {
            if (requirement) {
                setTimeout(() => {
                    this.loadFilds(requirement);
                    this.initDateValidations();
                }, 200);
            }
        });
    }

    private loadFilds(response) {
        if (response.requerimiento.wkfStates) {
            this.wkfStates = response.requerimiento.wkfStates.value.root.item;
        }
        if (this.wkfStates) {
            this.wkfStates = this.wkfStates.filter(x => x.allowed === '1');
        }
        this.requirementLoad = response.requerimiento;
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id ? response.requerimiento.id.value : null);
        this.requirementFormGroup.get('createdDate').setValue(this.transformDateToString(response.requerimiento.createdDate.value));
        this.requirementFormGroup.get('creator').setValue(response.requerimiento.creator.value);
        this.requirementFormGroup.get('title').setValue(response.requerimiento.title.value);
        this.requirementName = response.requerimiento.title.value;
        this.requirementFormGroup.get('state').setValue(response.requerimiento.state.value);
        this.requirementFormGroup.get('createdMonth').setValue(this.transformDateToString(response.requerimiento.createdMonth.value));
        this.requirementFormGroup.get('displayName').setValue(response.requerimiento.displayName.value);
        this.requirementFormGroup.get('organization').setValue(response.requerimiento.organization.value);
        if (response.requerimiento.fechaFinReal.value) {
            this.requirementFormGroup.get('realDateEnd').setValue(
                moment(response.requerimiento.fechaFinReal.value));
        }
        if (response.requerimiento.requestedDate.value) {
            this.requirementFormGroup.get('requestDate').setValue(
                moment(response.requerimiento.requestedDate.value));
        }
        if (response.requerimiento.estimatedStartDate.value) {
            this.requirementFormGroup.get('estimatedDateStart').setValue(
                moment(response.requerimiento.estimatedStartDate.value));
        }
        if (response.requerimiento.estimatedEndDate.value) {
            this.requirementFormGroup.get('estimatedDateEnd').setValue(
                moment(response.requerimiento.estimatedEndDate.value));
        }
        this.requirementFormGroup.get('solvedpercent').setValue(
            response.requerimiento.solvedpercent.value === 0 ? '' : response.requerimiento.solvedpercent.value
        );

        // historicalDescription systemEffortInHours userEffortInHours usersEffortinHours
        this.historicalDescription = response.requerimiento.description.value;
        // this.requirementFormGroup.get('description').setValue(response.requerimiento.description.value);

        this.requirementFormGroup.get('releaseNumber').setValue(response.requerimiento.releaseNumber.value);

        this.selectedProject.id = response.requerimiento.projectId.value;
        this.selectedProject.description = response.requerimiento.projectDisplayName.value;
        this.selectedProject.project = response.requerimiento.project.value;
        this.selectedProject.customerid = response.requerimiento.customerId.value;
        this.selectedProject.customer = response.requerimiento.customer.value;
        this.requirementFormGroup.get('project').setValue(this.selectedProject);

        this.requestedByUser.id = response.requerimiento.requestedByUserId.value;
        this.requestedByUser.description = response.requerimiento.requestedByUser.value;
        this.requirementFormGroup.get('requestedByUser').setValue(this.requestedByUser);
        
        this.requirementFormGroup.get('systemEffortinHours').setValue(
            response.requerimiento.systemEffortInHours.value === 0 ? '' : response.requerimiento.systemEffortInHours.value);
        this.requirementFormGroup.get('usersEffortinHours').setValue(
            response.requerimiento.userEffortInHours.value === 0 ? '' : response.requerimiento.userEffortInHours.value);


        // combos
        if (response.requerimiento.applicationId.value) {
            this.aplicationsSelected = {
                id: response.requerimiento.applicationId.value,
                description: response.requerimiento.application.value,
                disabled: false
            };
        }
        if (response.requerimiento.moduleId.value) {
            this.moduleSelected = {
                id: response.requerimiento.moduleId.value,
                description: response.requerimiento.module.value,
                disabled: false
            };
        }
        if (response.requerimiento.businessProcessId.value) {
            this.businessProcesSelected = {
                id: response.requerimiento.businessProcessId.value,
                description: response.requerimiento.businessProcess.value,
                disabled: false
            };
        }
        if (response.requerimiento.managementAreaInChargeId.value) {
            this.managementAreaSelected = {
                id: response.requerimiento.managementAreaInChargeId.value,
                description: response.requerimiento.managementAreaInCharge.value,
                disabled: false
            };
        }
        if (response.requerimiento.complexityLevelId.value) {
            this.complexityLevelSelected = {
                id: response.requerimiento.complexityLevelId.value,
                description: response.requerimiento.complexityLevel.value,
                disabled: false
            };
        }
        if (response.requerimiento.areaId.value) {
            this.areaSelected = {
                id: response.requerimiento.areaId.value,
                description: response.requerimiento.area.value,
                disabled: false
            };
        }
        if (response.requerimiento.priorityId.value) {
            this.prioritySelected = {
                id: response.requerimiento.priorityId.value,
                description: response.requerimiento.priority.value,
                disabled: false
            };
        }

        if (response.requerimiento.mainObjectId.value) {
            this.mainObjectSelected = {
                id: response.requerimiento.mainObjectId.value,
                description: response.requerimiento.mainObject.value,
                disabled: false
            };
        }
        this.requirementFormGroup.get('mainObject').setValue(this.mainObjectSelected);

        if (response.requerimiento.requerimentTypeId.value) {
            this.requirementTypeSelected = {
                id: response.requerimiento.requerimentTypeId.value,
                description: response.requerimiento.requerimentType.value,
                disabled: false
            };
        }
    }

    buildDescription() {
        if (this.requirementFormGroup.get('description').value !== '') {
            const valueNewDescription = this.requirementFormGroup.get('description').value;
            let aux = `${new Date().toLocaleString()} - ${this.requirementFormGroup.get('creator').value}: ${valueNewDescription} ; `;
            aux += this.historicalDescription;
            return aux;
        } else {
            return this.historicalDescription;
        }
    }

    private buildForm() {
        const requerimiento = {
            createdDate: this.requirementLoad.createdDate,
            creatorId: this.requirementLoad.creatorId,
            creator: this.requirementLoad.creator,
            title: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('title').value,
            },
            stateId: {
                visible: true,
                enabled: true,
                value: this.requirementLoad.stateId.value,
            },
            state: {
                visible: true,
                enabled: true,
                value: this.requirementLoad.state.value,
            },
            stateType: {
                visible: true,
                enabled: true,
                value: 0,
            },
            lastStateId: this.requirementLoad.lastStateId,
            lastState: this.requirementLoad.lastState,
            lastActionDate: {
                visible: true,
                enabled: true,
                value: null,
            },
            agentActions: {
                visible: true,
                enabled: true,
                value: null,
            },
            notActiveEmails: {
                visible: true,
                enabled: true,
                value: null,
            },
            createdMonth: this.requirementLoad.createdMonth,
            displayName: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('displayName').value
            },
            stateTypeName: {
                visible: true,
                enabled: true,
                value: null,
            },
            idWorkflow: {
                visible: true,
                enabled: true,
                value: 1.0,
            },
            workflow: {
                visible: true,
                enabled: true,
                value: null,
            },
            organization: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('organization').value,
            },
            fechaFinReal: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('realDateEnd').value,
            },
            type: {
                visible: true,
                enabled: true,
                value: null
            },
            typeId: {
                visible: true,
                enabled: true,
                value: null
            },
            typePath: {
                visible: true,
                enabled: true,
                value: null
            },
            description: {
                visible: true,
                enabled: true,
                value: this.buildDescription(),
            },
            releaseNumber: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('releaseNumber').value,
            },
            sprintId: {
                visible: true,
                enabled: true,
                value: null
            },
            onlySave: {
                visible: true,
                enabled: true,
                value: null
            },
            createdDateShort: this.requirementLoad.createdDateShort,
            calendarId: {
                visible: true,
                enabled: true,
                value: 0.0,
            },
            calendar: {
                visible: true,
                enabled: true,
                value: null,
            },
            application: {
                visible: true,
                enabled: true,
                value: this.aplicationsSelected.description,
            },
            applicationId: {
                visible: true,
                enabled: true,
                value: this.aplicationsSelected.id,
            },
            moduleId: {
                visible: true,
                enabled: true,
                value: this.moduleSelected.id,
            },
            module: {
                visible: true,
                enabled: true,
                value: this.moduleSelected.description,
            },
            requestedDate: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('requestDate').value,
            },
            requestedByUser: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('requestedByUser').value.description,
            },
            requestedByUserId: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('requestedByUser').value.id,
            },
            requerimentTypeId: {
                visible: true,
                enabled: true,
                value: this.requirementTypeSelected.id,
            },
            requerimentType: {
                visible: true,
                enabled: true,
                value: this.requirementTypeSelected.description,
            },
            mainObjectId: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('mainObject').value.id,
            },
            mainObject: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('mainObject').value.description,
            },
            priorityId: {
                visible: true,
                enabled: true,
                value: this.prioritySelected.id,
            },
            priority: {
                visible: true,
                enabled: true,
                value: this.prioritySelected.description,
            },
            estimatedStartDate: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('estimatedDateStart').value,
            },
            estimatedEndDate: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('estimatedDateEnd').value,
            },
            areaId: {
                visible: true,
                enabled: true,
                value: this.areaSelected.id,
            },
            area: {
                visible: true,
                enabled: true,
                value: this.areaSelected.description,
            },
            workAreaId: {
                visible: true,
                enabled: true,
                value: null,
            },
            workArea: {
                visible: true,
                enabled: true,
                value: null,
            },
            systemEffortInHours: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('systemEffortinHours').value,
            },
            userEffortInHours: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('usersEffortinHours').value,
            },
            previousStates: {
                visible: true,
                enabled: true,
                value: null,
            },
            projectId: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('project').value.id,
            },
            project: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('project').value.project,
            },
            projectDisplayName: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('project').value.description,
            },
            customerId: {
                visible: false,
                enabled: true,
                value: this.requirementFormGroup.get('project').value.customerid,
            },
            customer: {
                visible: false,
                enabled: true,
                value: this.requirementFormGroup.get('project').value.customer,
            },
            businessProcessId: {
                visible: true,
                enabled: true,
                value: this.businessProcesSelected.id,
            },
            businessProcess: {
                visibl: true,
                enabled: true,
                value: this.businessProcesSelected.description,
            },
            managementAreaInCharge: {
                visible: true,
                enabled: true,
                value: this.managementAreaSelected.description,
            },
            managementAreaInChargeId: {
                visible: true,
                enabled: true,
                value: this.managementAreaSelected.id,
            },
            complexityLevel: {
                visible: true,
                enabled: true,
                value: this.complexityLevelSelected.description,
            },
            complexityLevelId: {
                visible: true,
                enabled: true,
                value: this.complexityLevelSelected.id,
            },
            solvedpercent: {
                visible: true,
                enabled: true,
                value: this.requirementFormGroup.get('solvedpercent').value,
            }
        }
        this.sanitizeValues(requerimiento);
        return this.requirement = {
            requerimiento,
        };
    }

    private transformDateToString(value): any {
        if (!value) {
            return value;
        }
        return `${value.slice(8, 10)}${value.slice(5, 7)}${value.slice(0, 4)}`;
    }
    private transformStringToDate(value): any {
        if (!value) {
            return value;
        }
        const year = value.slice(4, 10);
        const month = value.slice(2, 4);
        const date = value.slice(0, 2);
        return new Date(year, month - 1, date);
    }

    selectedItem(item, tipe) {
        if (item && tipe) {
            switch (tipe) {
                case 'aplications': {
                    this.aplicationsSelected = item;
                    break;
                }
                case 'modules': {
                    this.moduleSelected = item;
                    break;
                }
                case 'businessProces': {
                    this.businessProcesSelected = item;
                    break;
                }
                case 'requirementTypes': {
                    this.requirementTypeSelected = item;
                    break;
                }
                case 'prioritys': {
                    this.prioritySelected = item;
                    break;
                }
                /* case 'regions': {
                    this.regioSelected = item;
                    break;
                } */
                case 'areas': {
                    this.areaSelected = item;
                    break;
                }
                case 'managementAreas': {
                    this.managementAreaSelected = item;
                    break;
                }
                case 'complexityLevel': {
                    this.complexityLevelSelected = item;
                    break;
                }
            }
        }
    }

    validFormFromToSave(): boolean {
        return (
            this.requirementFormGroup.valid &&
            this.requirementLoad.stateId.value !== 1 &&
            this.requirementFormGroup.get('project').value.id !== null
        );
    }

    validFormFromToChengeState() {
        return (
            this.requirementFormGroup.valid &&
            this.requirementFormGroup.get('project').value.id !== null
        );
    }

    chengeState(item) {
        this.requirementLoad.stateId.value = item.stateid;
        this.requirementLoad.state.value = item.state;
        this.flagClose = true;
        this.flagBeforunload = false;
        this.save();
    }

    save() {
        if (this.validFormFromToSave()) {
            if (this.requirementId) {
                this.requirementService.changeRequirementById(
                    this.buildForm(),
                    this.requirementId, this.sessionId).subscribe((response) => {
                        if (response) {
                            if (response.message) {
                                window.alert(response.message[0]);
                            }
                            if (response.status === 200 && this.flagClose) {
                                this.requirement.stateId = this.requirementLoad.stateId;
                                this.close();
                            }
                        }
                    });
            } else {
                this.requirementService.saveNewRequirement(this.buildForm(), this.sessionId).subscribe((response) => {
                    if (response) {
                        if (response.message) {
                            window.alert(response.message[0]);
                        }
                        if (response.status === 200 && this.flagClose) {
                            this.requirement.stateId = this.requirementLoad.stateId;
                            this.close();
                        }
                    }
                });
            }
        }
    }
    saveAndClose() {
        if (this.validFormFromToSave()) {
            this.flagBeforunload = false;
            this.save();
            this.flagClose = true;
        }
    }

    close() {
        this.flagClose = false;
        if (window.opener && window.opener !== window) {
            //inside a popup
            window.close();
            this.flagBeforunload = false;
        } else {
            document.location.href = `${environment.addresses.closeRequirement.close}${this.backtofld}`;
        }
    }

    // modal
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

    private getValidValueOrNull(value){
        if (value === undefined || value === NaN || value === '') {
            return null
        } else {
            return value;
        }
    }

    private sanitizeValues(project){
        for (let [key] of Object.entries(project)) {
            project[key].value = this.getValidValueOrNull(project[key].value);
        }
    }

    createNewActivity() {
        let params = new HttpParams();
        params = params.set('requirement_doc_id', this.requirementLoad.docId.value);
        const url = `${environment.addresses.activities.newActivity}&${params.toString()}`;
        window.open(url, 'newActivity', 'height=600px, width=670px, resizable=yes, titlebar=no, scrollbars=1');
    }

    reloadActivities() {
        if (this.requirementLoad && this.requirementLoad.id.value) {
            const aux = {
                filter: `referencestoid = ${this.requirementLoad.id.value}`,
                order: '',
                fields: ''
            };
            this.requirementService.searchActivities(aux, this.sessionId).subscribe((activities) => {
                if (activities) {
                    this.activities = [];
                    activities.activities.forEach((item) => {
                        const activitie = { id: '', title: '', responsable: '', state: '', linkHorus: '', linkEdit: '' };
                        activitie.id = item.Values.ID;
                        activitie.title = item.Values.SUBJET;
                        activitie.state = item.Values.STATE;
                        activitie.responsable = item.Values.RESPONSIBLE;
                        this.activities.push(activitie);
                    });
                }
            });
        }
    }

    initDateValidations() {
        const estimatedDateStartControl = this.requirementFormGroup.get('estimatedDateStart');
        const estimatedDateEndControl = this.requirementFormGroup.get('estimatedDateEnd');

        const estimatedDateStartDefaultValidator = estimatedDateStartControl.validator;
        const estimatedDateEndDefaultValidator = estimatedDateEndControl.validator;

        estimatedDateStartControl.setValidators([estimatedDateStartDefaultValidator, greaterThanTodayValidator]);
        if (estimatedDateStartControl.value) {
            estimatedDateEndControl.setValidators([estimatedDateEndDefaultValidator,
                greaterThanDateValidator(estimatedDateStartControl.value)]);
        }
        estimatedDateStartControl.valueChanges.subscribe(
            () => {
                if (estimatedDateStartControl.value) {
                    estimatedDateEndControl.setValidators([estimatedDateEndDefaultValidator,
                        greaterThanDateValidator(estimatedDateStartControl.value)]);
                } else {
                    estimatedDateEndControl.setValidators(estimatedDateEndDefaultValidator);
                }
                estimatedDateEndControl.updateValueAndValidity();
            }
        );
    }


}
