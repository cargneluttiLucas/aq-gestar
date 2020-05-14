import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class RequierementsService {

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
    return this.http.get<any>(environment.addresses.requirement.getNewSelects, this.options);
  }

  public getNewRequirements(sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environment.addresses.requirement.getNewRequirements, this.options);
  }

  public getOpenByDocId(requirementId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environment.addresses.requirement.getOpenByDocId + requirementId, this.options);
  }

  saveNewRequirement(data: any, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.requirement.saveNewRequirement, data, this.options);
  }

  changeRequirementById(data: any, requirementId: number, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(environment.addresses.requirement.changeRequirementById + requirementId, data, this.options);
  }

  searchUsers(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.user.findUser, filterData, this.options);
  }

  searchActivities(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.activities.searchActivities, filterData, this.options);
  }

  public getSetting(setting: string, sessionId: string) {
    const aux = {
      filter: `SETTING in ('${setting.replace(/'/g, "''")}')`,
    };
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.settings.getSetting, aux, this.options);
  }

  loggedUserInfo(sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environment.addresses.loggedUserInfo.loggedUserInfo, this.options);
  }
}
