import { ArgumentsHost, Catch, ExceptionFilter, HttpException, HttpStatus } from "@nestjs/common";
import { Request, Response } from "express";

@Catch()
export class HttpExceptionFilter implements ExceptionFilter{
    catch(exception:unknown,host:ArgumentsHost){

        const ctx = host.switchToHttp();
        const request = ctx.getRequest<Request>();
        const response = ctx.getResponse<Response>();

        const status = exception instanceof HttpException ? exception.getStatus() : HttpStatus.INTERNAL_SERVER_ERROR;
        const errorResponse = exception instanceof HttpException ? exception.getResponse() : 'Internal Server Error';

        response.status(status).json({
            success: false,
            statusCode:status,
            path: request.originalUrl,
            timestamp: new Date().toISOString(),
            message: errorResponse
        });
    }
}