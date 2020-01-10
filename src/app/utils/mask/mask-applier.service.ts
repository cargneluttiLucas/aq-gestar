import { Inject, Injectable } from '@angular/core';
import { config, IConfig } from './config';

export enum Separators {
  SEPARATOR = 'separator', COMMA_SEPARATOR = 'comma_separator', DOT_SEPARATOR = 'dot_separator'
}

@Injectable()
export class MaskApplierService {
  public dropSpecialCharacters: IConfig['dropSpecialCharacters'];
  public hiddenInput: IConfig['hiddenInput'];
  public showTemplate!: IConfig['showTemplate'];
  public clearIfNotMatch!: IConfig['clearIfNotMatch'];
  public maskExpression = '';
  public actualValue = '';
  public shownMaskExpression = '';
  public maskSpecialCharacters!: IConfig['specialCharacters'];
  public maskAvailablePatterns!: IConfig['patterns'];
  public prefix!: IConfig['prefix'];
  public suffix!: IConfig['suffix'];
  public customPattern!: IConfig['patterns'];
  public ipError?: boolean;
  public showMaskTyped!: IConfig['showMaskTyped'];
  public validation: IConfig['validation'];

  private _shift!: Set<number>;

  public constructor(@Inject(config) protected _config: IConfig) {
    this._shift = new Set();
    this.clearIfNotMatch = this._config.clearIfNotMatch;
    this.dropSpecialCharacters = this._config.dropSpecialCharacters;
    // tslint:disable-next-line: no-non-null-assertion
    this.maskSpecialCharacters = this._config!.specialCharacters;
    this.maskAvailablePatterns = this._config.patterns;
    this.prefix = this._config.prefix;
    this.suffix = this._config.suffix;
    this.hiddenInput = this._config.hiddenInput;
    this.showMaskTyped = this._config.showMaskTyped;
    this.validation = this._config.validation;
  }

  // tslint:disable-next-line:no-any
  public applyMaskWithPattern(inputValue: string, maskAndPattern: [string, IConfig['patterns']]): string {
    const [mask, customPattern] = maskAndPattern;
    this.customPattern = customPattern;
    return this.applyMask(inputValue, mask);
  }

