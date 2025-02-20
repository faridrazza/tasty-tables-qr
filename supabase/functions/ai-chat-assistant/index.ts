
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { message, tableNumber, restaurantName, menuItems, orderItems, chatHistory } = await req.json();

    // Initialize response variables
    let reply = "";
    let detectedTableNumber = null;
    let updatedOrderItems = [...(orderItems || [])];
    let createOrder = false;

    // Check if we need to get table number
    if (!tableNumber && /\d+/.test(message)) {
      const numbers = message.match(/\d+/);
      if (numbers) {
        detectedTableNumber = numbers[0];
        reply = `Great! You're at table ${detectedTableNumber}. How can I help you today? Would you like to see our menu?`;
      }
    } else {
      // Prepare the system message with restaurant context
      const systemMessage = `You are an AI assistant for ${restaurantName}. You have access to the full menu and can take orders.
        - Always maintain context of previous orders in the conversation
        - If items are out of stock, inform the customer
        - For new customers, ask for their table number if not provided
        - Keep track of all ordered items throughout the conversation
        - When confirming orders, list all items ordered so far
        - The menu items are: ${JSON.stringify(menuItems)}
        - Current order items are: ${JSON.stringify(orderItems)}`;

      const response = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${Deno.env.get("OPENAI_API_KEY")}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o-mini",
          messages: [
            { role: "system", content: systemMessage },
            ...chatHistory,
            { role: "user", content: message }
          ],
        }),
      });

      const data = await response.json();
      reply = data.choices[0].message.content;

      // Check if this is an order confirmation
      if (reply.toLowerCase().includes("confirm") && reply.toLowerCase().includes("order")) {
        createOrder = true;
      }
    }

    return new Response(
      JSON.stringify({
        reply,
        tableNumber: detectedTableNumber,
        orderItems: updatedOrderItems,
        createOrder
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error) {
    console.error('Error:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
