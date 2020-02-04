import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable()
export class UserService {

  options = {
    headers: {
      SessionId: '',
    },
    'Content-Type': 'application/json'
  };

  constructor(private http: HttpClient) {
  }

  findUser(filter, sessionId) {
    this.options.headers.SessionId = sessionId;
    return this.http.post<any>(environment.addresses.user.findUser, filter, this.options);
  }

}
