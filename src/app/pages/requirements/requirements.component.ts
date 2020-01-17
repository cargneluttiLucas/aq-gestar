import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequierementsService } from 'src/app/services/requirements.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';
import { ModalService } from 'src/app/component';
import { NavigatorService, KeypressService, DocumentService } from 'src/app/utils';
import { Subscription } from 'rxjs';

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
    businesProcesSelected = {
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

    workAreas = [];
    workAreaSelected = {
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

    wkfStates = [];

    errorMessage: string;

    private sessionId: string;
    public projectId: number;
    public requirementId: number;
    public requirementAcction: string;
    public backtofld: number;

    keypressSubscription: Subscription;

    saveText = 'Guardar';
    saveAndExitText = 'Guardar y salir';

    private requirement: any;
    private requirementLoad: any;

    constructor(
        private requirementService: RequierementsService,
        private modalServiceNg: ModalService,
        private cookieService: CookieService,
        private keypressService: KeypressService,
        private documentService: DocumentService,
        private deviceDetector: NavigatorService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        this.router.routerState.root.queryParams.forEach((item) => {
            this.requirementId = item.doc_id;
            this.requirementAcction = item.action;
            this.backtofld = item.backtofld;
            console.log('parametros', [this.requirementId, this.requirementAcction, this.backtofld]);
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
        this.requirementFormGroup.get('project').valueChanges.subscribe((data) => {
            if (data.length >= 3) {
                const aux = {
                    filter: '',
                    order: 'DOC_ID',
                    fields: 'DOC_ID,project_name'
                };
                this.requirementService.searchProject(aux, this.sessionId).subscribe((response) => {
                    if (response) {
                        console.log(response);
                    }
                });
            }
        });
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
            // sprint: new FormControl(''),
            // createdDateShort: new FormControl(''),
            requestDate: new FormControl(''),
            requestedByUser: new FormControl(''),
            estimatedDateStart: new FormControl(''),
            estimatedDateEnd: new FormControl(''),
            systemEffortinHours: new FormControl(''),
            usersEffortinHours: new FormControl(''),
            project: new FormControl(''),
        });
    }

    openRequirement(requirementId) {
        this.requirementService.getOpenByDocId(requirementId, this.sessionId).subscribe((response) => {
            if (response) {
                this.loadFilds(response);
            }
        });

    }

    private loadSelects() {
        this.requirementService.getNewSelects(this.sessionId).subscribe((response) => {
            if (response) {
                this.aplications = response.reqKeywords.keywords[0].options;
                this.modules = response.reqKeywords.keywords[1].options;
                this.businessProces = response.reqKeywords.keywords[2].options;
                this.requirementTypes = response.reqKeywords.keywords[3].options;
                this.mainObjects = response.reqKeywords.keywords[4].options;
                this.prioritys = response.reqKeywords.keywords[5].options;
                this.regios = response.reqKeywords.keywords[6].options;
                this.areas = response.reqKeywords.keywords[7].options;
                this.workAreas = response.reqKeywords.keywords[8].options;
                this.managementAreas = response.reqKeywords.keywords[9].options;
            }
        });

    }

    private loadNewRequirement() {
        this.requirementService.getNewRequirements(this.sessionId).subscribe((response) => {
            if (response) {
                setTimeout(() => {
                    this.loadFilds(response);
                }, 500);
            }
        });
    }

    private loadFilds(response) {
        if (response.requerimiento.wkfStates) {
            this.wkfStates = response.requerimiento.wkfStates.value.root.item;
        }
        if (this.wkfStates) {
            this.wkfStates = this.wkfStates.filter(x => x.allowed === '1');
            console.log(this.wkfStates);
        }
        this.requirementLoad = response.requerimiento;
        console.log('load de requirement', this.requirementLoad);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id ? response.requerimiento.id.value : null);
        this.requirementFormGroup.get('createdDate').setValue(this.transformDateToString(response.requerimiento.createdDate.value));
        this.requirementFormGroup.get('creator').setValue(response.requerimiento.creator.value);
        this.requirementFormGroup.get('title').setValue(response.requerimiento.title.value);
        this.requirementFormGroup.get('state').setValue(response.requerimiento.state.value);
        this.requirementFormGroup.get('createdMonth').setValue(this.transformDateToString(response.requerimiento.createdMonth.value));
        this.requirementFormGroup.get('displayName').setValue(response.requerimiento.displayName.value);
        this.requirementFormGroup.get('organization').setValue(response.requerimiento.organization.value);
        this.requirementFormGroup.get('realDateEnd').setValue(this.transformDateToString(response.requerimiento.fechaFinReal.value));
        this.requirementFormGroup.get('description').setValue(response.requerimiento.description.value);
        // this.requirementFormGroup.get('sprint').setValue(response.requerimiento.id.value);
        // this.requirementFormGroup.get('createdDateShort').setValue(response.requerimiento.createdDateShort.value);

        // combos
        if (response.requerimiento.applicationId.value) {
            this.aplicationsSelected = {
                id: response.requerimiento.applicationId.value,
                description: response.requerimiento.projectType.value,
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
            this.businesProcesSelected = {
                id: response.requerimiento.businessProcessId.value,
                description: response.requerimiento.module.value,
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
        if (response.requerimiento.regionId.value) {
            this.regioSelected = {
                id: response.requerimiento.regionId.value,
                description: response.requerimiento.region.value,
                disabled: false
            };
        }
        if (response.requerimiento.workAreaId.value) {
            this.workAreaSelected = {
                id: response.requerimiento.workAreaId.value,
                description: response.requerimiento.workArea.value,
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
        if (response.requerimiento.requerimentTypeId.value) {
            this.requirementTypeSelected = {
                id: response.requerimiento.requerimentTypeId.value,
                description: response.requerimiento.requerimentType.value,
                disabled: false
            };
        }

        this.requirementFormGroup.get('requestDate').setValue(this.transformDateToString(response.requerimiento.requestedDate.value));
        this.requirementFormGroup.get('requestedByUser').setValue(response.requerimiento.requestedByUser.value);
        this.requirementFormGroup.get('estimatedDateStart').setValue(
            this.transformDateToString(response.requerimiento.estimatedStartDate.value));
        this.requirementFormGroup.get('estimatedDateEnd').setValue(
            this.transformDateToString(response.requerimiento.estimatedEndDate.value));
        this.requirementFormGroup.get('systemEffortinHours').setValue(response.requerimiento.systemEffortInHours.value);
        this.requirementFormGroup.get('usersEffortinHours').setValue(response.requerimiento.userEffortInHours.value);
    }

    private buildFomr() {
        console.log(this.requirementLoad);
        return this.requirement = {
            requerimiento: {
                createdDate: this.requirementLoad.createdDate,
                creatorId: this.requirementLoad.creatorId,
                creator: this.requirementLoad.creator,
                title: {
                    visible: true,
                    enabled: true,
                    value: this.requirementFormGroup.get('title').value
                },
                stateId: {
                    visible: true,
                    enabled: true,
                    value: +this.requirementLoad.stateId.value
                },
                state: {
                    visible: true,
                    enabled: true,
                    value: this.requirementLoad.state.value
                },
                stateType: {
                    visible: true,
                    enabled: true,
                    value: 0
                },
                lastStateId: this.requirementLoad.lastStateId,
                lastState: this.requirementLoad.lastState,
                lastActionDate: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                agentActions: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                notActiveEmails: {
                    visible: true,
                    enabled: true,
                    value: null
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
                    value: null
                },
                idWorkflow: {
                    visible: true,
                    enabled: true,
                    value: 1.0
                },
                workflow: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                organization: {
                    visible: true,
                    enabled: true,
                    value: this.requirementFormGroup.get('organization').value
                },
                fechaFinReal: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.requirementFormGroup.get('realDateEnd').value)
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
                    value: this.requirementFormGroup.get('description').value
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
                    value: 0.0
                },
                calendar: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                application: {
                    visible: true,
                    enabled: true,
                    value: this.aplicationsSelected.description ? this.aplicationsSelected.description : null
                },
                applicationId: {
                    visible: true,
                    enabled: true,
                    value: this.aplicationsSelected.id ? +this.aplicationsSelected.id : null
                },
                moduleId: {
                    visible: true,
                    enabled: true,
                    value: this.moduleSelected.id ? +this.moduleSelected.id : null
                },
                module: {
                    visible: true,
                    enabled: true,
                    value: this.moduleSelected.description ? this.moduleSelected.description : null
                },
                requestedDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.requirementFormGroup.get('requestDate').value)
                },
                requestedByUser: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                requerimentTypeId: {
                    visible: true,
                    enabled: true,
                    value: this.requirementTypeSelected.id ? +this.requirementTypeSelected.id : null
                },
                requerimentType: {
                    visible: true,
                    enabled: true,
                    value: this.requirementTypeSelected.description ? this.requirementTypeSelected.description : null
                },
                mainObjectId: {
                    visible: true,
                    enabled: true,
                    value: this.moduleSelected.id ? +this.moduleSelected.id : null
                },
                mainObject: {
                    visible: true,
                    enabled: true,
                    value: this.moduleSelected.description ? this.moduleSelected.description : null
                },
                priorityId: {
                    visible: true,
                    enabled: true,
                    value: this.prioritySelected.id ? +this.prioritySelected.id : null
                },
                priority: {
                    visible: true,
                    enabled: true,
                    value: this.prioritySelected.description ? this.prioritySelected.description : null
                },
                estimatedStartDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.requirementFormGroup.get('estimatedDateStart').value)
                },
                estimatedEndDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.requirementFormGroup.get('estimatedDateEnd').value)
                },
                areaId: {
                    visible: true,
                    enabled: true,
                    value: this.areaSelected.id ? +this.areaSelected.id : null
                },
                area: {
                    visible: true,
                    enabled: true,
                    value: this.areaSelected.description ? this.areaSelected.description : null
                },
                workAreaId: {
                    visible: true,
                    enabled: true,
                    value: this.workAreaSelected.id ? +this.workAreaSelected.id : null
                },
                workArea: {
                    visible: true,
                    enabled: true,
                    value: this.workAreaSelected.description ? this.workAreaSelected.description : null
                },
                systemEffortInHours: {
                    visible: true,
                    enabled: true,
                    value: this.requirementFormGroup.get('systemEffortinHours').value
                },
                userEffortInHours: {
                    visible: true,
                    enabled: true,
                    value: this.requirementFormGroup.get('usersEffortinHours').value
                },
                previousStates: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                // completar con el autocomplete
                projectId: {
                    visible: true,
                    enabled: true,
                    value: 191026
                },
                project: {
                    visible: true,
                    enabled: true,
                    value: 'Lucas 3'
                },
                businessProcessId: {
                    visible: true,
                    enabled: true,
                    value: this.businesProcesSelected.id ? +this.businesProcesSelected.id : null
                },
                businessProcess: {
                    visibl: true,
                    enabled: true,
                    value: this.businesProcesSelected.description ? this.businesProcesSelected.description : null
                },
                regionId: {
                    visible: true,
                    enabled: true,
                    value: this.regioSelected.id ? +this.regioSelected.id : null
                },
                region: {
                    visible: true,
                    enabled: true,
                    value: this.regioSelected.description ? this.regioSelected.description : null
                },
                managementAreaInCharge: {
                    visible: true,
                    enabled: true,
                    value: this.managementAreaSelected.description ? this.managementAreaSelected.description : null
                },
                managementAreaInChargeId: {
                    visible: true,
                    enabled: true,
                    value: this.managementAreaSelected.id ? +this.managementAreaSelected.id : null
                }
            }
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
        console.log(year, month, date);
        console.log(new Date(year, month - 1, date));
        return new Date(year, month - 1, date);
    }

    selectedItem(item, tipe) {
        if (item && tipe) {
            switch (tipe) {
                case 'aplications': {
                    this.aplications = item;
                    break;
                }
                case 'modules': {
                    this.moduleSelected = item;
                    break;
                }
                case 'businessProces': {
                    this.businesProcesSelected = item;
                    break;
                }
                case 'requirementTypes': {
                    this.requirementTypeSelected = item;
                    break;
                }
                case 'mainObjects': {
                    this.mainObjectSelected = item;
                    break;
                }
                case 'prioritys': {
                    this.prioritySelected = item;
                    break;
                }
                case 'regions': {
                    this.regioSelected = item;
                    break;
                }
                case 'areas': {
                    this.areaSelected = item;
                    break;
                }
                case 'workAreas': {
                    this.workAreaSelected = item;
                    break;
                }
                case 'managementAreas': {
                    this.managementAreaSelected = item;
                    break;
                }
            }
        }
    }

    // textfield predictive
    itemSelected(event) {
        console.log(event);
    }

    validFormFromToSave(): boolean {
        return this.requirementFormGroup.valid && this.requirementLoad.stateId.value !== 1;
    }

    validFormFromToChengeState(item) {
        return this.requirementFormGroup.valid;
    }

    chengeState(item) {
        console.log(item);
        this.requirementLoad.stateId.value = item.stateid;
        this.requirementLoad.state.value = item.state;
        console.log(this.buildFomr());
        this.save();
    }

    save() {
        if (this.requirementId) {
            this.requirementService.changeRequirementById(this.buildFomr(), this.requirementId, this.sessionId).subscribe((response) => {
                if (response) {
                    if (response.status !== 200 && response.message[0]) {
                        this.errorMessage = response.message[0];
                        this.requirement.stateId = this.requirementLoad.stateId;
                        this.openDialog();
                    } else {
                        // close pero succes
                    }
                    console.log(response);
                }
            });
        } else {
            this.requirementService.saveNewRequirement(this.buildFomr(), this.sessionId).subscribe((response) => {
                if (response) {
                    if (response.status !== 200 && response.message[0]) {
                        this.errorMessage = response.message[0];
                        this.requirement.stateId = this.requirementLoad.stateId;
                        this.openDialog();
                    } else {
                        // close pero succes
                    }
                    console.log(response);
                }
            });
        }
    }
    saveAndClose() {
    }
    close() {
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


}
