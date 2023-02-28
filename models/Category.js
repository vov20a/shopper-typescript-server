import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      unique: true,
    },
    //added only to child category
    categoryParent: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: false,
    },
    //added only to parent category
    nodes: {
      type: [],
      //делаем nodes несуществующим  по-умолчанию
      default: undefined,
    },
  },
  {
    timestamps: true,
  },
);
//для бездетной категории не добавляем ни nodes, ни categoryParent
export default mongoose.model('Category', CategorySchema);
