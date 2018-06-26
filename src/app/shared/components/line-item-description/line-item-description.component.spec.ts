import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { PopoverModule } from 'ngx-bootstrap/popover';
import { BasketMockData } from '../../../utils/dev/basket-mock-data';
import { MockComponent } from '../../../utils/dev/mock.component';
import { PipesModule } from '../../pipes.module';
import { LineItemDescriptionComponent } from './line-item-description.component';

describe('Line Item Description Component', () => {
  let component: LineItemDescriptionComponent;
  let fixture: ComponentFixture<LineItemDescriptionComponent>;
  let element: HTMLElement;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), PopoverModule.forRoot(), PipesModule],
      declarations: [
        LineItemDescriptionComponent,
        MockComponent({
          selector: 'ish-product-shipment',
          template: 'Product Shipment Component',
          inputs: ['product'],
        }),
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LineItemDescriptionComponent);
    component = fixture.componentInstance;
    element = fixture.nativeElement;
    component.pli = BasketMockData.getBasketItem();
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
    expect(element).toBeTruthy();
    expect(() => fixture.detectChanges()).not.toThrow();
  });

  it('should display sku for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-id').textContent).toContain('4713');
  });

  it('should display in stock for the line item', () => {
    fixture.detectChanges();
    expect(element.querySelector('.product-in-stock')).toBeTruthy();
  });

  it('should hold itemSurcharges for the line item', () => {
    component.ngOnChanges();
    expect(component.itemSurcharges.length).toBe(1);
  });
});
