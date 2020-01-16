import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { RequierementsService } from 'src/app/services/requirements.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';


@Component({
    selector: 'app-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
    requirementFormGroup: FormGroup;

    aplications: any;
    aplicationsSelected: any;

    modules: any;
    moduleSelected: any;

    businessProces: any;
    businesProcesSelected: any;

    requirementTypes: any;
    requirementTypeSelected: any;

    mainObjects: any;
    mainObjectSelected: any;

    prioritys: any;
    prioritySelected: any;

    regios: any;
    regioSelected: any;

    areas: any;
    areaSelected: any;

    workAreas: any;
    workAreaSelected: any;

    managementAreas: any;
    managementAreaSelected: any;

    private sessionId: string;
    public projectId: number;

    private proyect: any;

    constructor(
        private requirementService: RequierementsService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private router: Router) { }

    ngOnInit() {
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        console.log(this.sessionId);
        this.createForm();
        this.loadSelects();
        this.buildFomr();
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
            sprint: new FormControl(''),
            createdDateShort: new FormControl(''),
            requestdate: new FormControl(''),
            requestedbyuser: new FormControl(''),
            estimatedDateStart: new FormControl(''),
            estimatedDateend: new FormControl(''),
            systemEffortinHours: new FormControl(''),
            usersEffortinHours: new FormControl(''),
            project: new FormControl(''),
        });
    }

    loadSelects() {
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
        this.requirementService.getNewRequirements(this.sessionId).subscribe((response) => {
            if (response) {
                this.loadFilds(response);
            }
        });
    }

    private loadFilds(response) {
        console.log(response.requerimiento);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('createdDate').setValue(this.transformDateToString(response.requerimiento.createdDate.value));
        this.requirementFormGroup.get('creator').setValue(response.requerimiento.creator.value);
        this.requirementFormGroup.get('title').setValue(response.requerimiento.title.value);
        this.requirementFormGroup.get('state').setValue(response.requerimiento.state.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.createdMonth.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
        this.requirementFormGroup.get('id').setValue(response.requerimiento.id.value);
    }

    private buildFomr() {
        return this.proyect = {
            requerimiento: {
                createdDate: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                creatorId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                creator: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                title: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                stateId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                state: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                stateType: {
                    visible: true,
                    enabled: true,
                    value: 3.0
                },
                lastStateId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                lastState: {
                    visible: true,
                    enabled: true,
                    value: null
                },
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
                createdMonth: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                displayName: {
                    visible: true,
                    enabled: true,
                    value: null
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
                    value: null
                },
                fechaFinReal: {
                    visible: true,
                    enabled: true,
                    value: null
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
                    value: null
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
                createdDateShort: {
                    visible: true,
                    enabled: true,
                    value: null
                },
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
                    value: null
                },
                applicationId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                moduleId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                requestedDate: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                requestedByUser: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                requerimentTypeId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                mainObjectId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                priorityId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                estimatedStartDate: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                estimatedEndDate: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                areaId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                workAreaId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                systemEffortInHours: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                userEffortInHours: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                previousStates: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                projectId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                project: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                businessProcessId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                regionId: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                managementAreaInCharge: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                managementAreaInChargeId: {
                    visible: true,
                    enabled: true,
                    value: null
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

    selectedItem(event, tipe) { }

    validForm(): boolean {
        return this.requirementFormGroup.valid;
    }

    save() {
    }
    saveAndClose() {
    }
    close() {
    }
}
