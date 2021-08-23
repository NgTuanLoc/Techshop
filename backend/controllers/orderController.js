import asyncHandler from "express-async-handler";
import Order from "../models/orderModel.js";

// @DESC Create New Order
// @ROUTE api/orders
// @ACCESS Private

const addOrderItems = asyncHandler(async (req, res) => {
  const {
    orderItems,
    shippingAddress,
    paymentMethod,
    itemsPrice,
    shippingPrice,
    tax,
    totalPrice,
  } = req.body;

  if (orderItems && orderItems.length === 0) {
    res.status(400);
    throw new Error("No Order Items");
  } else {
    const order = new Order({
      orderItems,
      user: req.user._id,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      tax,
      totalPrice,
    });
    const createdOrder = await order.save();
    res.status(200).json(createdOrder);
  }
});

// @DESC Get Order By ID
// @ROUTE api/orders/:id
// @ACCESS Private
const getOrderByID = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate(
      "user",
      "name email"
    );

    if (order) {
      res.json(order);
    } else {
      res.status(404);
      throw new Error("Order Not Found !");
    }
  } catch (error) {
    res.status(404);
    throw new Error("Order Not Found !");
  }
});

// @DESC Update Order To Paid
// @ROUTE api/orders/:id
// @ACCESS Private
const updateOrderToPaid = asyncHandler(async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (order) {
      order.isPaid = true;
      order.paidAt = Date.now();
      order.paymentResult = {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.payer.email_address,
      };
    }
    const updatedOrder = await order.save();
    res.status(200);
    res.json(updatedOrder);
  } catch (error) {
    res.status(404);
    throw new Error("Order Not Found !");
  }
});

// @DESC Get Logged in user orders
// @ROURW GET /api/orders/userorders
// @ACCESS Private
const getUserOrders = asyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.json(orders);
});

export { addOrderItems, getOrderByID, updateOrderToPaid, getUserOrders };