import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { ProductsService } from 'src/products/products.service';
import { CartDto, DeleteCartDto } from './dto/cart.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Cart } from './schemas/cart.schema';
import { Model, Types } from 'mongoose';
import { CartData } from './interfaces/cart.interface';

@Injectable()
export class CartService {

    constructor(
        private readonly productService: ProductsService,
        @InjectModel(Cart.name) private cart: Model<Cart>
    ) { }

    async addProductQuantityCart(userId: Types.ObjectId, cartDto: CartDto): Promise<CartData> {

        const { productId, quantity } = cartDto;

        if (!(Types.ObjectId.isValid(productId))) {
            throw new BadRequestException('Invalid Product id');
        }

        const productObjectId = new Types.ObjectId(productId);

        const findProduct = await this.productService.findOneProduct(productObjectId);

        if (!findProduct) {
            throw new NotFoundException(`Product with ${productId} not found`);
        }

        const userObjectId = new Types.ObjectId(userId);
        const checkProductCart = await this.cart.findOne({ product_id: productObjectId, user_id: userObjectId });

        if (!checkProductCart) {

            const newCart = new this.cart({
                product_id: new Types.ObjectId(productId),
                name: findProduct.name,
                quantity: quantity || 1,
                price: findProduct.price * (quantity || 1),
                variant: findProduct.variant,
                product_images: findProduct.images,
                user_id: new Types.ObjectId(userId)
            });

            const saveCart = await newCart.save();

            const cartData = saveCart.toObject();

            return {
                ...cartData,
                _id: cartData._id.toString(),
                product_id: cartData.product_id.toString(),
                user_id: cartData.user_id.toString()
            }
        } else {

            const reqQuantity = quantity || 1;

            const newQuantity = checkProductCart.quantity + reqQuantity;


            if (findProduct.quantity >= newQuantity) {

                checkProductCart.quantity = newQuantity;

                checkProductCart.price = newQuantity * findProduct.price;

                const updateCartItem = await checkProductCart.save();

                const cartData = updateCartItem.toObject();

                return {
                    ...cartData,
                    _id: cartData._id.toString(),
                    product_id: cartData.product_id.toString(),
                    user_id: cartData.user_id.toString()
                }

            } else {
                const maxQtyAdd = findProduct.quantity - checkProductCart.quantity;
                if (maxQtyAdd > 0) {
                    throw new BadRequestException('`You can add maximum ${maxQtyAdd} quantity`');
                } else {
                    throw new BadRequestException(`Maximum Quantity is already added in the cart`);
                }
            }
        }
    }

    async deleteProductQuantityCart(userId: Types.ObjectId, cartDto: CartDto): Promise<CartData> {

        const { productId, quantity } = cartDto;

        if (!(Types.ObjectId.isValid(productId))) {
            throw new BadRequestException('Invalid Product id');
        }

        const productObjectId = new Types.ObjectId(productId);

        const findProduct = await this.productService.findOneProduct(productObjectId);
        if (!findProduct) {
            throw new NotFoundException(`Product with ${productId} not found`);
        }

        const userObjectId = new Types.ObjectId(userId);
        const checkProductCart = await this.cart.findOne({ product_id: productObjectId, user_id: userObjectId });
        if (!checkProductCart) {
            throw new NotFoundException(`Item or User not found in the cart`);
        } else {
            const qty = checkProductCart.quantity - (quantity || 1);
            if (qty > 0) {
                checkProductCart.quantity = qty;
                checkProductCart.price = qty * findProduct.price;

                const updateCart = await checkProductCart.save();

                const cartData = updateCart.toObject();

                return {
                    ...cartData,
                    _id: cartData._id.toString(),
                    product_id: cartData.product_id.toString(),
                    user_id: cartData.user_id.toString()
                }

            } else if (qty == 0) {

                const deleteProduct = await this.cart.findOneAndDelete({ product_id: productObjectId });

                if (!deleteProduct) {
                    throw new NotFoundException(`Product with ID ${productId} was not found in your cart`);
                }

                deleteProduct.quantity = 0;

                const cartData = deleteProduct.toObject();

                return {
                    ...cartData,
                    _id: cartData._id.toString(),
                    product_id: cartData.product_id.toString(),
                    user_id: cartData.user_id.toString()
                }
            } else {
                throw new BadRequestException(`You can delete mamimum ${checkProductCart.quantity} quantity`);
            }
        }

    }

    async fetchAllCartProduct(userId: Types.ObjectId): Promise<CartData[]> {
        const cartDetails = await this.cart.find({ user_id: userId });

        const cartData = cartDetails.map(cart => {
            const data = cart.toObject();

            return {
                ...data,
                _id: data._id.toString(),
                product_id: data.product_id.toString(),
                user_id: data.user_id.toString()
            }
        });

        return cartData;
    }

    async findInCartByProductIds(userId: Types.ObjectId, productIds: Types.ObjectId[]) {

        return await this.cart.find({
            user_id: userId,
            product_id: { $in: productIds },
        })
    }

    async deleteMultipleProductQuantityCart(
        userId: Types.ObjectId,
        deleteDto: DeleteCartDto,
    ) {
        const objectIds = deleteDto.productId.map(
            id => new Types.ObjectId(id),
        );

        return await this.cart.deleteMany({
            user_id: userId,
            product_id: { $in: objectIds },
        });
    }
}
