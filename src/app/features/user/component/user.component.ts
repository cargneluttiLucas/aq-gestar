import { Component, EventEmitter, Input, Output, OnInit, OnChanges } from '@angular/core';
import { FormControl, ValidatorFn, AbstractControl } from '@angular/forms';
import { UserService } from '../service/user.service';
import { debounceTime, tap, switchMap, finalize, startWith, filter } from 'rxjs/operators';

function autocompleteObjectValidator(): ValidatorFn {
  return (control: AbstractControl): { [key: string]: any } | null => {
    if (typeof control.value === 'string' && control.value !== '') {
      return { 'invalidAutocompleteObject': { value: control.value } }
    }
    return null  /* valid option selected */
  }
}

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})

export class UserComponent implements OnInit {

  @Input() sessionId: string;
  @Input() placeHolder: string;
  @Input() control: FormControl;
  @Input() userSelected = { id: null, description: '', disabled: false };

  filteredUsers: any[] = [];

  constructor(private userService: UserService) { }

  ngOnInit() {
    this.control.setValidators(autocompleteObjectValidator());
    this.control.setValue(this.userSelected);
    
    this.control
      .valueChanges
      .pipe(
        debounceTime(300),
        filter((str) => str !== ''),
        switchMap(value => this.userService.findUser({
          userFilter: value,
          userOrder: ''
        }, this.sessionId)
        )
      )
      .subscribe((response) => {
        if (response.usuarios) {
          this.buildUser(response.usuarios);
        }
      });
  }

  buildUser(user) {
    this.filteredUsers = [];
    user.forEach((item) => {
      const aux = { id: 0, description: '', disabled: false };
      aux.id = item.userId.value;
      aux.description = item.userFullName.value;
      this.filteredUsers.push(aux);
    });
  }

  displayFn(user): string | undefined {
    return user ? user.description : undefined;
  }
}
