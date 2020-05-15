import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ProjectsService } from '../service/project.service';
import { debounceTime, tap, switchMap, finalize, startWith, filter } from 'rxjs/operators';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value !== '') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

function autocompleteRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value.id) {
      return { 'mandatoryField': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit, OnChanges {

  @Input() sessionId: string;
  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() required = false;

  filteredProjects: any[] = [];

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    this.control
      .valueChanges
      .pipe(
        debounceTime(300),
        filter((str) => typeof str === 'string' && str !== ''),
        switchMap(value => this.projectsService.findProjects({
          filter: value,
          order: 'DOC_ID',
          fields: 'DOC_ID,ID,project_name,DISPLAYNAME,customer,customerid'
        }, this.sessionId)
        )
      )
      .subscribe((response) => {
        if (response) {
          this.buildProject(response.proyectos);;
        }
      });
  }

  ngOnChanges(){
    this.control.setValidators(autocompleteObjectValidator());
    if (this.required) {
      this.control.setValidators([this.control.validator, autocompleteRequiredValidator()]);
    }
  }

  buildProject(proyects) {
    this.filteredProjects = [];
    proyects.forEach((item) => {
      const aux = { id: 0, description: '', project: '', disabled: false, customer: null, customerid: null };
      aux.id = item.Values.ID;
      aux.description = item.Values.DISPLAYNAME;
      aux.project = item.Values.PROJECT_NAME;
      aux.customerid = item.Values.CUSTOMERID;
      aux.customer = item.Values.CUSTOMER;

      this.filteredProjects.push(aux);
    });
  }

  displayFn(user): string | undefined {
    return user ? user.description : undefined;
  }
}
