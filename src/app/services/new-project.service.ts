import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environmentStaging } from 'src/environments/environment.staging';
import { environmentProd } from 'src/environments/environment.prod';

@Injectable()

export class NewProjectService {

  options = {
    headers: {
      SessionId: '',
    },
    'Content-Type': 'application/json'
  };

  constructor(private http: HttpClient) {
  }

  public getNewProyect(sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environmentProd.addresses.project.getNewProyect, this.options);
  }

  public getOpenProyect(projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environmentProd.addresses.project.getOpenProyect + projectId, this.options);
  }

  putSaveProject(data: any, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.project.putSaveProject, data, this.options);
  }

  putChangeProject(data: any, projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(environmentProd.addresses.project.putChangeProject + projectId, data, this.options);
  }

  findSponsor(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.user.findUser, filter, this.options);
  }

  findCliend(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.contact.findCliend, filter, this.options);
  }

}
