import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../application/application.service';
import { PrismaService } from '../prisma/prisma.service';
import { UsersService } from '../users/users.service';
import { ConsultantService } from '../consultant/consultant.service';
import {
  BadRequestException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';

describe('ApplicationService', () => {
  let service: ApplicationService;
  let prismaService: PrismaService;
  let usersService: UsersService;
  let consultantService: ConsultantService;

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
        {
          provide: UsersService,
          useValue: {
            getUserById: jest.fn(),
          },
        },
        {
          provide: ConsultantService,
          useValue: {
            getConsultantByUserId: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<ApplicationService>(ApplicationService);
    prismaService = module.get<PrismaService>(PrismaService);
    usersService = module.get<UsersService>(UsersService);
    consultantService = module.get<ConsultantService>(ConsultantService);
  });

  describe('createApplication', () => {
    it('should create a new application with authenticated user id', async () => {
      const createDto = {
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
      };

      const userId = 'user-123';

      const mockUser = {
        id: userId,
        email: 'consultant@example.com',
        role: 'CONSULTANT',
      };

      const mockConsultant = {
        id: 'consul-123',
        first_name: 'John',
        last_name: 'Doe',
        professional_title: 'Carbon Auditor',
        id_user: userId,
      };

      const mockApp = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'pending',
      };

      const createSpy = jest.spyOn(prismaService.application, 'create');

      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as any);
      jest
        .spyOn(consultantService, 'getConsultantByUserId')
        .mockResolvedValue(mockConsultant as any);

      createSpy.mockResolvedValue(mockApp as any);

      const result = await service.createApplication(createDto, userId);

      expect(result).toEqual(mockApp);

      expect(createSpy).toHaveBeenCalledWith({
        data: {
          id_consultant: 'consul-123',
          id_offer: 'offre-456',
          content: 'I am interested in this job.',
        },
      });
    });

    it('should throw BadRequestException if creation fails', async () => {
      const invalidDto = {
        id_offer: 'offre-456',
      };

      const mockUser = {
        id: 'consul-123',
        email: 'consultant@example.com',
        name: 'Consultant Name',
        role: 'CONSULTANT',
      };

      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as any);

      await expect(
        service.createApplication(invalidDto as any, 'consul-123'),
      ).rejects.toThrow(BadRequestException);
    });

    it('should throw NotFoundException if user is not found', async () => {
      jest.spyOn(usersService, 'getUserById').mockResolvedValue(null);

      await expect(
        service.createApplication(
          { id_offer: 'offre-456', content: 'I am interested in this job.' },
          'consul-123',
        ),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw BadRequestException if user is not a consultant', async () => {
      const mockUser = {
        id: 'consul-123',
        email: 'notconsultant@example.com',
        name: 'Not Consultant',
        role: 'CLIENT',
      };

      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as any);

      await expect(
        service.createApplication(
          { id_offer: 'offre-456', content: 'I am interested in this job.' },
          'consul-123',
        ),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw NotFoundException if consultant profile not found', async () => {
      const mockUser = {
        id: 'user-123',
        email: 'consultant@example.com',
        role: 'CONSULTANT',
      };

      jest
        .spyOn(usersService, 'getUserById')
        .mockResolvedValue(mockUser as any);
      jest
        .spyOn(consultantService, 'getConsultantByUserId')
        .mockResolvedValue(null);

      await expect(
        service.createApplication(
          { id_offer: 'offre-456', content: 'I am interested in this job.' },
          'user-123',
        ),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('getApplicationById', () => {
    it('should return an application when it exists', async () => {
      const mockApp = {
        id: 'app-123',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(prismaService.application, 'findUnique')
        .mockResolvedValue(mockApp as any);

      const result = await service.getApplicationById('app-123');

      expect(result).toEqual(mockApp);

      const findUniqueSpy = jest.spyOn(prismaService.application, 'findUnique');
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.getApplicationById('')).rejects.toThrow(
        BadRequestException,
      );
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
          status: 'PENDING',
        },
        {
          id: 'app-2',
          id_consultant: 'consul-123',
          id_offer: 'offre-789',
          content: 'App 2',
          status: 'PENDING',
        },
      ];

      jest
        .spyOn(prismaService.application, 'findMany')
        .mockResolvedValue(mockApps as any);

      const result = await service.getAllApplicationsByUserId('consul-123');

      expect(result).toEqual(mockApps);

      const findManySpy = jest.spyOn(prismaService.application, 'findMany');
      expect(findManySpy).toHaveBeenCalledWith({
        where: { id_consultant: 'consul-123' },
      });
    });

    it('should throw BadRequestException if userId is not provided', async () => {
      await expect(service.getAllApplicationsByUserId('')).rejects.toThrow(
        BadRequestException,
      );
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
      };

      jest
        .spyOn(prismaService.application, 'findUnique')
        .mockResolvedValue(mockApp as any);
      jest
        .spyOn(prismaService.application, 'delete')
        .mockResolvedValue(mockApp as any);

      await service.deleteApplication('app-123', 'consul-123');

      const findUniqueSpy = jest.spyOn(prismaService.application, 'findUnique');
      expect(findUniqueSpy).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });

      const deleteSpy = jest.spyOn(prismaService.application, 'delete');
      expect(deleteSpy).toHaveBeenCalledWith({
        where: { id: 'app-123' },
      });
    });

    it('should throw BadRequestException if id is not provided', async () => {
      await expect(service.deleteApplication('', 'consul-123')).rejects.toThrow(
        BadRequestException,
      );
    });

    it('should throw not found exception if application does not exist', async () => {
      jest
        .spyOn(prismaService.application, 'findUnique')
        .mockResolvedValue(null as any);

      await expect(
        service.deleteApplication('nonexistent-id', 'consul-123'),
      ).rejects.toThrow('Application not found');
    });

    it('should throw ForbiddenException if user does not own the application', async () => {
      const mockApp = {
        id: 'app-123',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(prismaService.application, 'findUnique')
        .mockResolvedValue(mockApp as any);
      jest
        .spyOn(prismaService.application, 'delete')
        .mockResolvedValue(mockApp as any);

      await expect(
        service.deleteApplication('app-123', 'other-user'),
      ).rejects.toThrow(
        'You do not have permission to delete this application',
      );
    });
  });
});
