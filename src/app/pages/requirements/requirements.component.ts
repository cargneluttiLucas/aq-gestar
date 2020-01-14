import { Component, OnInit } from "@angular/core";
import { FormGroup, FormControl } from '@angular/forms';


@Component({
    selector: 'app-requirements',
    templateUrl: './requirements.component.html',
    styleUrls: ['./requirements.component.scss']
})
export class RequirementsComponent implements OnInit {
    requirementFormGroup: FormGroup;

    constructor() { }

    ngOnInit() {
        this.createForm();

    }

    createForm() {
        this.requirementFormGroup = new FormGroup({
            name: new FormControl('')
        });
    }

    validForm(): boolean {
        return this.requirementFormGroup.valid && this.managementAreaInChargeSelected
            && this.projectRiskSelected && this.stateProjectSelected && this.typeProjectSelected;
    }

    save() {
    }
    saveAndClose() {
    }
    close() {
    }
}