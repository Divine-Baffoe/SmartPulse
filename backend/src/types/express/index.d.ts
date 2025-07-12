import { User } from '@prisma/client';
import express from 'express';

declare module 'express' {
  export interface Request {
      user?: User & { id: number }; // or whatever shape your user object has
    }
  
}