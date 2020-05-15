import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { ClientService } from '../service/client.service';
import { debounceTime, tap, switchMap, finalize, startWith, filter } from 'rxjs/operators';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value !== '') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

function autocompleteRequiredValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (!control.value.id) {
      return { 'mandatoryField': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit, OnChanges {

  @Input() sessionId: string;
  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() required = false;

  filteredClients: any[] = [];

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    this.control
      .valueChanges
      .pipe(
        debounceTime(300),
        filter((str) => typeof str === 'string' && str !== ''),
        switchMap(value => this.clientService.findCliend({
          filter: value,
          filterRequired: 'CONTACTTYPE = 1',
          order: 'ID',
          fields: 'ID,DISPLAYNAME',
        }, this.sessionId)
        )
      )
      .subscribe((response) => {
        if (response) {
          this.buildClient(response.contactos);;
        }
      });
  }

  ngOnChanges(){
    this.control.setValidators(autocompleteObjectValidator());
    if (this.required) {
      this.control.setValidators([this.control.validator, autocompleteRequiredValidator()]);
    }
  }

  buildClient(client) {
    this.filteredClients = [];
    client.forEach((item) => {
      const aux = { id: 0, description: '', disabled: false };
      aux.id = item.Values.ID;
      aux.description = item.Values.DISPLAYNAME;
      this.filteredClients.push(aux);
    });
  }

  displayFn(user): string | undefined {
    return user ? user.description : undefined;
  }
}
