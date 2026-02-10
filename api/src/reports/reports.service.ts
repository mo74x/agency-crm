/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {
  Injectable,
  NotFoundException,
  ForbiddenException,
} from '@nestjs/common';
import { CreateReportDto } from './dto/create-report.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ReportsService {
  constructor(private prisma: PrismaService) {}

  async create(createReportDto: CreateReportDto, userId: string) {
    // 1. Verify Project Ownership
    // We check if the project exists AND belongs to an agency owned by this user
    const project = await this.prisma.project.findFirst({
      where: {
        id: createReportDto.projectId,
        agency: { authId: userId }, // Magic: Check ownership via relation
      },
    });

    if (!project) {
      throw new ForbiddenException('Project not found or access denied');
    }

    // 2. Create the Report
    return this.prisma.report.create({
      data: {
        title: createReportDto.title,
        month: createReportDto.month,
        content: createReportDto.content, // Prisma handles the JSON automatically
        projectId: createReportDto.projectId,
      },
    });
  }

  async findAll(userId: string) {
    // Get all reports for all projects belonging to my agency
    return this.prisma.report.findMany({
      where: {
        project: {
          agency: { authId: userId },
        },
      },
      include: {
        project: {
          select: { title: true, client: { select: { name: true } } },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Find one report (for the detailed view/PDF generation later)
  async findOne(id: string, userId: string) {
    const report = await this.prisma.report.findFirst({
      where: {
        id,
        project: { agency: { authId: userId } },
      },
    });
    if (!report) throw new NotFoundException();
    return report;
  }
}
