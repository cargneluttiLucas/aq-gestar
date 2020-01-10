import { ComponentRef } from '@angular/core';

export class ModalDialogInstanceService {
  private componentRefs: ComponentRef<{}>[] = [];

  closeAnyExistingModalDialog() {
    while (this.componentRefs.length) {
      this.componentRefs[this.componentRefs.length - 1].destroy();
    }
  }

  saveExistingModalDialog(componentRef: ComponentRef<any>) {
    this.componentRefs = [...this.componentRefs, componentRef];

    componentRef.onDestroy(() => {
      this.componentRefs.pop();
    });
  }
}
