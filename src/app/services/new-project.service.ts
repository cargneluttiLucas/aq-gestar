import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NewProjectModel } from '../models/new-project.model';

@Injectable()

export class NewProjectService {

  constructor(private http: HttpClient) {
  }

  public getTypeProyect(sessionId: string) {
    // const options = {
    //   headers: {
    //     'SessionId': '8929ec6c49974e43a47935525a2b5259',
    //   },
    //   'Content-Type': 'application/json'
    // };
    const options = {
      headers: {
        'SessionId': sessionId,
      }
    };
    return this.http.get<any>('http://3.227.233.169:80/bffgestar/api/v1/Proyectos', options);
  }

  postSaveProject(data: NewProjectModel) {
    // return this.http.post<any>('');
  }

}