  public applyMask(inputValue: string, maskExpression: string, position: number = 0, cb: Function = () => {
  }): string {
    if (inputValue === undefined || inputValue === null || maskExpression === undefined) {
      return '';
    }
    let cursor = 0;
    let result = ``;
    let multi = false;
    let backspaceShift = false;
    let shift = 1;
    let stepBack = false;
    if (inputValue.slice(0, this.prefix.length) === this.prefix) {
      // tslint:disable-next-line: no-parameter-reassignment
      inputValue = inputValue.slice(this.prefix.length, inputValue.length);
    }
    const inputArray: string[] = inputValue.toString().split('');
    if (this.maskExpression === 'IP') {
      this.ipError = !!(inputArray.filter((i: string) => i === '.').length < 3 && inputArray.length < 7);
      this.maskExpression = '099.099.099.099';
    }
    if (this.maskExpression.startsWith('percent')) {
      if (inputValue.match('[a-z]|[A-Z]') || inputValue.match(/[-!$%^&*()_+|~=`{}\[\]:";'<>?,\/]/)) {
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = this._checkInput(inputValue);
        const precision: number = this.getPrecision(this.maskExpression);
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = this.checkInputPrecision(inputValue, precision, '.');
      }
      if (inputValue.indexOf('.') > 0 && !this.percentage(inputValue.substring(0, inputValue.indexOf('.')))) {
        const base: string = inputValue.substring(0, inputValue.indexOf('.') - 1);
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = `${base}${inputValue.substring(inputValue.indexOf('.'), inputValue.length)}`;
      }
      if (this.percentage(inputValue)) {
        result = inputValue;
      } else {
        result = inputValue.substring(0, inputValue.length - 1);
      }
    } else if (this.maskExpression.startsWith(Separators.SEPARATOR) || this.maskExpression.startsWith(Separators.DOT_SEPARATOR)
      || this.maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
      if (inputValue.match('[wа-яА-Я]') || inputValue.match('[ЁёА-я]') || inputValue.match('[a-z]|[A-Z]')
        || inputValue.match(/[-@#!$%\\^&*()_£¬'+|~=`{}\[\]:";<>.?\/]/) || inputValue.match('[^A-Za-z0-9,]')) {
        // tslint:disable-next-line:no-parameter-reassignment
        inputValue = this._checkInput(inputValue);
      }
      const precision: number = this.getPrecision(maskExpression);
      let strForSep: string;
      if (maskExpression.startsWith(Separators.SEPARATOR)) {
        if (inputValue.includes('.') && inputValue.endsWith('.') && inputValue.indexOf('.') !== inputValue.lastIndexOf('.')) {
          // tslint:disable-next-line:no-parameter-reassignment
          inputValue = inputValue.substring(0, inputValue.length - 1);
        }
        // inputValue = inputValue.replace('.', ',');
      }
      if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
        if (inputValue.indexOf('.') !== -1 && inputValue.indexOf('.') === inputValue.lastIndexOf('.') && (inputValue.indexOf('.') > 3
          || inputValue.length < 6)) {
          // tslint:disable-next-line:no-parameter-reassignment
          inputValue = inputValue.replace('.', ',');
        }
        // tslint:disable-next-line:no-parameter-reassignment
        inputValue = inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== ',' ?
          inputValue.slice(1, inputValue.length) : inputValue;
      }
      if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = inputValue.length > 1 && inputValue[0] === '0' && inputValue[1] !== '.'
          ? inputValue.slice(1, inputValue.length) : inputValue;
      }
      const suffixCurrency: string[] = ['₽', '€', '₴', '$', '£', '¥'];
      let currencyExist = false;
      suffixCurrency.forEach((val: string) => {
        if (inputValue.includes(val)) {
          currencyExist = true;
        }
      });
      if (maskExpression.startsWith(Separators.SEPARATOR)) {
        if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:,";<>?\/]/) || currencyExist) {
          // tslint:disable-next-line: no-parameter-reassignment
          inputValue = inputValue.substring(0, inputValue.length - 1);
        }
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = this.checkInputPrecision(inputValue, precision, '.');
        strForSep = inputValue.replace(/\s/g, '');
        result = this.separator(strForSep, ' ', '.', precision);
      } else if (maskExpression.startsWith(Separators.DOT_SEPARATOR)) {
        if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:\s";<>?\/]/) || currencyExist) {
          // tslint:disable-next-line: no-parameter-reassignment
          inputValue = inputValue.substring(0, inputValue.length - 1);
        }
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = this.checkInputPrecision(inputValue, precision, ',');
        strForSep = inputValue.replace(/\./g, '');
        result = this.separator(strForSep, '.', ',', precision);
      } else if (maskExpression.startsWith(Separators.COMMA_SEPARATOR)) {
        if (inputValue.match(/[@#!$%^&*()_+|~=`{}\[\]:\s";<>?\/]/) || currencyExist) {
          // tslint:disable-next-line: no-parameter-reassignment
          inputValue = inputValue.substring(0, inputValue.length - 1);
        }
        strForSep = inputValue.replace(/,/g, '');
        result = this.separator(strForSep, ',', '.', precision);
      }

      const commaShift: number = result.indexOf(',') - inputValue.indexOf(',');
      const shiftStep: number = result.length - inputValue.length;

      if (shiftStep > 0 && result[position] !== ',') {
        backspaceShift = true;
        let _shift = 0;
        do {
          this._shift.add(position + _shift);
          // tslint:disable-next-line: no-increment-decrement
          _shift++;
        } while (_shift < shiftStep);
      } else if ((commaShift !== 0 && position > 0 && !(result.indexOf(',') >= position && position > 3))
              || (!(result.indexOf('.') >= position && position > 3) && shiftStep <= 0)) {
        this._shift.clear();
        backspaceShift = true;
        shift = shiftStep;
        // tslint:disable-next-line: no-parameter-reassignment
        position += shiftStep;
        this._shift.add(position);
      } else {
        this._shift.clear();
      }
    } else {
      for (// tslint:disable-next-line
        let i: number = 0, inputSymbol: string = inputArray[0]; i < inputArray.length; i++ , inputSymbol = inputArray[i]) {
        if (cursor === maskExpression.length) {
          break;
        }
        if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '?') {
          result += inputSymbol;
          cursor += 2;
        } else if (maskExpression[cursor + 1] === '*' && multi && this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])) {
          result += inputSymbol;
          cursor += 3;
          multi = false;
        } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor]) && maskExpression[cursor + 1] === '*') {
          result += inputSymbol;
          multi = true;
        } else if (maskExpression[cursor + 1] === '?' && this._checkSymbolMask(inputSymbol, maskExpression[cursor + 2])) {
          result += inputSymbol;
          cursor += 3;
        } else if (this._checkSymbolMask(inputSymbol, maskExpression[cursor])
        || (this.hiddenInput && this.maskAvailablePatterns[maskExpression[cursor]]
          && this.maskAvailablePatterns[maskExpression[cursor]].symbol === inputSymbol)) {
          if (maskExpression[cursor] === 'H') {
            if (Number(inputSymbol) > 2) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }
          if (maskExpression[cursor] === 'h') {
            if (result === '2' && Number(inputSymbol) > 3) {
              cursor += 1;
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }
          if (maskExpression[cursor] === 'm') {
            if (Number(inputSymbol) > 5) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }
          if (maskExpression[cursor] === 's') {
            if (Number(inputSymbol) > 5) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }
          if (maskExpression[cursor - 1] === 'd') {
            if (Number(inputValue.slice(cursor - 1, cursor + 1)) > 31 || inputValue[cursor] === '/') {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }
          if (maskExpression[cursor] === 'M') {
            if ((inputValue[cursor - 1] === '/' && (Number(inputValue.slice(cursor, cursor + 2)) > 12
            || inputValue[cursor + 1] === '/')) || (Number(inputValue.slice(cursor - 1, cursor + 1)) > 12
            || Number(inputValue.slice(0, 2)) > 31 || (Number(inputValue[cursor - 1]) > 1 && inputValue[cursor - 2] === '/'))) {
              cursor += 1;
              const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
              this._shift.add(shiftStep + this.prefix.length || 0);
              // tslint:disable-next-line: no-increment-decrement
              i--;
              continue;
            }
          }

          result += inputSymbol;
          // tslint:disable-next-line: no-increment-decrement
          cursor++;
        } else if (this.maskSpecialCharacters.indexOf(maskExpression[cursor]) !== -1) {
          result += maskExpression[cursor];
          // tslint:disable-next-line: no-increment-decrement
          cursor++;
          const shiftStep: number = /[*?]/g.test(maskExpression.slice(0, cursor)) ? inputArray.length : cursor;
          this._shift.add(shiftStep + this.prefix.length || 0);
          // tslint:disable-next-line: no-increment-decrement
          i--;
        } else if (this.maskSpecialCharacters.indexOf(inputSymbol) > -1 && this.maskAvailablePatterns[maskExpression[cursor]]
          && this.maskAvailablePatterns[maskExpression[cursor]].optional) {
          // tslint:disable-next-line: no-increment-decrement
          cursor++;
          // tslint:disable-next-line: no-increment-decrement
          i--;
        } else if (this.maskExpression[cursor + 1] === '*'
        && this._findSpecialChar(this.maskExpression[cursor + 2])
        && this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] && multi) {
          cursor += 3;
          result += inputSymbol;
        } else if (this.maskExpression[cursor + 1] === '?'
        && this._findSpecialChar(this.maskExpression[cursor + 2])
        && this._findSpecialChar(inputSymbol) === this.maskExpression[cursor + 2] && multi) {
          cursor += 3;
          result += inputSymbol;
        } else if (this.showMaskTyped && this.maskSpecialCharacters.indexOf(inputSymbol) < 0 && inputSymbol !== '_') {
          stepBack = true;
        }
      }
    }
    if (result.length + 1 === maskExpression.length
      && this.maskSpecialCharacters.indexOf(maskExpression[maskExpression.length - 1]) !== -1) {
      result += maskExpression[maskExpression.length - 1];
    }

    let newPosition: number = position + 1;

    while (this._shift.has(newPosition)) {
      // tslint:disable-next-line: no-increment-decrement
      shift++;
      // tslint:disable-next-line: no-increment-decrement
      newPosition++;
    }

    let actualShift: number = this._shift.has(position) ? shift : 0;
    if (stepBack) {
      // tslint:disable-next-line: no-increment-decrement
      actualShift--;
    }

    cb(actualShift, backspaceShift);
    if (shift < 0) {
      this._shift.clear();
    }
    let res: string = this.suffix ? `${this.prefix}${result}${this.suffix}` : `${this.prefix}${result}`;
    if (result.length === 0) {
      res = `${this.prefix}${result}`;
    }
    return res;
  }

  // tslint:disable-next-line: function-name
  public _findSpecialChar(inputSymbol: string): undefined | string {
    return this.maskSpecialCharacters.find((val: string) => val === inputSymbol);
  }

  // tslint:disable-next-line: function-name
  protected _checkSymbolMask(inputSymbol: string, maskSymbol: string): boolean {
    this.maskAvailablePatterns = this.customPattern ? this.customPattern : this.maskAvailablePatterns;
    return (this.maskAvailablePatterns[maskSymbol] &&
      this.maskAvailablePatterns[maskSymbol].pattern && this.maskAvailablePatterns[maskSymbol].pattern.test(inputSymbol));
  }

  private separator = (str: string, char: string, decimalChar: string, precision: number) => {
    // tslint:disable-next-line: no-parameter-reassignment
    str += '';
    const x: string[] = str.split(decimalChar);
    const decimals: string = x.length > 1 ? `${decimalChar}${x[1]}` : '';
    let res: string = x[0];
    const rgx: RegExp = /(\d+)(\d{3})/;
    while (rgx.test(res)) {
      // tslint:disable-next-line:prefer-template
      res = res.replace(rgx, '$1' + char + '$2');
    }
    if (precision === undefined) {
      return res + decimals;
    }
    if (precision === 0) {
      return res;
    }
    return res + decimals.substr(0, precision + 1);
  }

  private percentage = (str: string): boolean => {
    return Number(str) >= 0 && Number(str) <= 100;
  }

  private getPrecision = (maskExpression: string): number => {
    const x: string[] = maskExpression.split('.');
    if (x.length > 1) {
      return Number(x[x.length - 1]);
    }

    return Infinity;
  }

  private checkInputPrecision = (inputValue: string, precision: number, decimalMarker: string): string => {
    if (precision < Infinity) {
      let precisionRegEx: RegExp;

      if (decimalMarker === '.') {
        precisionRegEx = new RegExp(`\\.\\d{${precision}}.*$`);
      } else {
        precisionRegEx = new RegExp(`,\\d{${precision}}.*$`);
      }

      const precisionMatch: RegExpMatchArray | null = inputValue.match(precisionRegEx);
      if (precisionMatch && precisionMatch[0].length - 1 > precision) {
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = inputValue.substring(0, inputValue.length - 1);
      } else if (precision === 0 && inputValue.endsWith(decimalMarker)) {
        // tslint:disable-next-line: no-parameter-reassignment
        inputValue = inputValue.substring(0, inputValue.length - 1);
      }
    }
    return inputValue;
  }

  // tslint:disable-next-line: function-name
  private _checkInput(str: string): string {
    return str
      .split('')
      .filter((i: string) => i.match('\\d') || i === '.' || i === ',')
      .join('');
  }

  // tslint:disable-next-line: max-file-line-count
}
