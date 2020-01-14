import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NewProjectModel } from '../models/new-project.model';

@Injectable()

export class NewProjectService {

  constructor(private http: HttpClient) {
  }

  public getTypeProyect() {
    const options = {
      headers: {
        'SessionId': 'cd9646546a174c4caf0ead4ecf326f14',
      }
    };

    return this.http.get<any>('http://3.227.233.169:80/bffgestar/api/v1/Proyectos', options);
  }

  getStateProject() {
    // return this.http.get<any>('');
    const subject = new Subject<any>();
    setTimeout(() => {
      subject.next([
        {
          id: 1, text: 'Estado 1', disabled: false
        },
        {
          id: 2, text: 'Estado 2', disabled: false
        },
        {
          id: 3, text: 'Estado 3', disabled: false
        },
        {
          id: 4, text: 'Estado 4', disabled: false
        },
      ]);
    }, 1000);
    return subject.asObservable();
  }

  public getRiskProyect() {
    // return this.http.get<any>('');
    const subject = new Subject<any>();
    setTimeout(() => {
      subject.next([
        {
          id: 1, text: 'Riesgo 1', disabled: false
        },
        {
          id: 2, text: 'Riesgo 2', disabled: false
        },
        {
          id: 3, text: 'Riesgo 3', disabled: false
        },
        {
          id: 4, text: 'Riesgo 4', disabled: false
        },
      ]);
    }, 1000);
    return subject.asObservable();
  }

  getManagementAreaProject() {
    // return this.http.get<any>('');
    const subject = new Subject<any>();
    setTimeout(() => {
      subject.next([
        {
          id: 1, text: 'Área a cargo 1', disabled: false
        },
        {
          id: 2, text: 'Área a cargo 2', disabled: false
        },
        {
          id: 3, text: 'Área a cargo 3', disabled: false
        },
        {
          id: 4, text: 'Área a cargo 4', disabled: false
        },
      ]);
    }, 1000);
    return subject.asObservable();
  }

  postSaveProject(data: NewProjectModel) {
    // return this.http.post<any>('');
  }

}
