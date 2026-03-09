import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../application/application.service';
import { ApplicationController } from '../application/application.controller';
import { NotFoundException, ForbiddenException } from '@nestjs/common';
import { application } from 'src/generated/prisma/browser';

describe('ApplicationController', () => {
  let controller: ApplicationController;
  let service: ApplicationService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ApplicationController],
      providers: [
        {
          provide: ApplicationService,
          useValue: {
            createApplication: jest.fn(),
            getApplicationById: jest.fn(),
            getAllApplicationsByUserId: jest.fn(),
            deleteApplication: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<ApplicationController>(ApplicationController);
    service = module.get<ApplicationService>(ApplicationService);
  });

  describe('createApplication', () => {
    it('should return success response when creating application', async () => {
      const createDto = {
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
      };

      const mockApp: Partial<application> = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(service, 'createApplication')
        .mockResolvedValue(mockApp as application);

      const result = await controller.createApplication(createDto, {
        id: 'consul-123',
      } as Express.User);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('created successfully');
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      const createDto = {
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
      };

      await expect(
        controller.createApplication(createDto, undefined),
      ).rejects.toThrow('User not authenticated');
    });
  });

  describe('getApplicationById', () => {
    it('should return application when found', async () => {
      const mockApp: Partial<application> = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(service, 'getApplicationById')
        .mockResolvedValue(mockApp as application);

      const result = await controller.getApplicationById('app-uuid', {
        id: 'consul-123',
      } as Express.User);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should throw NotFoundException when application not found', async () => {
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(null);

      await expect(
        controller.getApplicationById('nonexistent-id', {
          id: 'consul-123',
        } as Express.User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own the application', async () => {
      const mockApp: Partial<application> = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(service, 'getApplicationById')
        .mockResolvedValue(mockApp as application);

      await expect(
        controller.getApplicationById('app-uuid', {
          id: 'other-user',
        } as Express.User),
      ).rejects.toThrow(
        'You do not have permission to access this application',
      );
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      await expect(
        controller.getApplicationById('app-uuid', undefined),
      ).rejects.toThrow('User not authenticated');
    });
  });

  describe('getAllApplicationsByUserId', () => {
    it('should return applications for a user', async () => {
      const mockApps: Partial<application>[] = [
        {
          id: 'app-1',
          id_consultant: 'consul-123',
          id_offer: 'offre-456',
          content: 'I am interested in this job.',
          status: 'PENDING',
        },
        {
          id: 'app-2',
          id_consultant: 'consul-123',
          id_offer: 'offre-789',
          content: 'I am also interested in this job.',
          status: 'PENDING',
        },
      ];

      jest
        .spyOn(service, 'getAllApplicationsByUserId')
        .mockResolvedValue(mockApps as application[]);

      const result = await controller.getAllApplicationsByUserId({
        id: 'consul-123',
      } as Express.User);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApps);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should return empty array when no applications found', async () => {
      jest.spyOn(service, 'getAllApplicationsByUserId').mockResolvedValue([]);

      const result = await controller.getAllApplicationsByUserId({
        id: 'consul-123',
      } as Express.User);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      await expect(
        controller.getAllApplicationsByUserId(undefined),
      ).rejects.toThrow('User not authenticated');
    });
  });

  describe('deleteApplication', () => {
    it('should return deleted application', async () => {
      const mockApp: Partial<application> = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest
        .spyOn(service, 'deleteApplication')
        .mockResolvedValue(mockApp as application[]);

      const result = await controller.deleteApplication('app-uuid', {
        id: 'consul-123',
      } as Express.User);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException when application to delete is not found', async () => {
      jest.spyOn(service, 'deleteApplication').mockResolvedValue(null);

      await expect(
        controller.deleteApplication('nonexistent-id', {
          id: 'consul-123',
        } as Express.User),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException when user does not own the application', async () => {
      jest
        .spyOn(service, 'deleteApplication')
        .mockRejectedValue(
          new ForbiddenException(
            'You do not have permission to delete this application',
          ),
        );

      await expect(
        controller.deleteApplication('app-uuid', {
          id: 'other-user',
        } as Express.User),
      ).rejects.toThrow(
        'You do not have permission to delete this application',
      );
    });

    it('should throw ForbiddenException when user is not authenticated', async () => {
      await expect(
        controller.deleteApplication('app-uuid', undefined),
      ).rejects.toThrow('User not authenticated');
    });
  });
});
