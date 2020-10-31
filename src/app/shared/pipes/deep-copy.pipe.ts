import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'deepCopy'
})
export class DeepCopyPipe implements PipeTransform {

  transform(value: any[]): any[] {
    return JSON.parse(JSON.stringify(value));
  }

}
