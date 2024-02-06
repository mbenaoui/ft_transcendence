import { Controller, Get } from '@nestjs/common';
import { OnlineService } from './online.service';

@Controller('')
export class OnlineController {
  constructor(private readonly gameCont: OnlineService) { }
}
