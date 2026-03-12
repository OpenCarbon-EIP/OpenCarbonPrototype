import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException } from '@nestjs/common';
import type { application } from 'src/generated/prisma/browser';
import { ApplicationController } from 'src/application/application.controller';
import { ApplicationService } from 'src/application/application.service';
import type { UserSession } from '@thallesp/nestjs-better-auth';

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
        user: { id: 'consul-123' },
      } as unknown as UserSession);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('created successfully');
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

      const result = await controller.getApplicationById('app-uuid');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should throw NotFoundException when application not found', async () => {
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(null);

      await expect(
        controller.getApplicationById('nonexistent-id'),
      ).rejects.toThrow(NotFoundException);
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
        user: { id: 'consul-123' },
      } as unknown as UserSession);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApps);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should return empty array when no applications found', async () => {
      jest.spyOn(service, 'getAllApplicationsByUserId').mockResolvedValue([]);

      const result = await controller.getAllApplicationsByUserId({
        user: { id: 'consul-123' },
      } as unknown as UserSession);

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.message).toContain('retrieved successfully');
    });
  });

  describe('deleteApplication', () => {
    it('should return deleted applications list', async () => {
      const mockApps: Partial<application>[] = [
        {
          id: 'app-uuid',
          id_consultant: 'consul-123',
          id_offer: 'offre-456',
          content: 'I am interested in this job.',
          status: 'PENDING',
        },
      ];

      jest
        .spyOn(service, 'deleteApplication')
        .mockResolvedValue(mockApps as application[]);

      const result = await controller.deleteApplication('app-uuid', {
        user: { id: 'consul-123' },
      } as unknown as UserSession);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApps);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException when application to delete is not found', async () => {
      jest
        .spyOn(service, 'deleteApplication')
        .mockResolvedValue(null as unknown as application[]);

      await expect(
        controller.deleteApplication('nonexistent-id', {
          user: { id: 'consul-123' },
        } as unknown as UserSession),
      ).rejects.toThrow(NotFoundException);
    });
  });
});
