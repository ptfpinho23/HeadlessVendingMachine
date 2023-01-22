export class CreateProductDto {
  name: string;
  cost: number;
  amountAvailable: number;
}

export class UpdateProductDto {
  name?: string;
  cost?: number;
  amountAvailable?: number;
}

export class ValidatePatchProduct {
  sellerId: string;
  productId: string;
  data: UpdateProductDto;
}

// egress dtos

export class ProductEgressDto {
  constructor(
    public id: string,
    public productName: string,
    public ammountAvailable: number,
  ) {}
}
