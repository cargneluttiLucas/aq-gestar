import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequierementsService {

  private url = 'http://3.227.233.169:80/bffgestar/api/v1/Requerimientos/';

  options = {
    headers: {
      SessionId: '',
    },
    'Content-Type': 'application/json'
  };

  constructor(private http: HttpClient) {
  }

  public getNewSelects(sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(this.url + 'New/Keywords', this.options);
  }

  public getNewRequirements(sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(this.url + 'New/', this.options);
  }

  public getOpenByDocId(requirementId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(this.url + 'Doc/' + requirementId, this.options);
  }

  saveNewRequirement(data: any, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(this.url, data, this.options);
  }

  changeRequirementById(data: any, requirementId: number, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(this.url + 'Doc/' + requirementId, data, this.options);
  }

  searchProject(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Proyectos/Find', filterData, this.options);
  }

  searchUsers(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Usuarios', filterData, this.options);
  }

  searchActivities(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>('http://3.227.233.169:80/bffgestar/api/v1/Actividades', filterData, this.options);
  }
}
