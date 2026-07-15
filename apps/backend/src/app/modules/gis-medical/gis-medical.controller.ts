import { Controller, Get } from "@nestjs/common";

@Controller('gis-medical')
export class GISMedicalController {
  @Get()
  getLogs() {
    return {
      message: "TODO"
    }
  }
}
