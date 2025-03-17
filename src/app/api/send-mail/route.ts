import { NextResponse } from 'next/server';
import nodemailer, { TransportOptions } from 'nodemailer';
import prismadb from "@/lib/prisma";

const getOrderDetails = async (orderId: string) => {
  try {
    const order = await prismadb.order.findUnique({
      where: { id: orderId },
      include: {
        products: {
          include: {
            product: true, // Include thông tin từ Product
          },
        },
      },
    });

    if (!order) {
      throw new Error('Order not found');
    }
    // Lấy email từ UserInfo
    const userInfo = await prismadb.userInfo.findUnique({
      where: { id: order.userInfoid },
      select: { email: true },
    });

    if (!userInfo) {
      throw new Error('User not found');
    }
    return {
      orderId: order.id,
      customerEmail: userInfo.email,
      items: order.products.map((orderProduct) => ({
        name: orderProduct.product.productNameTranslated, // Giả sử Product có trường này
        quantity: order.amount || 1,       // Giả sử Product có amount, nếu không thì cần thêm vào schema
        price: orderProduct.product.priceAmount,          // Giả sử Product có priceAmount
      })),
      total: order.products.reduce(
        (total, orderProduct) => total + (orderProduct.product.priceAmount || 0),
        0
      ),
      date: new Date(order.createdAt).toLocaleDateString(),
    };
  } catch (error) {
    console.error('Error fetching order details:', error);
    throw error;
  }
};

// const transporter = nodemailer.createTransport({
//   host: process.env.MAILTRAP_HOST,
//   port: process.env.MAILTRAP_PORT,
//   auth: {
//     user: process.env.MAILTRAP_USER,
//     pass: process.env.MAILTRAP_PASS,
//   },
// } as TransportOptions);
// Looking to send emails in production? Check out our Email API/SMTP product!
var transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  auth: {
    user: "quylunbino@gmail.com",
    pass: "vwmdpupqlxwizszc"
  }
});

export async function POST(request: Request) {
  try {
  const {orderId} = await request.json();
  // const body = await request.json()
  // Cấu hình email
  // const mailOptions = {
  //   from: '"Suburbia" <no-reply@demomailtrap.com>',
  //   to: 'tunm17421@gmail.com',
  //   subject: `${body.subject}`,
  //   text: `${body.text}`,
  // };

  // Kiểm tra orderId
  if (!orderId || typeof orderId !== 'string') {
    return NextResponse.json({ error: 'Invalid or missing orderId' }, { status: 400 });
  }

  
// Lấy thông tin đơn hàng
  const order = await getOrderDetails(orderId);

  console.log(order + "order Info");
  const mailOptions = {
    from: '"Suburbia" <no-reply@demomailtrap.com>',
    to: order.customerEmail,
    subject: `Invoice for your order`,
    html: `
     <h2>Invoice #${orderId.slice(-4)}</h2>
      <p>Thank you for your purchase!</p>
      <p>Date: ${order.date}</p>
      <h3>Order Details:</h3>
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid #ddd; padding: 8px;">Item</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Quantity</th>
            <th style="border: 1px solid #ddd; padding: 8px;">Price</th>
          </tr>
        </thead>
        <tbody>
          ${order.items
            .map(
              (item: { name: any; quantity: any; price: any; }) => `
            <tr>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.name}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.quantity}</td>
              <td style="border: 1px solid #ddd; padding: 8px;">${item.price} VND</td>
            </tr>`
            )
            .join('')}
        </tbody>
      </table>
      <h3>Total: ${order.total} VND</h3>
      <p>We appreciate your business!</p>
    `,
  };

 
    const info = await transporter.sendMail(mailOptions);
    return NextResponse.json({ message: 'Email sent successfully', info }, { status: 200 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Error sending email + ${error}' }, { status: 500 });
  }
}
