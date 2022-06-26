import Hapi from '@hapi/hapi';
import * as handler from './handler';

const routes: Hapi.ServerRoute[] = [
  {
    method: 'POST',
    path: '/books',
    handler: handler.saveBookHandler,
  },
  {
    method: 'GET',
    path: '/books',
    handler: handler.getAllBooksHandler,
  },
  {
    method: 'GET',
    path: '/books/{bookId}',
    handler: handler.getBookByIdHandler,
  },
  {
    method: 'PUT',
    path: '/books/{bookId}',
    handler: handler.updateBookByIdHandler,
  },
  {
    method: 'DELETE',
    path: '/books/{bookId}',
    handler: handler.deleteBookByIdHandler,
  },
];

export default routes;
