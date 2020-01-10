declare var global: any;

// tslint:disable-next-line: only-arrow-functions
(function () {
  if (!global.KeyboardEvent) {
    // tslint:disable-next-line: only-arrow-functions
    global.KeyboardEvent = function (_eventType: any, _init: any) { };
  }
})();

export type CustomKeyboardEvent = KeyboardEvent;
