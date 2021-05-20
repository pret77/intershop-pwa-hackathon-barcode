import { createFeatureSelector } from '@ngrx/store';

import { BuyingContextState } from './buying-context/buying-context.reducer';
import { GroupState } from './group/group.reducer';

export interface OrganizationHierarchiesState {
  group: GroupState;
  buyingContext: BuyingContextState;
}

export const getOrganizationHierarchiesState = createFeatureSelector<OrganizationHierarchiesState>(
  'organizationHierarchies'
);
