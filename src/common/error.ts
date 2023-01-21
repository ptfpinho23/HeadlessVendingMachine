import { HttpException, HttpStatus } from '@nestjs/common';
import { Response } from './response';
import { Constants } from './enums';
import { ResponseWithoutData } from './entities/response.entity';

export const getErrorResponse = (error: Error): ResponseWithoutData => {
  let responseStatus = HttpStatus.INTERNAL_SERVER_ERROR;
  let responseMessage = Constants.SERVER_ERROR as string;
  if (error instanceof HttpException) {
    responseStatus = error.getStatus();
  }
  if (error.message) {
    responseMessage = error.message;
  }

  return Response.withoutData(responseStatus, responseMessage);
};
