import { ResponseToolkit } from '@hapi/hapi';
import { nanoid } from 'nanoid';
import { Handler, CustomObject } from './types';
import books from './books';

type SendResponseOptions = { body: CustomObject; code?: number };

const sendResponse = (h: ResponseToolkit, options: SendResponseOptions) => {
  const { body, code = 200 } = options;
  const response = h.response(body);
  response.code(code);
  return response;
};

export const saveBookHandler: Handler = (req, h) => {
  const { name, readPage, pageCount } = req.payload as CustomObject;

  if (!name) {
    return sendResponse(h, {
      code: 400,
      body: {
        status: 'fail',
        message: 'Gagal menambahkan buku. Mohon isi nama buku',
      },
    });
  }

  if (readPage > pageCount) {
    return sendResponse(h, {
      code: 400,
      body: {
        status: 'fail',
        message:
          'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
      },
    });
  }

  const finished = readPage === pageCount;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    ...(req.payload as CustomObject),
    id: nanoid(16),
    name,
    readPage,
    pageCount,
    finished,
    insertedAt,
    updatedAt,
  };

  books.push(newBook);

  const isBookAdded = books.find((book) => book.id === newBook.id);
  if (!isBookAdded) {
    return sendResponse(h, {
      code: 500,
      body: {
        status: 'error',
        message: 'Buku gagal ditambahkan',
      },
    });
  }

  return sendResponse(h, {
    code: 201,
    body: {
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: newBook.id,
      },
    },
  });
};

export const getAllBooksHandler: Handler = (req, h) => {
  const { reading, finished, name } = req.query;

  let booksResponse = [...books];

  if (reading) {
    const isReading = Boolean(Number(reading));
    booksResponse = booksResponse.filter((book) => book.reading === isReading);
  }

  if (finished) {
    const isFinished = Boolean(Number(finished));
    booksResponse = booksResponse.filter(
      (book) => book.finished === isFinished
    );
  }

  if (name) {
    booksResponse = booksResponse.filter((book) => {
      const bookName = book.name.toLowerCase();
      const searchBookName = name.toLowerCase();
      const isBookNameMatch = bookName.search(searchBookName) !== -1;
      return isBookNameMatch;
    });
  }

  booksResponse = booksResponse.map((book) => ({
    id: book.id,
    name: book.name,
    publisher: book.publisher,
  }));

  return sendResponse(h, {
    code: 200,
    body: {
      status: 'success',
      data: {
        books: booksResponse,
      },
    },
  });
};

export const getBookByIdHandler: Handler = (req, h) => {
  const { bookId } = req.params;
  const book = books.find((b) => b.id === bookId);
  if (!book) {
    return sendResponse(h, {
      code: 404,
      body: {
        status: 'fail',
        message: 'Buku tidak ditemukan',
      },
    });
  }

  return sendResponse(h, {
    code: 200,
    body: {
      status: 'success',
      data: {
        book,
      },
    },
  });
};

export const updateBookByIdHandler: Handler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((b) => b.id === bookId);
  const isBookFound = index !== -1;

  if (!isBookFound) {
    return sendResponse(h, {
      code: 404,
      body: {
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan',
      },
    });
  }

  const { name, readPage, pageCount } = req.payload as CustomObject;

  if (!name) {
    return sendResponse(h, {
      code: 400,
      body: {
        status: 'fail',
        message: 'Gagal memperbarui buku. Mohon isi nama buku',
      },
    });
  }

  if (readPage > pageCount) {
    return sendResponse(h, {
      code: 400,
      body: {
        status: 'fail',
        message:
          'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
      },
    });
  }

  const updatedBook = { ...books[index], ...(req.payload as CustomObject) };

  books.splice(index, 1, updatedBook);

  return sendResponse(h, {
    code: 200,
    body: {
      status: 'success',
      message: 'Buku berhasil diperbarui',
    },
  });
};

export const deleteBookByIdHandler: Handler = (req, h) => {
  const { bookId } = req.params;

  const index = books.findIndex((b) => b.id === bookId);
  const isBookFound = index !== -1;

  if (!isBookFound) {
    return sendResponse(h, {
      code: 404,
      body: {
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
      },
    });
  }

  books.splice(index, 1);

  return sendResponse(h, {
    code: 200,
    body: {
      status: 'success',
      message: 'Buku berhasil dihapus',
    },
  });
};
