/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-return */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import { Injectable } from '@nestjs/common';
import { CreateClientDto } from './dto/create-client.dto';
import { PrismaService } from 'src/prisma/prisma.service'; // Import your new service

@Injectable()
export class ClientsService {
  constructor(private prisma: PrismaService) { } // Inject Prisma

  private async getAgency(userId: string) {
    return this.prisma.agency.upsert({
      where: { authId: userId },
      update: {}, // If it exists, do nothing
      create: {
        name: 'My New Agency',
        authId: userId,
      },
    });
  }

  async create(createClientDto: CreateClientDto, userId: string) {
    const agency = await this.getAgency(userId);

    return this.prisma.client.create({
      data: {
        ...createClientDto,
        agencyId: agency.id, // <--- Securely linked!
      },
    });
  }

  async findAll(userId: string) {
    const agency = await this.getAgency(userId);

    return this.prisma.client.findMany({
      where: { agencyId: agency.id },
    });
  }

  async findOne(id: string, userId: string) {
    const agency = await this.getAgency(userId);

    return this.prisma.client.findUnique({
      where: { id, agencyId: agency.id },
    });
  }

  async update(id: string, updateClientDto: any, userId: string) {
    const agency = await this.getAgency(userId);

    return this.prisma.client.update({
      where: { id, agencyId: agency.id },
      data: updateClientDto,
    });
  }

  async remove(id: string, userId: string) {
    const agency = await this.getAgency(userId);

    return this.prisma.client.delete({
      where: { id, agencyId: agency.id },
    });
  }
}
