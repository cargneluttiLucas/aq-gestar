import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ClientService } from '../service/client.service';

@Component({
  selector: 'app-client',
  templateUrl: './client.component.html',
  styleUrls: ['./client.component.scss']
})
export class ClientComponent implements OnInit {

  @Input() selectedFormControl: FormControl;
  @Input() isSession: string;
  @Input() text: string;
  @Input() id: string;
  clients: any[] = [];

  @Input() clientSelected = { id: null, description: '', disabled: false };
  @Output() clientSelectedData = new EventEmitter();

  constructor(private clientService: ClientService) { }

  ngOnInit() {
    if (!this.selectedFormControl) {
      this.selectedFormControl = new FormControl('');
    }
    this.loadField();
  }

  loadField() {
    const aux = {
      filter: '',
      filterRequired: 'CONTACTTYPE = 1',
      order: 'DOC_ID',
      fields: 'DOC_ID,DISPLAYNAME',
    };
    this.clientService.findCliend(aux, this.isSession).subscribe((response) => {
      if (response) {
        this.buildClient(response.contactos);
      }
    });
  }

  buildClient(client) {
    this.clients = [];
    client.forEach((item) => {
      const aux = { id: 0, description: '', disabled: false };
      aux.id = item.Values.DOC_ID;
      aux.description = item.Values.DISPLAYNAME;
      this.clients.push(aux);
    });
  }

  itemSelected(event) {
    this.clientSelected = event;
    this.selectedFormControl.setValue(event.description);
    this.clientSelectedData.emit(this.clientSelected);
  }

  handlerError(event) {
  }
}
