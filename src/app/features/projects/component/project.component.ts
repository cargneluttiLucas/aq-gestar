import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ProjectsService } from '../service/project.service';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {

  @Input() selectedFormControl: FormControl;
  @Input() isSession: string;
  @Input() text: string;
  @Input() id: string;
  proyects: any[] = [];

  @Input() proyectsSelected = { id: null, description: '', disabled: false };
  @Output() proyectsSelectedData = new EventEmitter();

  private flagLoad = true;

  constructor(private projectsService: ProjectsService) { }

  ngOnInit() {
    if (!this.selectedFormControl) {
      this.selectedFormControl = new FormControl('');
    }
    this.selectedFormControl.valueChanges.pipe(
      debounceTime(0)).subscribe((data) => {
        if (this.flagLoad) {
          if (data && data.length >= 3) {
            this.loadField(data);
          }
        }
      });
  }

  loadField(data) {
    const aux = {
      filter: data,
      order: 'DOC_ID',
      fields: 'DOC_ID,ID,project_name,DISPLAYNAME,customer,customerid'
    };
    this.projectsService.findProjects(aux, this.isSession).subscribe((response) => {
      if (response) {
        this.buildProject(response.proyectos);
      }
    });
  }

  buildProject(proyects) {
    this.proyects = [];
    proyects.forEach((item) => {
      const aux = { id: 0, description: '', project: '', disabled: false, customer: null, customerid: null };
      aux.id = item.Values.ID;
      aux.description = item.Values.DISPLAYNAME;
      aux.project = item.Values.PROJECT_NAME;
      aux.customerid = item.Values.CUSTOMERID;
      aux.customer = item.Values.CUSTOMER;

      this.proyects.push(aux);
    });
  }

  itemSelected(event) {
    this.flagLoad = false;
    this.proyectsSelected = event;
    this.selectedFormControl.setValue(event.description);
    this.proyectsSelectedData.emit(this.proyectsSelected);
  }

  handlerError(event) {
    console.log('handlerError' + this.text, event);
  }

  focusPredictive(event) {

  }


  // buildProjectTextfield(proyects) {
  //   this.projects = [];
  //   proyects.forEach((item) => {
  //     const aux = { id: 0, description: '', project: '', disabled: false, customer: null, customerid: null };
  //     aux.id = item.Values.ID;
  //     aux.description = item.Values.DISPLAYNAME;
  //     aux.project = item.Values.PROJECT_NAME;
  //     aux.customerid = item.Values.CUSTOMERID;
  //     aux.customer = item.Values.CUSTOMER;

  //     this.projects.push(aux);
  //   });
  // }
}
