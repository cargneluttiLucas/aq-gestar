import { config, INITIAL_CONFIG, initialConfig, NEW_CONFIG, optionsConfig } from './config';
import { MaskApplierService } from './mask-applier.service';
import { MaskDirective } from './mask.directive';
import { MaskPipe } from './mask.pipe';
import { ModuleWithProviders, NgModule } from '@angular/core';

@NgModule({
  exports: [MaskDirective, MaskPipe],
  declarations: [MaskDirective, MaskPipe]
})
export class MaskModule {
  public static forRoot(configValue?: optionsConfig | (() => optionsConfig)): ModuleWithProviders {
    return {
      ngModule: MaskModule,
      providers: [{
        provide: NEW_CONFIG,
        useValue: configValue},
      { provide: INITIAL_CONFIG, useValue: initialConfig },
      { provide: config, useFactory: _configFactory, deps: [INITIAL_CONFIG, NEW_CONFIG] },
        MaskApplierService
      ]};
  }
  public static forChild(_configValue?: optionsConfig): ModuleWithProviders {
    return {
      ngModule: MaskModule
    };
  }
}

/**
 * @internal
 */
// tslint:disable-next-line: function-name
export function _configFactory(
    initConfig: optionsConfig,
    configValue: optionsConfig | (() => optionsConfig)
): optionsConfig {
  return configValue instanceof Function ? { ...initConfig, ...configValue() } : { ...initConfig, ...configValue };
}
