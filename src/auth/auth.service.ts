import { Injectable } from "@nestjs/common";

@Injectable({})
export class AuthService {
  signin() {
    return { msg: 'I have signin successfully' }
  }

  signup() {
    return { msg: 'I have signup successfully' }
  }
}
