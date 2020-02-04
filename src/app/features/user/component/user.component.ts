import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { UserService } from '../service/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit, OnChanges {

  @Input() isSession: string;
  @Input() text: string;
  @Input() id: string;
  @Input() selectedFormControl: FormControl;
  @Input() minLength: number;
  @Input() userSelected = { id: null, description: '', disabled: false };

  @Output() userSelectedData = new EventEmitter();

  users: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    if (!this.selectedFormControl) {
      this.selectedFormControl = new FormControl('');
    }
  }

  ngOnChanges() {
    if (this.userSelected.id !== null) {
      this.selectedFormControl.setValue(this.userSelected.description);
    }
    this.loadField();
  }

  loadField() {
    const aux = {
      userFilter: '',
      userOrder: ''
    };
    this.userService.findUser(aux, this.isSession).subscribe((response) => {
      if (response.usuarios) {
        this.buildUser(response.usuarios);
      }
    });
  }

  buildUser(user) {
    this.users = [];
    user.forEach((item) => {
      const aux = { id: 0, description: '', disabled: false };
      aux.id = item.userId.value;
      aux.description = item.userFullName.value;
      this.users.push(aux);
    });
  }

  itemSelected(event) {
    this.userSelected = event;
    this.selectedFormControl.setValue(event.description);
    this.userSelectedData.emit(this.userSelected);
  }

  handlerError(event) {
    console.log('handlerError' + this.text, event);
  }
}
