import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'src/prisma/prisma.service';
import axios from 'axios';

@Injectable()
export class ResourcesService {

  constructor( private prisma: PrismaService ) { }

  async getSkills(req) {

    const userId = req.user.userId;

    const role = await this.prisma.user.findUnique({
      where: { id: userId },
      select: {role: true}
    });

    return role;
  }

  async getTutorials(data) {
    const { skill } = data;
    const result = await this.prisma.resourceTutorial.findMany({
      where: {
        skill: skill
      }
    })
    return result;
  }

  async getBooks(userData) {
    const { skill } = userData;
    
    const response = await axios.get(`https://openlibrary.org/search.json?q=${encodeURIComponent(skill)}`);
    
    const data = await response.data;

    const books = data.docs.slice(0, 5).map(book => ({
      title: book.title,
    
      author: book.author_name?.[0] || 'Unknown',
      image: book.cover_i
        ? `https://covers.openlibrary.org/b/id/${book.cover_i}-M.jpg`
        : null
    }));

    return books;
  }
    
}
