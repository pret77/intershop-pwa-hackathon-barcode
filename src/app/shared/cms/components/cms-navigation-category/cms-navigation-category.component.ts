import { ChangeDetectionStrategy, Component, Input, OnChanges } from '@angular/core';
import { Observable } from 'rxjs';

import { ShoppingFacade } from 'ish-core/facades/shopping.facade';
import { ContentPageletView } from 'ish-core/models/content-view/content-view.model';
import { NavigationCategory } from 'ish-core/models/navigation-category/navigation-category.model';
import { CMSComponent } from 'ish-shared/cms/models/cms-component/cms-component.model';

@Component({
  selector: 'ish-cms-navigation-category',
  templateUrl: './cms-navigation-category.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CMSNavigationCategoryComponent implements CMSComponent, OnChanges {
  @Input() pagelet: ContentPageletView;

  category$: Observable<NavigationCategory>;

  constructor(private shoppingFacade: ShoppingFacade) {}

  ngOnChanges(): void {
    if (this.pagelet?.hasParam('NavigationCategory')) {
      this.category$ = this.shoppingFacade.navigationCategory$(
        this.pagelet.stringParam('NavigationCategory'),
        this.pagelet.numberParam('SubNavigationDepth')
      );
    }
  }

  showSubMenu() {
    return this.pagelet?.hasParam('SubNavigationDepth') && this.pagelet.numberParam('SubNavigationDepth') === 0
      ? false
      : true;
  }

  subMenuShow(subMenu: HTMLElement) {
    subMenu.classList.add('hover');
  }
  subMenuHide(subMenu: HTMLElement) {
    subMenu.classList.remove('hover');
  }
}
