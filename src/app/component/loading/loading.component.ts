import { Component, Input } from '@angular/core';
import { ComponentType } from '../../utils/enums/component-type.const';

export const LoadingTypeStyleMapping = new Map<string, string>();
LoadingTypeStyleMapping.set(ComponentType.PRIMARY, 'primary');
LoadingTypeStyleMapping.set(ComponentType.SECONDARY, 'secondary');

@Component({
  selector: 'app-loading',
  templateUrl: './loading.component.html',
  styleUrls: ['./loading.component.scss']
})
export class LoadingComponent {
  @Input() size = 'medium';
  @Input()
  set type(type: string) {
    this.typeLoadingClass = LoadingTypeStyleMapping.get(type) || LoadingTypeStyleMapping.get('primary');
  }
  typeLoadingClass = LoadingTypeStyleMapping.get('primary');
  @Input() withBg = false;
}
