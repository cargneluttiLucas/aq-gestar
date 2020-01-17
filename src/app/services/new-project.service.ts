import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { NewProjectModel } from '../models/new-project.model';

@Injectable()

export class NewProjectService {

  private url = 'http://3.227.233.169:80/bffgestar/api/v1/Proyectos/';

  constructor(private http: HttpClient) {
  }

  public getNewProyect(sessionId: string) {
    const options = {
      headers: {
        SessionId: '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.get<any>(this.url + 'New/', options);
  }

  public getOpenProyect(projectId: number, sessionId: string) {
    const options = {
      headers: {
        SessionId: '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.get<any>(this.url + 'Doc/' + projectId, options);
  }

  putSaveProject(data: any, sessionId: string) {
    const options = {
      headers: {
        SessionId: '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.post<any>(this.url, data, options);
  }

  putChangeProject(data: any, projectId: number, sessionId: string) {
    const options = {
      headers: {
        SessionId: '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.put<any>(this.url + 'Doc/' + projectId, data, options);
  }

}
