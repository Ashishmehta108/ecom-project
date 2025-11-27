export function orderConfirmationTemplate({
    customerName,
    orderId,
    orderDate,
    total,
    items,
  }: {
    customerName: string;
    orderId: string;
    orderDate: string;
    total: string;
    items: {
      title: string;
      quantity: number;
      price: string;
      image?: string;
    }[];
  }) {
    return `
    <div style="font-family: Arial, sans-serif; background:#f6f9fc; padding:40px;">
      <div style="max-width:600px; margin:0 auto; background:#ffffff; border-radius:10px; overflow:hidden;">
        
        <!-- Header -->
        <div style="background:#111827; padding:24px; text-align:center; color:#ffffff;">
    <img 
      src="${process.env.NEXT_PUBLIC_APP_URL}/logo.png"
      alt="Techbar Store Logo"
      width="160"
      style="margin-bottom:10px; border-radius:8px;" 
    />
    <h1 style="margin:0; font-size:22px;">🛒 Order Confirmed!</h1>
  </div>
        <!-- Body -->
        <div style="padding:30px;">
          <p style="font-size:16px; color:#333;">Hi <strong>${customerName}</strong>,</p>
          <p style="font-size:15px; color:#555;">
            Thank you for shopping with <strong>Techbar Store</strong>!  
            Your order has been successfully placed and is now being processed.
          </p>
  
          <!-- Order Summary Box -->
          <div style="margin-top:20px; padding:20px; background:#f9fafb; border-radius:8px;">
            <p style="margin:5px 0; font-size:15px;"><strong>Order ID:</strong> ${orderId}</p>
            <p style="margin:5px 0; font-size:15px;"><strong>Order Date:</strong> ${orderDate}</p>
            <p style="margin:5px 0; font-size:15px;"><strong>Total Amount:</strong> ₹${total}</p>
          </div>
  
          <!-- Items -->
          <h3 style="margin-top:30px; color:#111;">Order Items</h3>
          ${items
            .map(
              (item) => `
            <div style="display:flex; gap:14px; margin-bottom:18px; padding-bottom:14px; border-bottom:1px solid #eee;">
              <img src="${item.image ?? "https://dummyimage.com/80"}" width="80" height="80" style="border-radius:6px; object-fit:cover;" />
              <div>
                <p style="margin:0; font-size:15px;"><strong>${item.title}</strong></p>
                <p style="margin:4px 0; color:#555;">Qty: ${item.quantity}</p>
                <p style="margin:4px 0; color:#111;"><strong>₹${item.price}</strong></p>
              </div>
            </div>
          `
            )
            .join("")}
  
          <!-- Footer -->
          <p style="margin-top:30px; font-size:14px; color:#555;">
            We'll notify you once your order is shipped.
          </p>
          <p style="font-size:13px; color:#777;">Thank you for choosing Techbar Store 🚀</p>
  
        </div>
  
        <div style="background:#111827; padding:16px; text-align:center; color:#888; font-size:12px;">
          © ${new Date().getFullYear()} Techbar Store. All rights reserved.
        </div>
      </div>
    </div>
    `;
  }
  