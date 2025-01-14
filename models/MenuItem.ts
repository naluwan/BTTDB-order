import mongoose from 'mongoose';

const MenuItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Category',
      required: true,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  },
);

MenuItemSchema.set('timestamps', true);

export default mongoose.models.MenuItem || mongoose.model('MenuItem', MenuItemSchema);
