import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'classlabel',
})
export class ClasslabelPipe implements PipeTransform {
  transform(value: unknown, ...args: unknown[]): unknown {
    return null;
  }
}
