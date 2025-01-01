import { OrderItem } from "@/types/menu";

interface KOTTemplateProps {
  orderItems: OrderItem[];
  tableNumber: number;
  orderTime: string;
}

export const KOTTemplate = ({ orderItems, tableNumber, orderTime }: KOTTemplateProps) => {
  const template = `
    <div style="font-family: monospace; padding: 20px;">
      <h2 style="text-align: center;">KITCHEN ORDER TICKET</h2>
      <div style="margin: 10px 0;">
        <p>Table: ${tableNumber}</p>
        <p>Time: ${new Date(orderTime).toLocaleString()}</p>
      </div>
      <div style="border-top: 1px dashed #000; border-bottom: 1px dashed #000; padding: 10px 0;">
        ${orderItems.map(item => `
          <div style="margin: 5px 0;">
            ${item.quantity}x ${item.menu_item.name} (${item.size})
          </div>
        `).join('')}
      </div>
    </div>
  `;

  return template;
};