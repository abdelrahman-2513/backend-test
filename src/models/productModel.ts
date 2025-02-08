import mongoose, { Schema, Document } from "mongoose";

export interface IProduct extends Document {
    name: string;
    category: string;
    price: number;
    quantity: number;
    isDeleted: boolean;
    createdAt: Date;
    updatedAt: Date;
}
const ProductSchema: Schema = new Schema<IProduct>({
    name: { type: String, required: true,index: true },
    category: { type: String, default: "",index: true },
    price: { type: Number, required: true, min: 0 ,index: true},
    quantity: { type: Number, required: true, min: 0 },
    isDeleted: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
});


ProductSchema.pre("save", function (next) {
    this.updatedAt = new Date();
    next();
});

const ProductModel = mongoose.model<IProduct>("Product", ProductSchema);


export default ProductModel;
