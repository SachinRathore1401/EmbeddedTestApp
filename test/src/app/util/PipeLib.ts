import { Pipe, PipeTransform, SecurityContext,Component } from "@angular/core";
import { DatePipe } from "@angular/common";
import { DomSanitizer } from "@angular/platform-browser";
import { combineAll } from "rxjs/operators";

@Pipe({
  name: 'dateFormatPipe',
})
export class dateFormatPipe implements PipeTransform {
  transform(value: string, format) {
    var datePipe = new DatePipe("en-US");
    value = datePipe.transform(value, format);
    return value;
  }
}

@Pipe({
  name: 'safe'
})
export class SafePipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }
  transform(url) {
    return this.sanitizer.bypassSecurityTrustResourceUrl(url);
  }

}

@Pipe({ name: 'groupBy' })
export class GroupByPipe implements PipeTransform {
  transform(value: Array<any>, field: string): Array<any> {
    let groupedObj = {};
    // field.forEach((value1, key1) => {
    groupedObj = value.reduce((prev, cur) => {
      if (!prev[cur[field]]) {
        prev[cur[field]] = [cur];
      } else {
        prev[cur[field]].push(cur);
      }
      return prev;
    }, {});
    //});
    return Object.keys(groupedObj).map(key => ({ key, value: groupedObj[key] }));
  }
}

// @Pipe({ name: 'safeHtml' })
// export class Safe {
//   constructor(private sanitizer: DomSanitizer) { }
//   transform(value: any, args?: any): any {
//     return this.sanitizer.bypassSecurityTrustHtml(value);
//     // return this.sanitizer.bypassSecurityTrustStyle(style);
//     // return this.sanitizer.bypassSecurityTrustXxx(style); - see docs
//   }
// }
@Pipe({ name: 'safeHtml' })
export class Safe {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, args?: any): any {
    if (value) {
      return this.sanitizer.sanitize(SecurityContext.HTML, value);
    }
    else {
      return '';
    }
  }
}

@Pipe({ name: 'allowSafeHtmlNewTab' })
export class safeHtmlNewTab  {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, args?: any): any {
    if (value) {
      return this.sanitizer.bypassSecurityTrustHtml(value);
    }
    else {
      return '';
    }
  }
}

@Pipe({
  name: 'orderBy'
})
export class OrderBy {
  transform(array, orderBy, asc = true) {
    if (!orderBy || orderBy.trim() == "") {
      return array;
    }
    //ascending
    if (asc) {
      return Array.from(array).sort((item1: any, item2: any) => {
        return this.orderByComparator(item1[orderBy], item2[orderBy]);
      });
    }
    else {
      //not asc
      return Array.from(array).sort((item1: any, item2: any) => {
        return this.orderByComparator(item2[orderBy], item1[orderBy]);
      });
    }
  }

  orderByComparator(a: any, b: any): number {
    if ((isNaN(parseFloat(a)) || !isFinite(a)) || (isNaN(parseFloat(b)) || !isFinite(b))) {
      //Isn't a number so lowercase the string to properly compare
      if (a != null && b != null) {
        if (a.toLowerCase() < b.toLowerCase()) return 1;
        if (a.toLowerCase() > b.toLowerCase()) return -1;
      }
    }
    else {
      if (a != null && b != null) {
        //Parse strings as numbers to compare properly
        if (parseFloat(a) < parseFloat(b)) return 1;
        if (parseFloat(a) > parseFloat(b)) return -1;
      }
    }

    return 0; //equal each other
  }
}
@Pipe({ name: 'keys' })
export class KeysPipe implements PipeTransform {
  transform(value, args: string[]): any {
    let keys = [];
    for (let key in value) {
      keys.push(key);
    }
    return value[0].toLowerCase() + value.substr(1);
  }
}
@Pipe({ name: 'keyValue', pure: false })
export class KeyValuePipe implements PipeTransform {
  transform(input: any): any {
    let keys = [];
    for (let key in input) {
      if (input.hasOwnProperty(key)) {
        keys.push({ key: key, value: input[key] });
      }
    }
    return keys;
  }
}
@Pipe({ name: 'timeFormat' })
export class TimeFormat implements PipeTransform {
  transform(time: any): any {
    let hour = (time.split(':'))[0]
    let min = (time.split(':'))[1]
    return `${hour}:${min}`
  }
}


@Pipe({
  name: 'number'
})
export class DecimalPipe implements PipeTransform {

  transform(val: number, arg: number): string {
    // Format the output to display any way you want here.
    // For instance:
    if (val !== undefined && val !== null) {
      return val.toFixed(arg);
    } else {
      return '';
    }
  }
}


@Pipe({
  name: 'truncate'
})

export class TruncatePipe implements PipeTransform {
  transform(value: string, args: string[]): string {
    if (value != null) {
      const limit = args.length > 0 ? parseInt(args[0], 10) : 20;
      const trail = args.length > 1 ? args[1] : '...';
      return value.length > limit ? value.substring(0, limit) + trail : value;
    }
  }
}


@Pipe({
  name: 'grdFilter'
})
export class GrdFilterPipe implements PipeTransform {
  transform(items: any, filter: any, defaultFilter: boolean): any {
    if (!filter) {
      return items;
    }
    if (!Array.isArray(items)) {
      return items;
    }
    if (filter && Array.isArray(items)) {
      const objParameterList: any = Object.keys(filter).map(key => ({ keyFiled: key, keyValue: filter[key] }));
      filter = {};
      objParameterList.forEach((objParameterValue, objParameterKey) => {
        if (objParameterValue.keyValue) {
          filter[objParameterValue.keyFiled] = objParameterValue.keyValue;
        }
      })
      let filterKeys = Object.keys(filter);
      if (filterKeys.length > 0) {
        if (defaultFilter) {
          return items.filter(item =>
            filterKeys.reduce((x, keyName) =>
              (x && new RegExp(filter[keyName], 'gi').test(item[keyName])) || filter[keyName] == "", true));
        }
        else {
          return items.filter(item => {
            return filterKeys.some((keyName) => {
              return new RegExp(filter[keyName], 'gi').test(item[keyName]) || filter[keyName] == "";
            });
          });
        }
      }
      else {
        return items;
      }
    }
  }
}

@Pipe({ name: 'urlFilter' })
export class UrlFilter {
  constructor(private sanitizer: DomSanitizer) { }
  transform(value: any, args?: any): any {
    if (value) {
      var urlRegex = /(\b(https?|ftp|file):\/\/[-A-Z0-9+&@#\/%?=~_|!:,.;]*[-A-Z0-9+&@#\/%=~_|])/ig;
      return value.replace(urlRegex, function (url) {
      let unmatchRegex = "http://www\.w3\.org\/(.+)|https://www\.w3\.org\/(.+)"     
        let check = url.match(unmatchRegex);
        if(check === null || check === undefined || check.length === 0){
          const idx = value.indexOf(url);
          const srcString = value.substring(idx - 8, idx - 2);
          if (!srcString.includes("src") && !srcString.includes("href")) {
            return '<a href="' + url + '" class="pointer">' + url + '</a>';
          }
          else {
            return url;
          }
        }
        else {
          return url;
        }
      })
    }
  }
}



@Pipe({
  name: 'keepHtml',
  pure: false
})
export class EscapeHTMLPipe implements PipeTransform {
  constructor(private sanitizer: DomSanitizer) { }

  transform(content) {
    if (content == false) {
      return this.sanitizer.sanitize(SecurityContext.HTML, "false");
    }

    return this.sanitizer.sanitize(SecurityContext.HTML, content);
  }
}