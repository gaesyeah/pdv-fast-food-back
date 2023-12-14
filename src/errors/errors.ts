import httpStatus from 'http-status';

const unprocessableEntity = (resource: string = 'Unprocessable Entity') => {
  return {
    status: httpStatus.UNPROCESSABLE_ENTITY,
    message: resource,
  };
};

export const error = { unprocessableEntity };
