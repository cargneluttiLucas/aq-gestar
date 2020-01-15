import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';
import { CookieService } from 'src/app/services/cookie.service';


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
    private sessionId: string;

    checkbox = { id: 1, disabled: false, selected: false, indeterminate: false, text: 'Sin numero' };


    constructor(
        private newProyectService: NewProjectService,
        private cookieService: CookieService) { }


    ngOnInit() {
        console.log('cookie de ssesion id', this.cookieService.getCookie('GESTAR_SESSIONID='));
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
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
            displayname: new FormControl(''),
        });
    }

    cargarCombos() {
        this.newProyectService.getTypeProyect(this.sessionId).subscribe((response) => {
            if (response) {
                this.typeProject = response.proyecto.keywords[0].options;
                console.log('probando el json', this.typeProject);

                this.stateProject = response.proyecto.keywords[1].options;
                console.log('probando el json', this.stateProject);

                this.projectRisk = response.proyecto.keywords[2].options;
                console.log('probando el json', this.projectRisk);

                this.managementAreaInCharge = response.proyecto.keywords[3].options;
                console.log('probando el json', this.managementAreaInCharge);
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
        return this.newProyectFormGroup.valid && this.managementAreaInChargeSelected
            && this.projectRiskSelected && this.stateProjectSelected && this.typeProjectSelected;
    }

    save() {
    }
    saveAndClose() {
    }
    close() {
    }
}
