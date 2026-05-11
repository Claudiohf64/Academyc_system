export function normalizeApiError(error) {
  if (error?.details?.length) {
    return error.details.map((detail) => detail.msg).join(' | ');
  }

  return error?.message || 'Ocurrio un error inesperado';
}

export function formatTimestamp(value) {
  if (!value) {
    return 'Sin registro';
  }

  return new Intl.DateTimeFormat('es-PE', {
    dateStyle: 'medium',
    timeStyle: 'short',
  }).format(new Date(value));
}
