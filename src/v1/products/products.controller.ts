import {
  Controller,
  Post,
  Body,
  Res,
  Get,
  Delete,
  Param,
  Patch,
  UseGuards,
  Req,
} from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Request, Response } from 'express';
import { Constants } from '../../common/enums';
import { AuthGuard } from '@nestjs/passport';
import { ProductsService } from './products.service';
import { CreateProductDto, UpdateProductDto } from './dtos';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../common/decorators/roles.decorator';
import { Roles, User } from '@prisma/client';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@ApiTags('Products Endpoints')
@Controller('/api/v1/products')
@UseGuards(JwtAuthGuard)
@UseGuards(AuthGuard('jwt'))
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Role(Roles.seller)
  @UseGuards(RolesGuard)
  @Post('')
  @ApiOperation({
    summary: 'Used to add a product by a seller',
  })
  @ApiCreatedResponse({
    description: 'Product added sucessfully',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async addProduct(
    @Body() createProductarams: CreateProductDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const { status, ...responseData } = await this.productsService.addProduct(
      createProductarams,
      user.id,
    );

    return res.status(status).send(responseData);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Used to get a product',
  })
  @ApiCreatedResponse({
    description: 'Product successfully retrieved',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async retrieveProduct(@Param('id') productId: string, @Res() res: Response) {
    const { status, ...responseData } = await this.productsService.getProduct(
      productId,
    );

    return res.status(status).send(responseData);
  }

  @Get('')
  @ApiOperation({
    summary: 'Used to get all products',
  })
  @ApiCreatedResponse({
    description: 'Products successfully retrieved',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async getAllproducts(@Res() res: Response) {
    const { status, ...responseData } =
      await this.productsService.getAllProducts();

    return res.status(status).send(responseData);
  }

  @Role(Roles.seller)
  @UseGuards(RolesGuard)
  @Patch(':id')
  @ApiOperation({
    summary: 'Used to update a product',
  })
  @ApiCreatedResponse({
    description: 'Product successfully updated',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async updateProduct(
    @Param('id') productId: string,
    @Body() payload: UpdateProductDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const { status, ...responseData } =
      await this.productsService.updateProduct(user.id, payload, productId);

    return res.status(status).send(responseData);
  }

  @Role(Roles.seller)
  @UseGuards(RolesGuard)
  @Delete(':id')
  @ApiOperation({
    summary: 'Used to delete a product',
  })
  @ApiCreatedResponse({
    description: 'Product successfully deleted',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async deleteProduct(
    @Param('id') productId: string,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const { status, ...responseData } =
      await this.productsService.deleteProduct(user.id, productId);

    return res.status(status).send(responseData);
  }
}
