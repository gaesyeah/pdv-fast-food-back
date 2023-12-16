import httpStatus from 'http-status';

const unprocessableEntity = (resource: string = 'Unprocessable Entity') => {
  return {
    status: httpStatus.UNPROCESSABLE_ENTITY,
    message: resource,
  };
};

const badRequest = (resource: string = 'Bad Request') => {
  return {
    status: httpStatus.BAD_REQUEST,
    message: resource,
  };
};

const internalServer = (resource: string = 'Internal Server Error') => {
  return {
    status: httpStatus.INTERNAL_SERVER_ERROR,
    message: resource,
  };
};

const notFound = (resource: string = 'Not Found') => {
  return {
    status: httpStatus.NOT_FOUND,
    message: resource,
  };
};

const forbidden = (resource: string = 'Forbidden Error') => {
  return {
    status: httpStatus.FORBIDDEN,
    message: resource,
  };
};

export const error = {
  unprocessableEntity,
  badRequest,
  internalServer,
  notFound,
  forbidden,
};
