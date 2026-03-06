import { CreateOfferDto, UpdateOfferDto } from '@dtos/offer.dto';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '@prisma/prisma.service';
import { SAFE_USER_OMIT, UsersService } from 'src/users/users.service';
import { Role } from 'src/generated/prisma/client';

@Injectable()
export class OfferService {
  constructor(
    private readonly usersService: UsersService,
    private readonly prismaService: PrismaService,
  ) {}

  async createOffer(userId: string, body: CreateOfferDto) {
    const user = await this.usersService.getUserById(userId);

    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    if (user.role !== Role.COMPANY) {
      throw new UnauthorizedException('Only consultants can create offers');
    }

    const company = await this.prismaService.company.findUnique({
      where: { id_user: userId },
    });

    if (!company) {
      throw new UnauthorizedException('Company not found for the user');
    }

    const offer = await this.prismaService.offer.create({
      data: {
        id_company: company.id,
        title: body.title,
        description: body.description,
        budget: body.budget,
        deadline: body.deadline,
        location: body.location,
      },
    });

    return offer;
  }

  async listOffers() {
    return this.prismaService.offer.findMany({
      include: {
        company: {
          include: {
            user: {
              omit: SAFE_USER_OMIT,
            },
          },
        },
      },
    });
  }

  async listMyOffers(userId: string) {
    const company = await this.prismaService.company.findUnique({
      where: { id_user: userId },
    });

    if (!company) {
      throw new UnauthorizedException('Company not found for the user');
    }

    return this.prismaService.offer.findMany({
      where: { id_company: company.id },
      include: {
        company: {
          include: {
            user: {
              omit: SAFE_USER_OMIT,
            },
          },
        },
      },
    });
  }

  async getOfferById(id: string) {
    return this.prismaService.offer.findUnique({
      where: { id: id },
      include: {
        company: {
          include: {
            user: {
              omit: SAFE_USER_OMIT,
            },
          },
        },
      },
    });
  }

  async updateOffer(userId: string, id: string, body: UpdateOfferDto) {
    const { title, description, budget, deadline, location, status } = body;

    const offer = await this.getOfferById(id);

    if (!offer) {
      throw new UnauthorizedException('Offer not found');
    }

    if (offer.company.id_user !== userId) {
      throw new UnauthorizedException(
        'User not authorized to update this offer',
      );
    }

    return this.prismaService.offer.update({
      where: { id: id },
      data: {
        title,
        description,
        budget,
        deadline,
        location,
        status,
      },
    });
  }

  async deleteOffer(userId: string, id: string) {
    const offer = await this.getOfferById(id);

    if (!offer) {
      throw new UnauthorizedException('Offer not found');
    }

    if (offer.company.id_user !== userId) {
      throw new UnauthorizedException(
        'User not authorized to delete this offer',
      );
    }

    await this.prismaService.offer.delete({
      where: { id: id },
    });

    return this.listMyOffers(userId);
  }
}
