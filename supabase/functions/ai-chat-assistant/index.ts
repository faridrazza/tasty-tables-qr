
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface MenuItem {
  id: string;
  name: string;
  category: string;
  halfPrice: number | null;
  fullPrice: number;
  isVegetarian: boolean;
  outOfStock: boolean;
}

interface Message {
  role: string;
  content: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, tableNumber, restaurantName, menuItems, orderItems, chatHistory } = await req.json();

    let reply = "";
    let detectedTableNumber = null;
    let updatedOrderItems = [...(orderItems || [])];
    let createOrder = false;

    // Format menu items by category
    const formattedMenu = menuItems.reduce((acc: Record<string, MenuItem[]>, item: MenuItem) => {
      const category = item.category || 'Other';
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(item);
      return acc;
    }, {});

    // Handle table number detection
    if (!tableNumber && /\d+/.test(message)) {
      const numbers = message.match(/\d+/);
      if (numbers) {
        detectedTableNumber = numbers[0];
        reply = `Thank you! I've noted your table number as ${detectedTableNumber}. Would you like to see our menu? I can help you explore our specialties and place your order.`;
      }
    } else {
      // Handle menu display request
      if (message.toLowerCase().includes('menu') || message.toLowerCase().includes('what do you have')) {
        const menuText = Object.entries(formattedMenu)
          .map(([category, items]) => {
            const itemsList = items.map((item: MenuItem) => {
              const prices = [];
              if (item.halfPrice) prices.push(`Half: ₹${item.halfPrice}`);
              prices.push(`Full: ₹${item.fullPrice}`);
              const status = item.outOfStock ? ' (Out of Stock)' : '';
              const veg = item.isVegetarian ? ' 🟢' : ' 🔴';
              return `   • ${item.name}${veg} - ${prices.join(' | ')}${status}`;
            }).join('\n');
            return `\n${category}:\n${itemsList}`;
          })
          .join('\n');

        reply = `Here's our menu:${menuText}\n\n🟢 = Vegetarian | 🔴 = Non-vegetarian\n\nWhat would you like to order? I can help you with our specialties or popular dishes if you'd like recommendations.`;
      } else {
        // Prepare system message for better context
        const systemMessage = `You are a professional restaurant AI assistant for ${restaurantName}. Your role is to:

1. Menu & Ordering:
   - Keep track of ordered items and quantities
   - Confirm each order item with size (half/full) and quantity
   - Calculate and show total bill when requested
   - Highlight vegetarian options when recommending dishes

2. Key Behaviors:
   - Be courteous and professional
   - Ask for table number if not provided
   - Make relevant menu recommendations
   - Keep responses concise and clear

Current Context:
- Restaurant: ${restaurantName}
- Table: ${tableNumber || 'Not provided'}
- Categories: ${Object.keys(formattedMenu).join(', ')}
- Current Order: ${JSON.stringify(orderItems)}`;

        // Get AI response
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4',
            messages: [
              { role: 'system', content: systemMessage },
              ...chatHistory.map((msg: Message) => ({
                role: msg.role,
                content: msg.content
              })),
              { role: 'user', content: message }
            ],
            temperature: 0.7,
          }),
        });

        const data = await response.json();
        reply = data.choices[0].message.content;

        // Check for order confirmation
        if (reply.toLowerCase().includes('confirm') && reply.toLowerCase().includes('order')) {
          createOrder = true;
        }
      }
    }

    return new Response(
      JSON.stringify({
        reply,
        tableNumber: detectedTableNumber,
        orderItems: updatedOrderItems,
        createOrder
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
