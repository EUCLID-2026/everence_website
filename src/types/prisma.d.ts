/* eslint-disable @typescript-eslint/no-explicit-any */
declare module "@prisma/client" {
  export interface User {
    id: string;
    email: string;
    passwordHash: string;
    fullName: string;
    organisation: string | null;
    role: string;
    createdAt: Date;
    updatedAt: Date;
  }

  export interface JwtSession {
    id: string;
    userId: string;
    tokenHash: string;
    expiresAt: Date;
    revoked: boolean;
    createdAt: Date;
    userAgent: string | null;
    user?: User;
  }

  export class PrismaClient {
    constructor(options?: any);
    $connect(): Promise<void>;
    $disconnect(): Promise<void>;
    user: {
      findUnique(args: { where: { id?: string; email?: string } }): Promise<User | null>;
      findFirst(args?: any): Promise<User | null>;
      create(args: { data: any; select?: any }): Promise<any>;
      update(args: { where: { id: string }; data: any }): Promise<User>;
    };
    jwtSession: {
      findUnique(args: { where: { id: string }; include?: any }): Promise<any>;
      create(args: { data: any }): Promise<JwtSession>;
      updateMany(args: { where: any; data: any }): Promise<{ count: number }>;
      deleteMany(args: { where: any }): Promise<{ count: number }>;
    };
  }
}

