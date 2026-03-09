import { Test, TestingModule } from '@nestjs/testing';
import { ApplicationService } from '../application/application.service';
import { ApplicationController } from '../application/application.controller';
import { NotFoundException } from '@nestjs/common';

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
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
      };

      const mockApp = {
        id: 'app-uuid',
        ...createDto,
        status: 'pending',
      };

      jest.spyOn(service, 'createApplication')
        .mockResolvedValue(mockApp as any);

      const result = await controller.createApplication(createDto);

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('created successfully');
    });
  });

  describe('getApplicationById', () => {
    it('should return application when found', async () => {
      const mockApp = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'PENDING',
      };

      jest.spyOn(service, 'getApplicationById')
        .mockResolvedValue(mockApp as any);

      const result = await controller.getApplicationById('app-uuid');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should throw NotFoundException when application not found', async () => {
      jest.spyOn(service, 'getApplicationById').mockResolvedValue(null);

      await expect(controller.getApplicationById('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });

  describe('getAllApplicationsByUserId', () => {
    it('should return applications for a user', async () => {
      const mockApps = [
        {
          id: 'app-1',
          id_consultant: 'consul-123',
          id_offer: 'offre-456',
          content: 'I am interested in this job.',
          status: 'pending',
        },
        {
          id: 'app-2',
          id_consultant: 'consul-123',
          id_offer: 'offre-789',
          content: 'I am also interested in this job.',
          status: 'pending',
        },
      ];

      jest.spyOn(service, 'getAllApplicationsByUserId')
        .mockResolvedValue(mockApps as any);

      const result = await controller.getAllApplicationsByUserId('consul-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApps);
      expect(result.message).toContain('retrieved successfully');
    });

    it('should return empty array when no applications found', async () => {
      jest.spyOn(service, 'getAllApplicationsByUserId').mockResolvedValue([]);

      const result = await controller.getAllApplicationsByUserId('consul-123');

      expect(result.success).toBe(true);
      expect(result.data).toEqual([]);
      expect(result.message).toContain('retrieved successfully');
    });
  });

  describe('deleteApplication', () => {
    it('should return deleted application', async () => {
      const mockApp = {
        id: 'app-uuid',
        id_consultant: 'consul-123',
        id_offer: 'offre-456',
        content: 'I am interested in this job.',
        status: 'pending',
      };

      jest.spyOn(service, 'deleteApplication')
        .mockResolvedValue(mockApp as any);

      const result = await controller.deleteApplication('app-uuid');

      expect(result.success).toBe(true);
      expect(result.data).toEqual(mockApp);
      expect(result.message).toContain('deleted successfully');
    });

    it('should throw NotFoundException when application to delete is not found', async () => {
      jest.spyOn(service, 'deleteApplication').mockResolvedValue(null);

      await expect(controller.deleteApplication('nonexistent-id')).rejects.toThrow(NotFoundException);
    });
  });
});

