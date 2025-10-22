import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { ClientProxy, ClientProxyFactory, Transport } from '@nestjs/microservices';
import { lastValueFrom, timeout as rxTimeout } from 'rxjs';

@Injectable()
export class NetworkingService implements OnModuleInit {
  private readonly logger = new Logger(NetworkingService.name);
  private client: ClientProxy;

  constructor() {
    const host = process.env.AUTH_SERVICE_HOST || 'localhost';
    const port = Number(process.env.AUTH_SERVICE_PORT || 3001);

    this.client = ClientProxyFactory.create({
      transport: Transport.TCP,
      options: { host, port },
    });
  }

  async onModuleInit() {
    try {
      await this.client.connect();
      this.logger.log('Connected to authentication microservice');
    } catch (err) {
      this.logger.error('Failed to connect to authentication microservice', err as any);
    }
  }

  async send<T, R = any>(pattern: string, data: T, msTimeout = 5000): Promise<R> {
    try {
      const obs = this.client.send<R>(pattern, data).pipe(rxTimeout(msTimeout));
      return await lastValueFrom(obs);
    } catch (err) {
      this.logger.error(`Error calling microservice pattern=${pattern}`, err as any);
      throw err;
    }
  }
}