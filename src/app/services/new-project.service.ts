import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable()

export class NewProjectService {

  private url = 'http://3.227.233.169:80/bffgestar/api/v1/Proyectos/';

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
    return this.http.get<any>(this.url + 'New/', this.options);
  }

  public getOpenProyect(projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(this.url + 'Doc/' + projectId, this.options);
  }

  putSaveProject(data: any, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(this.url, data, this.options);
  }

  putChangeProject(data: any, projectId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(this.url + 'Doc/' + projectId, data, this.options);
  }

  findSponsor(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Usuarios', filter, this.options);
  }

  findUser(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Usuarios', filter, this.options);
  }

  findCliend(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Contactos', filter, this.options);
  }

}
