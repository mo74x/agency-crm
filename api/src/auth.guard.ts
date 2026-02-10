/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import {
  CanActivate,
  ExecutionContext,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { clerkClient } from '@clerk/clerk-sdk-node';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  private readonly logger = new Logger(ClerkAuthGuard.name);

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const token = request.headers.authorization?.split(' ')[1];

    if (!token) {
      this.logger.error('No token provided');
      throw new UnauthorizedException('No token provided');
    }

    try {
      // Verify the token with Clerk
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      const decoded = await clerkClient.verifyToken(token);

      // Attach the user ID to the request so we can use it later
      request['user'] = {
        id: decoded.sub, // 'sub' is the Clerk User ID
      };

      return true;
    } catch (err) {
      this.logger.error('Token verification failed', err);
      throw new UnauthorizedException('Invalid token');
    }
  }
}
