import { Component, EventEmitter, Input, Output, OnInit } from '@angular/core';
import { LoadingTypeStyleMapping } from '../loading/loading.component';
import { ComponentType } from '../../utils/enums/component-type.const';

const ButtonTypeStyleMapping = new Map<string, string>();
ButtonTypeStyleMapping.set(ComponentType.PRIMARY, 'btn-primary');
ButtonTypeStyleMapping.set(ComponentType.SECONDARY, 'btn-secondary');
ButtonTypeStyleMapping.set(ComponentType.STICKY, 'btn-sticky');
ButtonTypeStyleMapping.set(ComponentType.LINK, 'btn-link');
ButtonTypeStyleMapping.set(ComponentType.HEADER, 'btn-header');

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss']
})
export class ButtonComponent {
  @Input() text: string;
  @Input() disabled = false;
  @Input() isLoading = false;
  @Input() widthButton: string;
  backgroundRipple = 'rgba(255, 255, 255, 0.32)';
  @Output() clickButton = new EventEmitter();

  typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.PRIMARY);
  typeLoadingClass = LoadingTypeStyleMapping.get(ComponentType.PRIMARY);

  public isBackground = true;
  @Input()
  set type(type: string) {
    switch (type) {
      case ComponentType.PRIMARY: {
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.PRIMARY);
        this.typeLoadingClass = ComponentType.PRIMARY;
        this.backgroundRipple = 'rgba(255, 255, 255, 0.32)';
        break;
      }
      case ComponentType.SECONDARY: {
        this.isBackground = false;
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.SECONDARY);
        this.typeLoadingClass = ComponentType.SECONDARY;
        this.backgroundRipple = 'rgba(255, 102, 0, 0.32)';
        break;
      }
      case ComponentType.STICKY: {
        this.isBackground = true;
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.STICKY);
        this.backgroundRipple = 'rgba(255, 255, 255, 0.32)';
        break;
      }
      case ComponentType.LINK: {
        this.isBackground = false;
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.LINK);
        this.backgroundRipple = 'rgba(255, 102, 0, 0.32)';
        break;
      }
      case ComponentType.HEADER: {
        this.isBackground = false;
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.HEADER);
        this.backgroundRipple = 'rgba(255, 255, 255, 0.32)';
        break;
      }
      default: {
        this.typeButtonClass = ButtonTypeStyleMapping.get(ComponentType.PRIMARY);
        this.typeLoadingClass = ComponentType.PRIMARY;
        this.backgroundRipple = 'rgba(255, 255, 255, 0.32)';
      }
    }
  }
  public isClicked: boolean;

  constructor() {
    this.isClicked = false;
  }

  onButtonClicked() {

    if (!this.disabled) {
      this.clickButton.emit();
    }
  }
}
