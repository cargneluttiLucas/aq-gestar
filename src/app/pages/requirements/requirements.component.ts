import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';
import { RequierementsService } from 'src/app/services/requirements.service';


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

    constructor(private requirementService: RequierementsService) { }

    ngOnInit() {
        this.createForm();
        this.loadSelects();

    }

    createForm() {
        this.requirementFormGroup = new FormGroup({
            id: new FormControl(''),
            createdDate: new FormControl(''),
            creator: new FormControl(''),
            name: new FormControl(''),
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
        this.requirementService.getNew(this.sessionId).subscribe((response) => {
            if (response) {
                console.log(response.requerimiento.keywords);
                this.aplications = response.requerimiento.keywords[0].options;
                this.modules = response.requerimiento.keywords[1].options;
                this.businessProces = response.requerimiento.keywords[2].options;
                this.requirementTypes = response.requerimiento.keywords[3].options;
                this.mainObjects = response.requerimiento.keywords[4].options;
                this.prioritys = response.requerimiento.keywords[5].options;
                this.regios = response.requerimiento.keywords[6].options;
                this.areas = response.requerimiento.keywords[7].options;
                this.workAreas = response.requerimiento.keywords[8].options;
                this.managementAreas = response.requerimiento.keywords[9].options;
            }
        });
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
