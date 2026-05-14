export interface Project {
  id: string;
  title: string;
  description: string;
  fullDescription: string;
  technologies: string[];
  results: string;
  category: string;
  thumbnail: string;
  screenshots: string[];
  liveUrl?: string;
  githubUrl?: string;
  embedUrl?: string;
  order: number;
  createdAt: any;
}

export interface Category {
  id: string;
  name: string;
  count: number;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  description: string;
  skills: string[];
  image: string;
  verificationUrl: string;
  createdAt: any;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  metaDescription: string;
  keywords: string[];
  content: string;
  excerpt: string;
  featuredImage: string;
  author: string;
  published: boolean;
  tags: string[];
  publishedAt: any;
}

export interface Service {
  id: string;
  title: string;
  description: string;
  iconName: string;
  benefits: string[];
}

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  }
}
