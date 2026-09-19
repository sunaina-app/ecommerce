import { Injectable, NotFoundException } from '@nestjs/common';
import { newProducts } from './interfaces/products.interface';
import { ProductDto, UpdateProductDto } from './dto/products.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Products } from './schemas/products.schema';
import { Model, Types } from 'mongoose';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';

@Injectable()
export class ProductsService {

    constructor(@InjectModel(Products.name) private products: Model<Products>) { }

    async createProduct(product: ProductDto, imagepath: string[]): Promise<newProducts> {

        const newProduct = new this.products({
            name: product.name,
            quantity: product.quantity,
            price: product.price,
            variant: product.variant,
            images: imagepath,
        });

        const saveProduct = await newProduct.save();

        const productData = saveProduct.toObject();

        return {
            ...productData,
            _id: productData._id.toString(),
        };
    }

    async updateProduct(id: Types.ObjectId, updatedProductData: UpdateProductDto, imagepath: string[]): Promise<newProducts> {

        const updateData: any = {};

        Object.entries(updatedProductData).forEach(([key, value]) => {
            if (value !== undefined && value !== null && value !== '' && !(key === 'quantity' && value === 0) && !(key === 'price' && value === 0)) {
                updateData[key] = value;
            }
        });

        if (imagepath?.length) {
            updateData.images = imagepath;
        }

        const updatedProduct = await this.products.findByIdAndUpdate(
            id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const productData = updatedProduct.toObject();

        return {
            ...productData,
            _id: productData._id.toString(),
        }
    }


    async deleteOneProduct(id: Types.ObjectId): Promise<newProducts> {

        const deletedProduct = await this.products.findByIdAndDelete(id);

        if (!deletedProduct) {
            throw new NotFoundException(`Product with ID ${id} not found`);
        }

        const productData = deletedProduct.toObject();

        return {
            ...productData,
            _id: productData._id.toString(),
        }
    }

    async deleteAllProduct() {

        const result = await this.products.deleteMany({});

        return {
            deletedCount: result.deletedCount,
        };
    }

    async listAllProducts(paginationDto: PaginationQueryDto): Promise<newProducts[]> {

        const page = paginationDto.page ?? 1;
        const limit = paginationDto.limit ?? 10;

        const skip = (page - 1) * limit;

        const result = await this.products.find().skip(skip).limit(limit).exec();

        const productData = result.map(product => {
            const data = product.toObject();

            return {
                ...data,
                _id: data._id.toString(),
            };
        });

        return productData;
    }

    async findOneProduct(id: Types.ObjectId): Promise<newProducts> {
        const product = await this.products.findById(id);

        if (!product) {
            throw new NotFoundException(`Product with ${id} not found`)
        }

        const productData = product.toObject();

        return {
            ...productData,
            _id: productData._id.toString(),
        }
    }

    async findByProductIds(productIds: Types.ObjectId[]) {
        return await this.products.find({
            _id: { $in: productIds },
        })
    }

}