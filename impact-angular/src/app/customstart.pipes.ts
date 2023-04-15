import { Pipe, PipeTransform } from '@angular/core';


    @Pipe({name: 'startsWith'})
    export class startsWithPipe implements PipeTransform {
      transform(value: any[], term: string): any[] {
        return value.filter((x:any) => x.headline.toLowerCase().startsWith(term.toLowerCase()) || x.publication.toLowerCase().startsWith(term.toLowerCase()))

      } 
    }