import { Controller } from '@nestjs/common';
import { ConsultantService } from './consultant.service';

@Controller('consultant')
export class ConsultantController {
  constructor(private readonly consultantService: ConsultantService) {}
}
