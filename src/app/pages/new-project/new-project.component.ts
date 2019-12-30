import { Component } from "@angular/core";
import { FormGroup, FormControl, AbstractControl, ValidationErrors } from '@angular/forms';


@Component({
    selector: 'app-new-project',
    templateUrl: './new-project.component.html',
    styleUrls: ['./new-project.component.scss']
})
export class NewProjectComponent {

    newProyectFormGroup: FormGroup;
    constructor() { }
}
