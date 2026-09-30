import { BadRequestException, Body, Controller, Delete, Get, MaxFileSizeValidator, Param, ParseFilePipe, Post, Put, Query, UploadedFiles, UseGuards, UseInterceptors } from '@nestjs/common';
import { ProductsService } from './products.service';
import { ProductDto, UpdateProductDto } from './dto/products.dto';
import { Roles } from 'src/roles/roles.decorator';
import { Role } from 'src/roles/roles.enum';
import { RolesGuard } from 'src/common/guards/roles.guard';
import { AuthGuard } from 'src/common/guards/auth.guard';
import { FilesInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { PaginationQueryDto } from 'src/common/dto/pagination-query.dto';
import { ApiBearerAuth, ApiBody, ApiConsumes, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Types } from 'mongoose';
import { PermissionGuard } from 'src/permission/permission.guard';
import { RequirePermissions } from 'src/permission/permission.decorator';

@ApiTags('Products')
@Controller({
    path: 'products',
    version: '1'
})
export class ProductsController {

    constructor(private readonly productService: ProductsService) { }
    
    @Post('/add')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.create')
    @ApiOperation({summary:'Add product'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({type:ProductDto})
    @ApiBearerAuth('access-token')

    @UseInterceptors(
        FilesInterceptor('image', 10, {
            storage: diskStorage({
                destination: './uploads/product',
                filename: (req, file, callback) => {

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname).toLowerCase();
                    callback(null, `product-${uniqueSuffix}${ext}`);

                },
            }),
            
            fileFilter: (req, file, callback) => {
                const ext = extname(file.originalname).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    return callback(
                        new BadRequestException(
                            'Only JPG, JPEG, PNG and WEBP files are allowed',
                        ),
                        false,
                    )
                }
                
                const allowedMime = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];
                
                if (!allowedMime.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Invalid Image Type',
                        ),
                        false,
                    )
                }
                
                callback(null, true);
            }
        })
    )

    addNewProduct(
        @Body() createProductDto: ProductDto,
        @UploadedFiles() files: Express.Multer.File[],
    ) {
        if (!files || files.length === 0) {
            throw new BadRequestException('At least one image is required');
        }

        files.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                throw new BadRequestException(
                    `${file.originalname} exceeds 2MB limit`,
                );
            }
        });

        const imagepath = files.map((file) => file.path.replace(/\\\\/g, '/'));

        return this.productService.createProduct(createProductDto, imagepath);
    }

    @Put('/update/:id')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.update')
    @ApiOperation({summary:'Update product'})
    @ApiConsumes('multipart/form-data')
    @ApiBody({type:UpdateProductDto})
    @ApiBearerAuth('access-token')

    @UseInterceptors(
        FilesInterceptor('image', 10, {
            storage: diskStorage({
                destination: './uploads/product',
                filename: (req, file, callback) => {

                    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
                    const ext = extname(file.originalname).toLowerCase();
                    callback(null, `product-${uniqueSuffix}${ext}`);
                    
                }
            }),
            
            fileFilter: (req, file, callback) => {
                const ext = extname(file.originalname).toLowerCase();
                if (!['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                    return callback(
                        new BadRequestException(
                            'Only JPG, JPEG, PNG and WEBP files are allowed',
                        ),
                        false,
                    )
                }
                
                const allowedMime = ['image/jpeg', 'image/jpg', 'image/webp', 'image/png'];
                
                if (!allowedMime.includes(file.mimetype)) {
                    return callback(
                        new BadRequestException(
                            'Invalid Image Type',
                        ),
                        false,
                    )
                }

                callback(null, true);
                
            }
        })
    )

    updateProductData(
        @Param('id') id: string,
        @Body() updateProductDto: UpdateProductDto,
        @UploadedFiles() files: Express.Multer.File[]
    ) {

        files.forEach((file) => {
            if (file.size > 2 * 1024 * 1024) {
                throw new BadRequestException(
                    `${file.originalname} exceeds 2MB limit`,
                );
            }
        })

        const imagepath = files.map((file) => file.path.replace(/\\\\/g, '/'));

        if(!(Types.ObjectId.isValid(id))){
            throw new BadRequestException('Invalid Product id');
        }
        const objectId = new Types.ObjectId(id);

        return this.productService.updateProduct(objectId, updateProductDto,imagepath);
    }
    
    
    @Delete('/delete/:id')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.deleteParticularProduct')
    @ApiOperation({summary:'Delete specific product'})
    @ApiBearerAuth('access-token')

    deleteParticularProduct(@Param('id') id: string) {
         if(!(Types.ObjectId.isValid(id))){
            throw new BadRequestException('Invalid Product id');
        }
        const objectId = new Types.ObjectId(id);
        return this.productService.deleteOneProduct(objectId);
    }
    
    @Delete('/deleteAll')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.deleteAll')
    @ApiOperation({summary:'Delete all products'})
    @ApiBearerAuth('access-token')

    deleteAllProducts() {
        return this.productService.deleteAllProduct();
    }
    
    @Get('/all')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.findAll')
    @ApiOperation({summary:'Fetch all products list'})
    @ApiBearerAuth('access-token')
    
    findAllProduct(@Query() paginationDto:PaginationQueryDto) {
        return this.productService.listAllProducts(paginationDto);
    }
    
    @Get('/details/:id')
    @UseGuards(AuthGuard, PermissionGuard)
    @RequirePermissions('product.findParticularProduct')
    @ApiOperation({summary:'Fetch specific product from the list'})
    @ApiBearerAuth('access-token')
    
    findParticularProduct(@Param('id') id: string) {
        if(!(Types.ObjectId.isValid(id))){
            throw new BadRequestException('Invalid Product id');
        }
        const objectId = new Types.ObjectId(id);
        return this.productService.findOneProduct(objectId);
    }
}
