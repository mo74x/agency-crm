/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateProjectDto } from './dto/create-project.dto';
import { PrismaService } from 'src/prisma/prisma.service';
@Injectable()
export class ProjectsService {
  constructor(private prisma: PrismaService) {}

  // Helper to find the agency
  private async getAgencyId(authId: string) {
    const agency = await this.prisma.agency.findUnique({ where: { authId } });
    if (!agency) throw new NotFoundException('Agency not found');
    return agency.id;
  }

  async create(createProjectDto: CreateProjectDto, userId: string) {
    const agencyId = await this.getAgencyId(userId);

    // Verify the Client belongs to this Agency (Security Check)
    const client = await this.prisma.client.findFirst({
      where: { id: createProjectDto.clientId, agencyId },
    });

    if (!client) {
      throw new NotFoundException('Client not found or does not belong to you');
    }

    return this.prisma.project.create({
      data: {
        title: createProjectDto.title,
        deadline: createProjectDto.deadline,
        clientId: createProjectDto.clientId,
        agencyId: agencyId, // <--- Link to Agency
        status: 'IN_PROGRESS',
      },
    });
  }

  async findAll(userId: string) {
    const agencyId = await this.getAgencyId(userId);

    // Fetch projects AND include the Client name (Join)
    return this.prisma.project.findMany({
      where: { agencyId },
      include: {
        client: {
          select: { name: true }, // Just get the name, not everything
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} project`;
  }
  update(id: number, updateProjectDto: any) {
    return `This action updates a #${id} project`;
  }
  remove(id: number) {
    return `This action removes a #${id} project`;
  }
}
