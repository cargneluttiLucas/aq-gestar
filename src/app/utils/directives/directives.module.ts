import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RippleEffectDirective } from './ripple-effect/ripple-effect.directive';
import { HoverDirective } from './hover/hover.directive';
import { OuterClickDirective } from './outerclick/outerclick.directive';
import { ErrorFeedbackDirective } from './error-feedback/error-feedback.directive';
import { BrowserDirective } from './browser/browser.directive';
import { DatePipe } from '../pipes/date.pipes';
import { IterateKeys } from '../pipes/iterate-keys.pipes';

export const commonPipes = [
  IterateKeys,
  DatePipe,
  RippleEffectDirective,
  HoverDirective,
  OuterClickDirective,
  BrowserDirective,
  ErrorFeedbackDirective
];
@NgModule({
  imports: [
    CommonModule,
    FormsModule
  ],
  declarations: commonPipes,
  exports: commonPipes
})
export class DirectiveModule {
  constructor() {}
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: DirectiveModule
    };
  }
}
