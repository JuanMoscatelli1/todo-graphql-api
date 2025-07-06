import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/application/user.service';
import { Role } from './roles/domain/roles.enum';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);


  const adminUsername = 'admin';
  const adminPassword = '1234'; 
  const adminRole = Role.ADMIN;

  const adminExists = await userService.findByUsername(adminUsername);
  if (!adminExists) {
    await userService.create({
      username: adminUsername,
      password: adminPassword,
      roles: [adminRole],
    });
    console.log('Admin user created on startup');
  }
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
