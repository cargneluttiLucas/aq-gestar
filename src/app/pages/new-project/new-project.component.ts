import { Component, OnInit, AfterViewInit, OnDestroy } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { NewProjectService } from 'src/app/services/new-project.service';
import { CookieService } from 'src/app/services/cookie.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from 'src/app/component';
import { KeypressService, DocumentService, NavigatorService } from 'src/app/utils';
import { Subscription, Observable, Subject } from 'rxjs';
import { EventEmitter } from 'protractor';
import { emit } from 'cluster';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit, AfterViewInit, OnDestroy {

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

    errorMessage; string;

    saveText = 'Guardar';
    saveAndExitText = 'Guardar y salir';

    private sessionId: string;
    // private sessionId = 'e54bb83ba1694cfe9f1aa001cb3981a5';
    public projectId: number;
    public backtofld: number;
    private proyectAcction: string;

    private flagClose = false;

    keypressSubscription: Subscription;

    sponsors = [];
    sponsorSelected = { id: null, description: '', disabled: false };
    itemDefault: any;
    itemsFilterDefault = [];

    clients = [];
    clientSelected = { id: null, description: '', disabled: false };
    itemDefaultClients: any;
    itemsFilterDefaultClients = [];

    checkbox = { id: 1, disabled: false, selected: false, indeterminate: false, text: 'Sin numero' };
    disabledPurchaseNumber = false;


    constructor(
        private newProyectService: NewProjectService,
        private cookieService: CookieService,
        private modalServiceNg: ModalService,
        private keypressService: KeypressService,
        private documentService: DocumentService,
        private deviceDetector: NavigatorService,
        private route: ActivatedRoute,
        private router: Router) { }


    ngOnInit() {
        this.sessionId = this.cookieService.getCookie('GESTAR_SESSIONID=');
        this.router.routerState.root.queryParams.forEach((item) => {
            this.projectId = item.doc_id;
            this.proyectAcction = item.action;
            this.backtofld = item.backtofld;
            console.log('parametros', [this.projectId, this.proyectAcction, this.backtofld]);
        });
        if (this.projectId && this.proyectAcction === 'open') {
            this.saveText = 'Modificar';
            this.saveAndExitText = 'Modificar y salir';
            this.openProyect(this.projectId);
        } else {
            this.cargarNewProject();
        }
        this.createForm();

        this.newProyectFormGroup.get('sponsor').valueChanges.subscribe((data) => {
            if (data && data.length >= 3) {
                const aux = {
                    userFilter: data,
                    userOrder: ''
                };
                setTimeout(() => {
                    this.newProyectService.findSponsor(aux, this.sessionId).subscribe((response) => {
                        if (response) {
                            this.buildSponsor(response.usuarios);
                        }
                    });
                }, 300);

            }
        });

        this.newProyectFormGroup.get('client').valueChanges.subscribe((data) => {
            if (data && data.length >= 3) {
                const aux = {
                    filter: data,
                    filterRequired: 'CONTACTTYPE = 1',
                    order: 'DOC_ID',
                    fields: 'DOC_ID,DISPLAYNAME'
                };
                setTimeout(() => {
                    this.newProyectService.findCliend(aux, this.sessionId).subscribe((response) => {
                        if (response) {
                            this.buildClient(response.contactos);
                        }
                    });
                }, 300);
            }
        });
    }

    ngAfterViewInit() {
        // if (this.deviceDetector.isBrowser) {
        //     this.keypressSubscription = this.keypressService.keyPressEscape().subscribe((response) => {
        //         if (response === true) {
        //             this.closeModalForOtherMotive();
        //         }
        //     });
        // }
    }

    buildClient(client) {
        this.clients = [];
        client.forEach((item) => {
            const aux = { id: 0, description: '', disabled: false };
            aux.id = item.Values.DOC_ID;
            aux.description = item.Values.DISPLAYNAME;
            this.clients.push(aux);
        });
    }

    private buildSponsor(sponsor) {
        this.sponsors = [];
        sponsor.forEach((item) => {
            const aux = { id: 0, description: '', disabled: false };
            aux.id = item.userId.value;
            aux.description = item.userFullName.value;
            this.sponsors.push(aux);
        });
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

    cargarNewProject() {
        this.newProyectService.getNewProyect(this.sessionId).subscribe((response) => {
            if (response) {
                this.cargarCombos(response);
            }
        });
    }

    cargarCombos(response) {

        if (response) {
            this.typeProject = response.proyecto.keywords[0].options;

            this.stateProject = response.proyecto.keywords[1].options;

            this.projectRisk = response.proyecto.keywords[2].options;

            this.managementAreaInCharge = response.proyecto.keywords[3].options;
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
        this.newProyectFormGroup.get('id').setValue(response.proyecto.id.value);
        this.newProyectFormGroup.get('name').setValue(response.proyecto.projectName.value);


        this.newProyectFormGroup.get('client').setValue(response.proyecto.customer.value);
        this.clientSelected.id = response.proyecto.customerId.value;
        this.clientSelected.description = response.proyecto.customer.value;


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
        this.newProyectFormGroup.get('estimatedHours').setValue(
            response.proyecto.estimatedHours.value === 0 ? '' : response.proyecto.estimatedHours.value);
        this.newProyectFormGroup.get('realHours').setValue(
            response.proyecto.realHours.value === 0 ? '' : response.proyecto.realHours.value);

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

    itemSelectedPredictive(event) {
        this.sponsorSelected = event;
        this.newProyectFormGroup.get('sponsor').setValue(event.description);
        this.itemsFilterDefault = this.sponsors;

    }

    itemSelectedPredictiveClients(event) {
        this.clientSelected = event;
        this.newProyectFormGroup.get('client').setValue(event.description);
        this.itemsFilterDefaultClients = this.clients;
    }

    validForm(): boolean {
        // tener en cuenta que para esto hay que ver que combos son obligatorios
        return this.newProyectFormGroup.valid && this.clientSelected.id !== null;
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
                        null : +this.newProyectFormGroup.get('estimatedHours').value
                },
                realHours: {
                    visible: true,
                    enabled: true,
                    value: this.newProyectFormGroup.get('realHours').value === '' ?
                        null : +this.newProyectFormGroup.get('realHours').value
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
                    value: this.sponsorSelected.description ? this.sponsorSelected.description : null
                },
                sponsorid: {
                    visible: true,
                    enabled: true,
                    value: this.sponsorSelected.id ? this.sponsorSelected.id : null
                },
                keywords: []
            }
        };
    }

    save() {
        if (this.validForm()) {
            if (this.projectId) {
                this.newProyectService.putChangeProject(this.buildForm(), this.projectId, this.sessionId).subscribe((response) => {
                    if (response) {
                        if (response.message) {
                            window.alert(response.message[0] + 'ID' + response.docId);
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
                        window.alert(response.message[0] + 'ID' + response.docId);
                        if (response.status === 200) {
                            this.projectId = response.docId;
                            this.changeTextButtons();
                        }
                        if (this.flagClose) {
                            this.close();
                        }
                    }
                });
            }
        }
    }


    saveAndClose() {
        if (this.validForm()) {
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
        document.location.href = `http://3.227.233.169/c/content.asp?fld_id=${this.backtofld}`;
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
