import { Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'classname', standalone: true })
export class ClassNamePipe implements PipeTransform {
  transform(classes: any[], classId: number): string {
    const found = classes.find((c) => c.id === classId);
    return found ? `${found.className} - ${found.section}` : '';
  }
}
