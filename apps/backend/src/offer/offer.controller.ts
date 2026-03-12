import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse as SwaggerResponse,
  ApiParam,
} from '@nestjs/swagger';
import { OfferService } from './offer.service';
import {
  AllowAnonymous,
  Roles,
  Session,
  type UserSession,
} from '@thallesp/nestjs-better-auth';
import { CreateOfferDto, UpdateOfferDto } from '@dtos/offer.dto';
import { ApiResponse } from 'src/types/global';
import { offer } from 'src/generated/prisma/client';

@ApiTags('Offers')
@Controller('offers')
export class OfferController {
  constructor(private readonly offerService: OfferService) {}

  @Post('create')
  @Roles(['COMPANY'])
  @ApiOperation({ summary: 'Create a new offer (company only)' })
  @SwaggerResponse({ status: 201, description: 'Offer created successfully' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({
    status: 403,
    description: 'Only companies can create offers',
  })
  async createOffer(
    @Session() session: UserSession,
    @Body() body: CreateOfferDto,
  ): Promise<ApiResponse<offer>> {
    const offer = await this.offerService.createOffer(session.user.id, body);

    return {
      success: true,
      data: offer,
      message: 'Offer created successfully',
    };
  }

  @Get('list')
  @AllowAnonymous()
  @ApiOperation({ summary: 'List all offers' })
  @SwaggerResponse({ status: 200, description: 'Offers retrieved' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  async listOffers(): Promise<ApiResponse<offer[]>> {
    const offers = await this.offerService.listOffers();
    return {
      success: true,
      data: offers,
      message: 'Offers retrieved successfully',
    };
  }

  @Get('my-offers')
  @ApiOperation({ summary: 'List offers created by the authenticated company' })
  @SwaggerResponse({ status: 200, description: 'Offers retrieved' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({ status: 404, description: 'Company not found for user' })
  async listMyOffers(
    @Session() session: UserSession,
  ): Promise<ApiResponse<offer[]>> {
    const offers = await this.offerService.listMyOffers(session.user.id);
    return {
      success: true,
      data: offers,
      message: 'My offers retrieved successfully',
    };
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific offer by ID' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  @SwaggerResponse({ status: 200, description: 'Offer retrieved' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({ status: 404, description: 'Offer not found' })
  async getOfferById(@Param('id') id: string): Promise<ApiResponse<offer>> {
    const offer = await this.offerService.getOfferById(id);
    return {
      success: true,
      data: offer,
      message: 'Offer retrieved successfully',
    };
  }

  @Put(':id/update')
  @ApiOperation({ summary: 'Update an offer (owner only)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  @SwaggerResponse({ status: 200, description: 'Offer updated' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({ status: 403, description: 'Not the offer owner' })
  @SwaggerResponse({ status: 404, description: 'Offer not found' })
  async updateOffer(
    @Session() session: UserSession,
    @Param('id') id: string,
    @Body() body: UpdateOfferDto,
  ): Promise<ApiResponse<offer>> {
    const offer = await this.offerService.updateOffer(
      session.user.id,
      id,
      body,
    );
    return {
      success: true,
      data: offer,
      message: 'Offer updated successfully',
    };
  }

  @Delete(':id/delete')
  @ApiOperation({ summary: 'Delete an offer (owner only)' })
  @ApiParam({ name: 'id', description: 'Offer UUID' })
  @SwaggerResponse({ status: 200, description: 'Offer deleted' })
  @SwaggerResponse({ status: 401, description: 'Unauthorized' })
  @SwaggerResponse({ status: 403, description: 'Not the offer owner' })
  @SwaggerResponse({ status: 404, description: 'Offer not found' })
  async deleteOffer(
    @Session() session: UserSession,
    @Param('id') id: string,
  ): Promise<ApiResponse<offer[]>> {
    const offer = await this.offerService.deleteOffer(session.user.id, id);

    return {
      success: true,
      data: offer,
      message: 'Offer deleted successfully',
    };
  }
}
