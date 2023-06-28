import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { SuggestTerm } from 'ish-core/models/suggest-term/suggest-term.model';
import { SparqueApiService } from 'ish-core/services/sparque/sparque-api/sparque-api.service';
import { SuggestService } from 'ish-core/services/suggest/suggest.service';
//import { log } from 'ish-core/utils/dev/operators';

@Injectable({ providedIn: 'root' })
export class SparqueSuggestService extends SuggestService {
  private sparqueApiService = inject(SparqueApiService);

  search(searchTerm: string): Observable<SuggestTerm[]> {
    console.log(searchTerm);
    return this.sparqueApiService.get(`e/keywordsuggest/p/keyword/${searchTerm}/results`).pipe(
      //log('result'),
      map((object: any) => object.items.map((item: any) => ({ term: item.tuple[0] })))
    );
  }
}