import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { FormlyFieldConfig } from '@ngx-formly/core';

import { CheckoutFacade } from 'ish-core/facades/checkout.facade';
import { LineItemView } from 'ish-core/models/line-item/line-item.model';
import { OrderLineItem } from 'ish-core/models/order/order.model';

/**
 * The Extended Line Item Component displays additional line items attributes like partialOrderNo
 * and customerProductID. ALso editing of this attributes are possible with this component.
 */
@Component({
  selector: 'ish-line-item-extended-content',
  templateUrl: './line-item-extended-content.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineItemExtendedContentComponent implements OnInit {
  @Input() lineItem: Partial<LineItemView & OrderLineItem>;
  @Input() editable = true;
  model: { partialOrderNo: string; customerProductID: string };

  forceCustomAttributeChange = false;
  fields: FormlyFieldConfig[];
  extendedAttributesForm = new FormGroup({});

  constructor(private checkoutFacade: CheckoutFacade) {}

  ngOnInit() {
    this.fields = this.getFields();
    this.model = {
      partialOrderNo: this.lineItem.partialOrderNo ? this.lineItem.partialOrderNo : '',
      customerProductID: this.lineItem.customerProductID ? this.lineItem.customerProductID : '',
    };
  }

  private getFields() {
    return [
      {
        key: 'partialOrderNo',
        type: 'ish-text-input-field',
        props: {
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          label: 'line-item.partialOrderNo.label',
        },
      },
      {
        key: 'customerProductID',
        type: 'ish-text-input-field',
        props: {
          labelClass: 'col-md-4',
          fieldClass: 'col-md-8',
          label: 'line-item.customerProductID.label',
        },
      },
    ];
  }

  displayInputFields() {
    return (
      (this.lineItem.partialOrderNo === undefined && this.lineItem.customerProductID === undefined) ||
      this.forceCustomAttributeChange
    );
  }

  requestChangeableFields() {
    this.forceCustomAttributeChange = true;
  }

  onSubmit() {
    this.checkoutFacade.updateBasketItem({
      itemId: this.lineItem.id,
      quantity: this.lineItem.quantity.value,
      customerProductID: this.model.customerProductID,
      partialOrderNo: this.model.partialOrderNo,
    });
    this.forceCustomAttributeChange = false;
  }

  closeForm() {
    this.forceCustomAttributeChange = false;
  }

  cancelDisabled() {
    return this.lineItem.partialOrderNo === undefined && this.lineItem.customerProductID === undefined;
  }
}
