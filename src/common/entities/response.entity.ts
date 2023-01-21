import { ApiHideProperty } from '@nestjs/swagger';

export class ResponseWithoutData {
  @ApiHideProperty()
  status: number;
  message: string;
}

export class ResponseWithData extends ResponseWithoutData {
  data?: any;
}
