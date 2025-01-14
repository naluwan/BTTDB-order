import mongoose from 'mongoose';

const CategorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    unique: true,
  },
});
CategorySchema.set('timestamps', true);

// 添加虛擬字段 (virtual field)，關聯到 MenuItem
CategorySchema.virtual('menuItems', {
  ref: 'MenuItem', // 關聯的模型名稱
  localField: '_id', // Category 的 `_id` 作為外鍵
  foreignField: 'category', // MenuItem 的 `category` 字段
});

// 確保虛擬字段出現在 JSON 和 Object 輸出中
CategorySchema.set('toObject', { virtuals: true });
CategorySchema.set('toJSON', { virtuals: true });

export default mongoose.models.Category || mongoose.model('Category', CategorySchema);
