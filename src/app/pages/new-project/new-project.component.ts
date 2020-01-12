import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

    newProyectFormGroup: FormGroup;

    typeProject = [];
    stateProject = [];
    projectRisk = [];
    managementAreaInCharge = [];

    typeProjectSelected = null;
    stateProjectSelected = null;
    projectRiskSelected = null;
    managementAreaInChargeSelected = null;
    constructor(private newProyectService: NewProjectService) { }


    ngOnInit() {
        this.createForm();
        this.cargarCombos();
    }


    createForm() {
        this.newProyectFormGroup = new FormGroup({
            id: new FormControl(''),
            client: new FormControl(''),
            name: new FormControl(''),
            projectType: new FormControl(''),
            state: new FormControl(''),
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
        });
    }

    cargarCombos() {
        this.newProyectService.getTypeProyect().subscribe((response) => {
            if (response) {
                this.typeProject = response;
            }
        });

        this.newProyectService.getStateProject().subscribe((response) => {
            if (response) {
                this.stateProject = response;
            }
        });

        this.newProyectService.getRiskProyect().subscribe((response) => {
            if (response) {
                this.projectRisk = response;
            }
        });

        this.newProyectService.getManagementAreaProject().subscribe((response) => {
            if (response) {
                this.managementAreaInCharge = response;
            }
        });
    }

    selectedItem(item, select: string) {
        console.log(item, select);
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
            }
        }
    }

    validForm(): boolean {
        return this.newProyectFormGroup.valid &&  this.managementAreaInChargeSelected
        && this.projectRiskSelected && this.stateProjectSelected &&  this.typeProjectSelected;
    }

    saveProject() {
    }
}
