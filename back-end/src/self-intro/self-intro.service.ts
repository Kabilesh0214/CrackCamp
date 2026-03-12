import { Injectable } from '@nestjs/common';

@Injectable()
export class SelfIntroService {

  async upload(video, req) {
    let userId = req.user.userId;
    console.log(video);
    console.log(userId);
  }
}
