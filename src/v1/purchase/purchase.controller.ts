import { Controller, Post, Body, Res, UseGuards, Req } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiInternalServerErrorResponse,
  ApiOperation,
  ApiTags,
} from '@nestjs/swagger';
import { ResponseWithoutData } from '../../common/entities/response.entity';
import { Request, Response } from 'express';
import { Constants } from '../../common/enums';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../../common/decorators/roles.decorator';
import { Roles, User } from '@prisma/client';
import { PurchaseService } from './purchase.service';
import { PurchaseProductDto } from './dtos';
import { AuthGuard } from '@nestjs/passport';
import { JwtAuthGuard } from '../auth/guards/jwt.guard';

@UseGuards(AuthGuard('jwt'))
@UseGuards(JwtAuthGuard)
@ApiTags('Buy Product Endpoints')
@Controller('/api/v1/buy')
export class PurchaseController {
  constructor(private readonly purchaseService: PurchaseService) {}

  @Role(Roles.buyer)
  @UseGuards(RolesGuard)
  @Post('')
  @ApiOperation({
    summary: 'Used to buy a product by a user',
  })
  @ApiCreatedResponse({
    description: 'Product Bought Successfully sucessfully',
    type: ResponseWithoutData,
  })
  @ApiInternalServerErrorResponse({
    description: Constants.SERVER_ERROR,
    type: ResponseWithoutData,
  })
  async buyProduct(
    @Body() createUserParams: PurchaseProductDto,
    @Res() res: Response,
    @Req() req: Request,
  ) {
    const user = req.user as User;
    const { status, ...responseData } = await this.purchaseService.buyProduct(
      createUserParams,
      user.id,
    );

    return res.status(status).send(responseData);
  }
}
