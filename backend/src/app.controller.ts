/* eslint-disable @typescript-eslint/no-unused-vars */
import { Controller, Get } from '@nestjs/common';

@Controller()
export class AppController {
  /*@Get('health')
  health(): { status: string; timestamp: number } {
    return { status: 'ok', timestamp: Date.now() };
  }

  @Get('ai/risk-profile')
  async riskProfile(): Promise<{
    riskScore: number;
    recommendedAllocation: { equities: number; startups: number; cash: number };
    note: string;
  }> {
    // stubbed response for frontend development
    return {
      riskScore: 42,
      recommendedAllocation: {
        equities: 0.5,
        startups: 0.25,
        cash: 0.25,
      },
      note: 'This is a stub. Integrate AI microservice or OpenAI for real profiles.'
    };
  }*/
}
