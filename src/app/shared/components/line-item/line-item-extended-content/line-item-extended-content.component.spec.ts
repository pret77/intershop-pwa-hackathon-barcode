import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UntypedFormGroup } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { instance, mock } from 'ts-mockito';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { BasketMockData } from 'ish-core/utils/dev/basket-mock-data';
import { FormlyTestingModule } from 'ish-shared/formly/dev/testing/formly-testing.module';

import { LineItemExtendedContentComponent } from './line-item-extended-content.component';

describe('Line Item Extended Content Component', () => {
  let component: LineItemExtendedContentComponent;
  let fixture: ComponentFixture<LineItemExtendedContentComponent>;
  let element: HTMLElement;
  let checkoutFacade: CheckoutFacade;

  async function prepareTestbed() {
    checkoutFacade = mock(CheckoutFacade);

    await TestBed.configureTestingModule({
      imports: [FormlyTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      declarations: [LineItemExtendedContentComponent],
      providers: [{ provide: CheckoutFacade, useFactory: () => instance(checkoutFacade) }],
    }).compileComponents();
  }
  describe('extended line item attributes handling', () => {
    beforeEach(async () => {
      prepareTestbed();
    });

    beforeEach(() => {
      fixture = TestBed.createComponent(LineItemExtendedContentComponent);
      component = fixture.componentInstance;
      element = fixture.nativeElement;

      component.extendedAttributesForm = new UntypedFormGroup({});
      component.lineItem = BasketMockData.getBasketItem();
    });

    it('should be created', () => {
      expect(component).toBeTruthy();
      expect(element).toBeTruthy();
      expect(() => fixture.detectChanges()).not.toThrow();
    });

    it('should display all form input fields for extended line item attributes', () => {
      fixture.detectChanges();

      expect(element.innerHTML).toContain(component.lineItem.partialOrderNo);
      expect(element.innerHTML).toContain(component.lineItem.customerProductID);
    });
  });
});
