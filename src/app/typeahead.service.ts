import { Injectable } from '@angular/core';
import { Jsonp, URLSearchParams, RequestOptionsArgs } from '@angular/http';
import { SearchParams } from './models/search-params.interface';

@Injectable()
export class TypeAheadService {
  private url: string = 'http://suggestqueries.google.com/complete/search';
  private searchConfig: URLSearchParams = new URLSearchParams();
  private searchParams: SearchParams = {
    hl: 'en',
    ds: 'yt',
    xhr: 't',
    client: 'youtube',
    callback: 'JSONP_CALLBACK'
  };

  constructor(private jsonp: Jsonp) { }

  getSuggestions(query: string) {
    const searchParams = Object.assign({ q: query }, this.searchParams);
    console.log(searchParams);
    Object.keys(searchParams).forEach(param => this.searchConfig.set(param, searchParams[param]));
    const options: RequestOptionsArgs = {
      search: this.searchConfig
    };

    return this.jsonp.get(this.url, options)
      .map(response => response.json()[1])
      .map(results => results.map(result => result[0]))
      .catch(error => { throw new Error(error) });
  }
}
