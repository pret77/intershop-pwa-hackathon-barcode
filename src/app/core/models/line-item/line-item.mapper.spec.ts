import { OrderItemData } from '../order-item/order-item.interface';

import { LineItemData } from './line-item.interface';
import { LineItemMapper } from './line-item.mapper';

describe('Line Item Mapper', () => {
  describe('fromData', () => {
    it(`should return BasketItem when getting LineItemData`, () => {
      const lineItemData = {
        id: 'lineItemId',
        product: 'sku_123',
        quantity: {
          value: 3,
        },
      } as LineItemData;
      const lineItem = LineItemMapper.fromData(lineItemData);

      expect(lineItem).toBeTruthy();
      expect(lineItem.productSKU).toBe(lineItemData.product);
      expect(lineItem.quantity.value).toBe(3);
    });

    it(`should throw an error when getting no LineItemData`, () => {
      expect(() => LineItemMapper.fromData(undefined)).toThrow();
    });
  });

  describe('fromOrderItemData', () => {
    it(`should return BasketItem when getting OrderItemData with a product.sku reference`, () => {
      const orderItemData = {
        id: 'orderItemId',
        product: {
          type: 'Link',
          description: 'Product Name',
          title: 'SKU',
          uri: 'some-shop/products/SKU',
        },
        quantity: {
          value: 3,
        },
      } as OrderItemData;
      const basketItem = LineItemMapper.fromOrderItemData(orderItemData);

      expect(basketItem).toBeTruthy();
      expect(basketItem.productSKU).toBe(orderItemData.product.title);
      expect(basketItem.quantity.value).toBe(3);
    });

    it(`should throw an error when getting no OrderItemData`, () => {
      expect(() => LineItemMapper.fromOrderItemData(undefined)).toThrow();
    });
  });
});
