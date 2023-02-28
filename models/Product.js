import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      defaul: 0,
      required: true,
    },
    rating: {
      type: Number,
      default: 0,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
    sizes: {
      type: Array,
      default: [],
    },
    colors: {
      type: Array,
      default: [],
    },
    productUrl: String,
  },
  {
    timestamps: true,
  },
);

export default mongoose.model('Product', ProductSchema);
