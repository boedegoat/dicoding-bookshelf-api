import Hapi from '@hapi/hapi';

export type Handler = Hapi.Lifecycle.Method | Hapi.HandlerDecorations;

export type CustomObject = { [property: string]: any };

export type Book = {
  id?: string;
  name: string;
  year?: number;
  author?: string;
  summary?: string;
  publisher?: string;
  pageCount?: number;
  readPage?: number;
  finished?: boolean;
  reading?: boolean;
  insertedAt?: string;
  updatedAt?: string;
};
