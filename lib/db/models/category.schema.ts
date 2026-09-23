import mongoose, { Schema, models, model, Document } from "mongoose";

export interface ICategory extends Document {
    user_id: mongoose.Types.ObjectId;
    name: string;
    type: "income" | "expense";
    icon: string;
    color: string;
    parent_id: mongoose.Types.ObjectId | null;
    is_system: boolean;
    createdAt: Date;
    updatedAt: Date;
}

const CategorySchema = new Schema<ICategory>({
    user_id: {type: Schema.Types.ObjectId, ref: 'User', required: true},
    name: {type: String, required: true, trim: true},
    type: {type: String, enum: ["income", "expense"], required: true},
    icon: {type: String, default: "circle"},
    color: {type: String, default: "#6366f1"},
    parent_id: {type: Schema.Types.ObjectId, ref: 'Category', default: null},
    is_system: {type: Boolean, default: false},
},
{
    timestamps: true,
    collection: 'categories'
});

CategorySchema.index({user_id: 1, type: 1});

const Category = models.Category || model<ICategory>("Category", CategorySchema);
export default Category;