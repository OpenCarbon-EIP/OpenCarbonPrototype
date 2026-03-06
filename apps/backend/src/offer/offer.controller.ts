import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { OfferService } from './offer.service';
import { CurrentUser } from 'src/decorators/current-user';
import { CreateOfferDto, UpdateOfferDto } from '@dtos/offer.dto';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ApiResponse } from 'src/types/global';
import { offer } from 'src/generated/prisma/client';

@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('create')
  @UseGuards(JwtAuthGuard)
  async createOffer(
    @CurrentUser() user: Express.User,
    @Body() body: CreateOfferDto,
  ): Promise<ApiResponse<offer>> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offer = await this.offerService.createOffer(user.id, body);

    return {
      success: true,
      data: offer,
      message: 'Offer created successfully',
    };
  }

  @Get('list')
  @UseGuards(JwtAuthGuard)
  async listOffers(
    @CurrentUser() user: Express.User,
  ): Promise<ApiResponse<offer[]>> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offers = await this.offerService.listOffers();

    return {
      success: true,
      data: offers,
      message: 'Offers retrieved successfully',
    };
  }

  @Get('my-offers')
  @UseGuards(JwtAuthGuard)
  async listMyOffers(
    @CurrentUser() user: Express.User,
  ): Promise<ApiResponse<offer[]>> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offers = await this.offerService.listMyOffers(user.id);

    return {
      success: true,
      data: offers,
      message: 'My offers retrieved successfully',
    };
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard)
  async getOfferById(
    @CurrentUser() user: Express.User,
    @Param('id') id: string,
  ): Promise<ApiResponse<offer>> {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offer = await this.offerService.getOfferById(id);

    if (!offer) {
      throw new UnauthorizedException('Offer not found');
    }

    return {
      success: true,
      data: offer,
      message: 'Offer retrieved successfully',
    };
  }

  @Put(':id/update')
  @UseGuards(JwtAuthGuard)
  async updateOffer(
    @CurrentUser() user: Express.User,
    @Param('id') id: string,
    @Body() body: UpdateOfferDto,
  ) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offer = await this.offerService.updateOffer(user.id, id, body);

    return {
      success: true,
      data: offer,
      message: 'Offer updated successfully',
    };
  }

  @Delete(':id/delete')
  @UseGuards(JwtAuthGuard)
  async deleteOffer(
    @CurrentUser() user: Express.User,
    @Param('id') id: string,
  ) {
    if (!user) {
      throw new UnauthorizedException('User not authenticated');
    }

    const offer = await this.offerService.deleteOffer(user.id, id);

    return {
      success: true,
      data: offer,
      message: 'Offer deleted successfully',
    };
  }
}
