import { Body, Controller, Get, HttpStatus, Post, Req, Res } from "@nestjs/common";
import { AppService } from './app.service';
import { Event } from './event';
import { Response, Request } from 'express';
import { createInternalEvent } from "./contract";


@Controller('/event')
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('/create')
  createEvent(@Body() event:Event, @Res() res: Response) {
    createInternalEvent(event, res)
  }
}
