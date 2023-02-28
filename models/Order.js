import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema(
  {
    products: {
      type: Array,
      required: true,
    },
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    totalPrice: Number,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Order', OrderSchema);
