import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequierementsService {

  private url = 'http://3.227.233.169:80/bffgestar/api/v1/Requerimientos/';

  constructor(private http: HttpClient) {
  }

  public getNew(sessionId: string) {
    const options = {
      headers: {
        'SessionId': '8929ec6c49974e43a47935525a2b5259',
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

  public getOpenByDocId(requirementId: number, sessionId: string) {
    const options = {
      headers: {
        'SessionId': '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.get<any>(this.url + 'Doc/' + requirementId, options);
  }

  saveNewRequirement(data: any) {
    const options = {
      headers: {
        'SessionId': '8929ec6c49974e43a47935525a2b5259',
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

  changeRequirementById(data: any, requirementId: number) {
    const options = {
      headers: {
        'SessionId': '8929ec6c49974e43a47935525a2b5259',
      },
      'Content-Type': 'application/json'
    };
    // const options = {
    //   headers: {
    //     SessionId: sessionId,
    //   }
    // };
    return this.http.put<any>(this.url + 'Doc/' + requirementId, data, options);
  }
}
