import { ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";
import { AuthDto } from "./dto";
import * as argon from 'argon2'
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService) { }

  async signup(dto: AuthDto) {
    // Generate the password hash with argon
    const hash = await argon.hash(dto.password);

    // Save the user in the db
    try {
      const user = await this.prisma.user.create({
        data: {
          email: dto.email,
          hash,
        },
      });
      delete user.hash;

      // return the saved user
      return user;

    } catch (error) {
      if (error instanceof PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new ForbiddenException('Credentials taken');
        }
      }
      throw error;
    }

  }

  async signin(dto: AuthDto) {
    // find the user in the db by email
    const user = this.prisma.user.findUnique({
      where: {
        email: dto.email,
      },
    });


    // if user doesnt exist throw error
    if (!user) throw new ForbiddenException('Invalid credentials');

    // compare the password hash with argon

    //compare the password hash with argon
    // const pwMatches = await argon.verify((await user).hash, dto.password);
    console.log(user);
    const pwMatches = await argon.verify(
      (await user).hash,
      dto.password,
    );
    // if password doesnt match throw error
    if (!pwMatches) throw new ForbiddenException('Invalid credentials');

    // send back the user
    delete (await user).hash;
    return user;
  }
}
