import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl} from '@angular/forms';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent implements OnInit {

    newProyectFormGroup: FormGroup;

    itemsProductos = [{ id: 1, text: 'Convivimos', disabled: false }];
    constructor() { }


    ngOnInit() {
        this.createForm();
     }


    createForm() {
        this.newProyectFormGroup = new FormGroup({
            id: new FormControl(''),
            client: new FormControl(''),
            nombre: new FormControl(''),
            projectType: new FormControl(''),
            state: new FormControl(''),
            dateStart: new FormControl(''),
            dateEnd: new FormControl(''),
            dateStartReal: new FormControl(''),
            dateEndReal: new FormControl(''),
            hours: new FormControl(''),
        });
    }
}
