import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

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
    return this.http.get<any>(environment.addresses.project.getNewProyect, this.options);
  }

  public getOpenProyect(projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environment.addresses.project.getOpenProyect + projectId, this.options);
  }

  putSaveProject(data: any, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.project.putSaveProject, data, this.options);
  }

  putChangeProject(data: any, projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(environment.addresses.project.putChangeProject + projectId, data, this.options);
  }

  findSponsor(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.user.findUser, filter, this.options);
  }

  findUser(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.user.findUser, filter, this.options);
  }

  findCliend(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.contact.findCliend, filter, this.options);
  }

  loggedUserInfo(sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.loggedUserInfo.loggedUserInfo, this.options);
  }

}
