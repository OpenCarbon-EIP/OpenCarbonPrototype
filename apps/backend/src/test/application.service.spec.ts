import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../application/application.service';
import { PrismaService } from '../prisma/prisma.service';
import { BadRequestException } from '@nestjs/common';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let prismaService: PrismaService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ApplicationService,
        {
          provide: PrismaService,
          useValue: {
            application: {
              create: jest.fn(),
              findUnique: jest.fn(),
              findMany: jest.fn(),
              delete: jest.fn(),
            },
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prismaService = module.get<PrismaService>(PrismaService);
  });

  describe('createApplication', () => {
    it('should create a new application', async () => {
      const createDto = {
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
      }

      const mockApp = {
        id: 'app-uuid',
        ...createDto,
        status: 'pending',
      }

      jest.spyOn(prismaService.application, 'create')
        .mockResolvedValue(mockApp as any);

      const result = await service.createApplication(createDto);

      expect(result).toEqual(mockApp);

      expect(prismaService.application.create).toHaveBeenCalledWith({
        data: createDto,
      });
    });

    it('should throw BadRequestException if creation fails', async () => {
      const invalidDto = {
        id_consultant: 'consul-123',
      }

      await expect(
        service.createApplication(invalidDto as any)
      ).rejects.toThrow(BadRequestException);
    });
  })

  describe('getApplicationById', () => {
    it('should return an application when it exists', async () => {
      const mockApp = {
        id: 'app-123',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      }

      jest.spyOn(prismaService.application, 'findUnique')
        .mockResolvedValue(mockApp as any);

      const result = await service.getApplicationById('app-123');

      expect(result).toEqual(mockApp);
      expect(prismaService.application.findUnique).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(
        service.getApplicationById('')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('getAllApplicationsByUserId', () => {
    it('should return all applications for a user', async () => {
      const mockApps = [
        { 
          id: 'app-1',
          id_consultant: 'consul-123',
          id_offer: 'offre-456',
          content: 'App 1',
          status: 'PENDING'
        },
        {
          id: 'app-2',
          id_consultant: 'consul-123',
          id_offer: 'offre-789',
          content: 'App 2',
          status: 'PENDING'
        },
      ];

      jest.spyOn(prismaService.application, 'findMany')
        .mockResolvedValue(mockApps as any);

      const result = await service.getAllApplicationsByUserId('consul-123');

      expect(result).toEqual(mockApps);
      expect(prismaService.application.findMany).toHaveBeenCalledWith({
        where: { id_consultant: 'consul-123' },
      });
    });

    it('should throw BadRequestException if userId is not provided', async () => {
      await expect(
        service.getAllApplicationsByUserId('')
      ).rejects.toThrow(BadRequestException);
    });
  });

  describe('deleteApplication', () => {
    it('should delete an application by id', async () => {
      const mockApp = {
        id: 'app-123',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      }

      jest.spyOn(prismaService.application, 'delete')
        .mockResolvedValue(mockApp as any);

      const result = await service.deleteApplication('app-123');

      expect(result).toEqual(mockApp);
      expect(prismaService.application.delete).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(
        service.deleteApplication('')
      ).rejects.toThrow(BadRequestException);
    });
  });
})