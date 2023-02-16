import { LineItemUpdateHelper } from './line-item-update.helper';
import { LineItemUpdate } from './line-item-update.model';

describe('Line Item Update Helper', () => {
  describe('filterUpdatesByItems', () => {
    it('should have deepest level navigable on tree', () => {
      const updates = [
        // should update because quantity
        {
          itemId: 'testItemId',
          quantity: 2,
          sku: 'SKU',
        },
        // should update because sku
        {
          itemId: 'testItemId',
          quantity: 1,
          sku: 'SKU2',
        },
        // should not update because same sku || quantity
        {
          itemId: 'testItemId',
          quantity: 1,
          sku: 'SKU',
        },
      ];

      const items = [
        {
          id: 'testItemId',
          productSKU: 'SKU',
          quantity: {
            value: 1,
          },
        },
      ];

      const filteredUpdates = LineItemUpdateHelper.filterUpdatesByItems(updates, items);

      expect(filteredUpdates).toEqual(updates.slice(0, 2));
      expect(filteredUpdates).not.toEqual(updates.slice(2, 1));
    });
  });

  describe('determineUpdateItemPayload', () => {
    it('should return lineItemPayload with warranty if a warranty is given', () => {
      const lineItem = {
        itemId: 'testItemId',
        sku: 'SKU',
        quantity: 1,
        warrantySku: 'war1',
      } as LineItemUpdate;
      const payload = LineItemUpdateHelper.determineUpdateItemPayload(lineItem);

      expect(payload).toMatchInlineSnapshot(`
        Object {
          "product": "SKU",
          "quantity": Object {
            "unit": undefined,
            "value": 1,
          },
          "warranty": "war1",
        }
      `);
    });

    it('should return lineItemPayload with warranty = null if an empty warranty is given', () => {
      const lineItem = {
        itemId: 'testItemId',
        sku: 'SKU',
        warrantySku: '',
      } as LineItemUpdate;

      const payload = LineItemUpdateHelper.determineUpdateItemPayload(lineItem);

      expect(payload).toMatchInlineSnapshot(`
        Object {
          "product": "SKU",
          "quantity": undefined,
          "warranty": null,
        }
      `);
    });

    it('should return no warranty if no warranty is given', () => {
      const lineItem = {
        itemId: 'testItemId',
        sku: 'SKU',
        warrantySku: undefined,
      } as LineItemUpdate;

      const payload = LineItemUpdateHelper.determineUpdateItemPayload(lineItem);
      expect(payload).toMatchInlineSnapshot(`
        Object {
          "product": "SKU",
          "quantity": undefined,
        }
      `);
    });
  });
});
