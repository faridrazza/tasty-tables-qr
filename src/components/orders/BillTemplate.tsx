import { OrderItem } from "@/types/menu";
import { formatCurrency } from "@/utils/printUtils";

interface BillTemplateProps {
  orderItems: OrderItem[];
  tableNumber: number;
  orderTime: string;
  gstSettings?: {
    restaurant_name?: string;
    address?: string;
    gst_number?: string;
    gst_rate?: number;
  };
  subtotal: number;
}

export const BillTemplate = ({ orderItems, tableNumber, orderTime, gstSettings, subtotal }: BillTemplateProps) => {
  const gstAmount = gstSettings?.gst_rate ? (subtotal * gstSettings.gst_rate) / 100 : 0;
  const total = subtotal + gstAmount;

  const template = `
    <div style="font-family: Arial, sans-serif; padding: 20px; max-width: 400px; margin: 0 auto;">
      ${gstSettings?.restaurant_name ? `<h2 style="text-align: center;">${gstSettings.restaurant_name}</h2>` : ''}
      ${gstSettings?.address ? `<p style="text-align: center;">${gstSettings.address}</p>` : ''}
      ${gstSettings?.gst_number ? `<p style="text-align: center;">GST No: ${gstSettings.gst_number}</p>` : ''}
      
      <div style="margin: 20px 0; border-top: 1px solid #000; border-bottom: 1px solid #000; padding: 10px 0;">
        <p>Table: ${tableNumber}</p>
        <p>Date: ${new Date(orderTime).toLocaleString()}</p>
      </div>

      <table style="width: 100%; border-collapse: collapse;">
        <tr style="border-bottom: 1px solid #000;">
          <th style="text-align: left;">Item</th>
          <th style="text-align: right;">Amount</th>
        </tr>
        ${orderItems.map(item => {
          const price = item.size === 'full' ? item.menu_item.full_price : item.menu_item.half_price;
          const itemTotal = (price || 0) * item.quantity;
          return `
            <tr>
              <td>${item.quantity}x ${item.menu_item.name} (${item.size})</td>
              <td style="text-align: right;">${formatCurrency(itemTotal)}</td>
            </tr>
          `;
        }).join('')}
      </table>

      <div style="margin-top: 20px; border-top: 1px solid #000;">
        <p style="display: flex; justify-content: space-between;">
          <span>Subtotal:</span>
          <span>${formatCurrency(subtotal)}</span>
        </p>
        ${gstSettings?.gst_rate ? `
          <p style="display: flex; justify-content: space-between;">
            <span>GST (${gstSettings.gst_rate}%):</span>
            <span>${formatCurrency(gstAmount)}</span>
          </p>
        ` : ''}
        <p style="display: flex; justify-content: space-between; font-weight: bold;">
          <span>Total:</span>
          <span>${formatCurrency(total)}</span>
        </p>
      </div>

      <p style="text-align: center; margin-top: 20px;">Thank you for dining with us!</p>
    </div>
  `;

  return template;
};