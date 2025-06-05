import { useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { InvoiceItem } from '../../types';
import { formatCurrency } from '../../utils/formatters';
import { nanoid } from 'nanoid';

interface InvoiceItemsListProps {
  items: InvoiceItem[];
  onChange: (items: InvoiceItem[]) => void;
  vatRates?: number[];
}

const defaultVatRates = [0, 5.5, 10, 20];

const InvoiceItemsList = ({ 
  items, 
  onChange,
  vatRates = defaultVatRates
}: InvoiceItemsListProps) => {
  const handleAddItem = () => {
    const newItem: InvoiceItem = {
      id: nanoid(),
      description: '',
      quantity: 1,
      unitPrice: 0,
      vatRate: 20, // Default VAT rate
      total: 0,
    };
    onChange([...items, newItem]);
  };
  
  const handleRemoveItem = (id: string) => {
    onChange(items.filter((item) => item.id !== id));
  };
  
  const handleItemChange = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value };
        
        // Recalculate total if quantity or unit price changes
        if (field === 'quantity' || field === 'unitPrice') {
          updatedItem.total = updatedItem.quantity * updatedItem.unitPrice;
        }
        
        return updatedItem;
      }
      return item;
    });
    
    onChange(updatedItems);
  };
  
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-medium text-gray-900">Invoice Items</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full divide-y divide-gray-200">
          <thead>
            <tr>
              <th className="px-3 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500">
                Description
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-20">
                Qty
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-32">
                Unit Price
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-24">
                VAT (%)
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500 w-32">
                Total
              </th>
              <th className="px-3 py-3 text-right text-xs font-medium w-10"></th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-gray-200">
            {items.map((item) => (
              <tr key={item.id}>
                <td className="px-3 py-2">
                  <input
                    type="text"
                    className="form-input block w-full"
                    value={item.description}
                    onChange={(e) => handleItemChange(item.id, 'description', e.target.value)}
                    placeholder="Item description"
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="form-input block w-full text-right"
                    value={item.quantity}
                    min="1"
                    step="1"
                    onChange={(e) => handleItemChange(item.id, 'quantity', parseInt(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2">
                  <input
                    type="number"
                    className="form-input block w-full text-right"
                    value={item.unitPrice}
                    min="0"
                    step="0.01"
                    onChange={(e) => handleItemChange(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                  />
                </td>
                <td className="px-3 py-2">
                  <select
                    className="form-select block w-full text-right"
                    value={item.vatRate}
                    onChange={(e) => handleItemChange(item.id, 'vatRate', parseFloat(e.target.value))}
                  >
                    {vatRates.map((rate) => (
                      <option key={rate} value={rate}>
                        {rate}%
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-3 py-2 text-right font-medium">
                  {formatCurrency(item.total)}
                </td>
                <td className="px-3 py-2 text-right">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-red-600"
                    onClick={() => handleRemoveItem(item.id)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
            
            {items.length === 0 && (
              <tr>
                <td colSpan={6} className="px-3 py-4 text-center text-sm text-gray-500">
                  No items added yet. Click "Add Item" to begin.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div>
        <button
          type="button"
          className="btn btn-secondary"
          onClick={handleAddItem}
        >
          <Plus className="mr-1 h-4 w-4" />
          Add Item
        </button>
      </div>
      
      {items.length > 0 && (
        <div className="mt-4 border-t pt-4">
          <div className="flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">Subtotal:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(items.reduce((sum, item) => sum + item.total, 0))}
                </span>
              </div>
              
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-500">VAT:</span>
                <span className="text-sm font-medium">
                  {formatCurrency(
                    items.reduce((sum, item) => sum + item.total * (item.vatRate / 100), 0)
                  )}
                </span>
              </div>
              
              <div className="border-t pt-2 flex items-center justify-between">
                <span className="text-base font-medium">Total:</span>
                <span className="text-base font-bold">
                  {formatCurrency(
                    items.reduce(
                      (sum, item) => sum + item.total * (1 + item.vatRate / 100),
                      0
                    )
                  )}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default InvoiceItemsList;