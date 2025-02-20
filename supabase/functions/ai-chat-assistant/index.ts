
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Format menu items for better display
    const formattedMenu = menuItems.reduce((acc, item) => {
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
        reply = `Thank you! I've noted your table number as ${detectedTableNumber}. Would you like to see our menu? I can show you our specialties and help you place an order.`;
      }
    } else {
      // Prepare a detailed system message for better context
      const systemMessage = `You are a professional AI assistant for ${restaurantName}. Your role is to provide excellent customer service:

1. Menu Presentation:
   - When showing the menu, organize items by category
   - Highlight vegetarian options
   - Always mention if items are out of stock
   - Show both half and full portion prices when available

2. Order Management:
   - Keep track of all ordered items throughout the conversation
   - For each order, confirm: item name, quantity, and size (half/full)
   - Maintain a running total of the order

3. Key Behaviors:
   - Be professional, courteous, and concise
   - If no table number is provided, politely ask for it
   - Proactively offer menu recommendations
   - For order confirmations, always list all items ordered with their details

Current Context:
- Restaurant: ${restaurantName}
- Table Number: ${tableNumber || 'Not provided'}
- Menu Categories: ${Object.keys(formattedMenu).join(', ')}
- Current Order Items: ${JSON.stringify(orderItems)}`;

      // Special handling for menu display request
      if (message.toLowerCase().includes('menu') || message.toLowerCase().includes('what do you have')) {
        const menuText = Object.entries(formattedMenu)
          .map(([category, items]) => {
            const itemsList = items.map((item: any) => {
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

        reply = `Here's our menu:${menuText}\n\n🟢 = Vegetarian | 🔴 = Non-vegetarian\nWhat would you like to order?`;
      } else {
        // Regular conversation handling
        const response = await fetch('https://api.openai.com/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            model: 'gpt-4o-mini',
            messages: [
              { role: 'system', content: systemMessage },
              ...chatHistory,
              { role: 'user', content: message }
            ],
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
