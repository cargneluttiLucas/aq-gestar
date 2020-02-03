import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
// import { environmentStaging } from 'src/environments/environment.staging';
import { environmentProd } from 'src/environments/environment.prod';

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
    return this.http.get<any>(environmentProd.addresses.requirement.getNewSelects, this.options);
  }

  public getNewRequirements(sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environmentProd.addresses.requirement.getNewRequirements, this.options);
  }

  public getOpenByDocId(requirementId: number, sessionId: string) {
    this.options.headers.SessionId = sessionId;
    return this.http.get<any>(environmentProd.addresses.requirement.getOpenByDocId + requirementId, this.options);
  }

  saveNewRequirement(data: any, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.requirement.saveNewRequirement, data, this.options);
  }

  changeRequirementById(data: any, requirementId: number, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.put<any>(environmentProd.addresses.requirement.changeRequirementById + requirementId, data, this.options);
  }

  searchProject(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.project.searchProject, filterData, this.options);
  }

  searchUsers(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.user.findUser, filterData, this.options);
  }

  searchActivities(filterData, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environmentProd.addresses.activities.searchActivities, filterData, this.options);
  }
}
