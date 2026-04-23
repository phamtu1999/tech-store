import { Controller, Post, Body, Res, Get, Req, UnauthorizedException, HttpStatus } from '@nestjs/common';
import { AuthService } from './auth.service';
import type { Response, Request } from 'express';


@Controller('api/v1/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Get('google')
  async googleLogin(@Res() res: Response) {
    // Redirect to Backend's OAuth2 authorization endpoint
    // Note: Use environment variable for Backend URL in production
    const backendUrl = process.env.BACKEND_URL || 'http://localhost:8080';
    return res.redirect(`${backendUrl}/oauth2/authorization/google`);
  }

  @Post('authenticate')
  async login(@Body() loginDto: any, @Res() res: Response) {
    const { sessionId, user } = await this.authService.authenticate(loginDto);

    res.cookie('sessionId', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
      maxAge: 86400000, // 1 day
      domain: process.env.COOKIE_DOMAIN || undefined,
    });


    return res.status(HttpStatus.OK).json({
      message: 'Login successful',
      result: user,
    });
  }

  @Post('logout')
  async logout(@Req() req: Request, @Res() res: Response) {
    const sessionId = req.cookies['sessionId'];
    if (sessionId) {
      await this.authService.logout(sessionId);
    }
    res.clearCookie('sessionId');
    return res.status(HttpStatus.OK).json({ message: 'Logged out' });
  }

  @Get('profile')
  async getProfile(@Req() req: Request) {
    const sessionId = req.cookies['sessionId'];
    if (!sessionId) {
      throw new UnauthorizedException('Not authenticated');
    }

    const session = await this.authService.getSession(sessionId);
    if (!session) {
      throw new UnauthorizedException('Session expired');
    }

    return { result: session.user };
  }
}
