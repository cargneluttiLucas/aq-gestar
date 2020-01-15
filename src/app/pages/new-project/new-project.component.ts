import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { isFormattedError } from '@angular/compiler';


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

    saveText = 'Guardar';
    saveAndExitText = 'Guardar y salir';

    private sessionId: string;
    public projectId: number;
    private proyectAcction: string;

    checkbox = { id: 1, disabled: false, selected: false, indeterminate: false, text: 'Sin numero' };
    disabledPurchaseNumber = false;


    constructor(
        private newProyectService: NewProjectService,
        private cookieService: CookieService,
        private route: ActivatedRoute,
        private router: Router) { }


    ngOnInit() {
        this.router.routerState.root.queryParams.forEach((item) => {
            this.projectId = item.doc_id;
            this.proyectAcction = item.action;
            console.log('parametros', [this.projectId, this.proyectAcction]);
        });
        if (this.projectId && this.proyectAcction === 'open') {
            this.saveText = 'Modificar';
            this.saveAndExitText = 'Modificar y salir';
            this.openProyect(this.projectId);
        }
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        console.log('GESTAR_SESSIONID=', this.sessionId);
        this.createForm();
        this.cargarCombos();
    }


    createForm() {
        this.newProyectFormGroup = new FormGroup({
            id: new FormControl(''),
            client: new FormControl('', Validators.required),
            name: new FormControl('', Validators.required),
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
        this.newProyectService.getNewProyect(this.sessionId).subscribe((response) => {
            if (response) {
                this.typeProject = response.proyecto.keywords[0].options;

                this.stateProject = response.proyecto.keywords[1].options;

                this.projectRisk = response.proyecto.keywords[2].options;

                this.managementAreaInCharge = response.proyecto.keywords[3].options;
            }
        });
    }

    openProyect(projectId: number) {
        this.newProyectService.getOpenProyect(projectId, this.sessionId).subscribe((response) => {
            if (response) {
                setTimeout(() => {
                    this.loadFilds(response);
                }, 500);
            }
        });
    }

    private loadFilds(response) {
        this.newProyectFormGroup.get('id').setValue(response.proyecto.docId.value);
        this.newProyectFormGroup.get('name').setValue(response.proyecto.projectName.value);
        this.newProyectFormGroup.get('client').setValue(response.proyecto.customer.value);
        this.newProyectFormGroup.get('displayname').setValue(response.proyecto.displayname.value);
        this.newProyectFormGroup.get('description').setValue(response.proyecto.description.value);

        // queda armar la parte de que si viene el sin 'sinOrdenCompra'
        this.newProyectFormGroup.get('purchaseNumber').setValue(response.proyecto.nDeCompra.value);
        this.disabledPurchaseNumber = response.proyecto.sinOrdenCompra.value === 1 ? false : true;
        this.checkbox.selected = response.proyecto.sinOrdenCompra.value === 1 ? false : true;

        this.newProyectFormGroup.get('repositorySVN').setValue(response.proyecto.repositorioSvn.value);
        this.newProyectFormGroup.get('sponsor').setValue(response.proyecto.sponsor.value);

        this.newProyectFormGroup.get('dateStart').setValue(
            this.transformDateToString(response.proyecto.startDate.value));
        this.newProyectFormGroup.get('dateEnd').setValue(
            this.transformDateToString(response.proyecto.endDate.value));
        this.newProyectFormGroup.get('dateStartReal').setValue(
            this.transformDateToString(response.proyecto.realStartDate.value));
        this.newProyectFormGroup.get('dateEndReal').setValue(
            this.transformDateToString(response.proyecto.realEndDate.value));
        this.newProyectFormGroup.get('estimatedHours').setValue(response.proyecto.estimatedHours.value);
        this.newProyectFormGroup.get('realHours').setValue(response.proyecto.realHours.value);

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
            this.managementAreaInChargeSelected = {
                id: response.proyecto.managementAreaInChargeId.value,
                description: response.proyecto.managementAreaInCharge.value,
                disabled: false
            };
        }
        // falta el proyect riesgo id en api
        if (response.proyecto.projRiesgoId.value) {
            this.projectRiskSelected = {
                id: response.proyecto.projRiesgoId.value,
                description: response.proyecto.projRiesgo.value,
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
            }
        }
    }

    validForm(): boolean {
        // tener en cuenta que para esto hay que ver que combos son obligatorios
        return this.newProyectFormGroup.valid;
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
                    value: this.transformStringToDate(this.newProyectFormGroup.get('dateStart').value)
                },
                endDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.newProyectFormGroup.get('dateEnd').value)
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
                    null : this.newProyectFormGroup.get('estimatedHours').value
                },
                realHours: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('realHours').value === '' ?
                    null : this.newProyectFormGroup.get('realHours').value
                },
                realStartDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.newProyectFormGroup.get('dateStartReal').value)
                },
                realEndDate: {
                    visible: true,
                    enabled: true,
                    value: this.transformStringToDate(this.newProyectFormGroup.get('dateEndReal').value)
                },
                customer: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('client').value
                },
                customerId: {
                    visible: true,
                    enabled: true,
                    value: null
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
                    value: this.newProyectFormGroup.get('description').value
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
                    value: this.newProyectFormGroup.get('sponsor').value
                },
                sponsorid: {
                    visible: true,
                    enabled: true,
                    value: null
                },
                keywords: []
            }
        };
    }

    save() {
        if (this.validForm()) {
            if (this.projectId) {
                this.newProyectService.putChangeProject(this.buildForm(), this.projectId).subscribe((response) => {
                    if (response) {
                        console.log('modificacion de proyecto', response);
                    }
                });
            } else {
                this.newProyectService.putSaveProject(this.buildForm()).subscribe((response) => {
                    if (response) {
                        console.log('se guarda un proyecto nuevo', response);
                    }
                });
            }
        }
    }
    saveAndClose() {
        if (this.validForm()) {
            if (this.projectId) {
                this.newProyectService.putChangeProject(this.buildForm(), this.projectId);
            } else {
                this.newProyectService.putSaveProject(this.buildForm());
            }
            // y volver atras, ver como hacemos esto.
        }
    }
    close() {
        // salir
    }
}
