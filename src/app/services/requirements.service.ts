import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class RequierementsService {
  constructor(private http: HttpClient) { }

  public getTypeProyect() {
    this.http.get<any>('');
    const subject = new Subject<any>();
    setTimeout(() => {
      subject.next([
        {
          id: 1, text: 'Requerimiento 1', disabled: false
        },
        {
          id: 2, text: 'Requerimiento 2', disabled: false
        },
        {
          id: 3, text: 'Requerimiento 3', disabled: false
        },
        {
          id: 4, text: 'Requerimiento 4', disabled: false
        },
      ]);
    }, 1000);
    return subject.asObservable();
  }
}
