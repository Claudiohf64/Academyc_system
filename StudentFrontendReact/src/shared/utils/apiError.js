export function normalizeApiError(error) {
  if (error?.details?.length) {
    return error.details.map((detail) => detail.msg).join(' | ');
  }

  return error?.message || 'Ocurrio un error inesperado';
}
