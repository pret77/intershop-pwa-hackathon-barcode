import { Dictionary } from '@ngrx/entity';
import { createSelector, createSelectorFactory, resultMemoize } from '@ngrx/store';
import { isEqual } from 'lodash-es';

import { ContentPagelet } from 'ish-core/models/content-pagelet/content-pagelet.model';
import { createContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { getContentState } from 'ish-core/store/content/content-store';
import { selectRouteParam } from 'ish-core/store/core/router';

import { pageletsAdapter } from './pagelets.reducer';

const getPageletsState = createSelector(getContentState, state => state.pagelets);

export const { selectEntities: getContentPageletEntities } = pageletsAdapter.getSelectors(getPageletsState);

const getContentPageletMemoized = (pageletId: string) =>
  createSelectorFactory<object, ContentPagelet>(projector => resultMemoize(projector, isEqual))(
    getContentPageletEntities,
    (entities: Dictionary<ContentPagelet>) => entities[pageletId]
  );

export const getContentPagelet = (pageletId: string) =>
  createSelector(getContentPageletMemoized(pageletId), createContentPageletView);

export const getSelectedPagelet = createSelector(
  getContentPageletEntities,
  selectRouteParam('pageletId'),
  (pagelets, id) => createContentPageletView(pagelets[id])
);

export const getPageletLoading = createSelector(getPageletsState, state => state.loading);

export const getPageletError = createSelector(getPageletsState, state => state.error);
