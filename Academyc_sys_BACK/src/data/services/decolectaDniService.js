const axios = require('axios');
const DniLookupService = require('../../domain/services/dniLookupService');
const AppError = require('../../shared/utils/appError');

class DecolectaDniService extends DniLookupService {
  constructor({ baseUrl, token, timeout }) {
    super();
    this.token = token;
    this.client = axios.create({
      baseURL: baseUrl,
      timeout,
      headers: { Accept: 'application/json', 'Content-Type': 'application/json' }
    });
  }

  adaptResponse(data, requestedDni) {
    const payload = data && data.data ? data.data : data;
    const nombres = payload.first_name || payload.nombres || payload.name || '';
    const apellidoPaterno = payload.first_last_name || payload.apellido_paterno || payload.paternal_surname || '';
    const apellidoMaterno = payload.second_last_name || payload.apellido_materno || payload.maternal_surname || '';

    if (!nombres && !apellidoPaterno && !apellidoMaterno) {
      throw new AppError('La API externa no devolvio datos utilizables para el DNI consultado', 502, 'DNI_PROVIDER_INVALID_RESPONSE');
    }

    return {
      dni: payload.document_number || payload.numero || requestedDni,
      nombres,
      apellido_paterno: apellidoPaterno,
      apellido_materno: apellidoMaterno,
      nombre_completo: payload.full_name || [nombres, apellidoPaterno, apellidoMaterno].filter(Boolean).join(' ')
    };
  }

  async findByDni(dni) {
    if (!this.token) {
      throw new AppError('No se configuro el token de la API DNI', 500, 'DNI_PROVIDER_TOKEN_MISSING');
    }

    try {
      const response = await this.client.get('/v1/reniec/dni', {
        params: { numero: dni },
        headers: { Authorization: `Bearer ${this.token}` }
      });
      return this.adaptResponse(response.data, dni);
    } catch (error) {
      if (error.response && error.response.status === 404) {
        throw new AppError('No se encontraron datos para el DNI consultado', 404, 'DNI_NOT_FOUND');
      }
      if (error.response && error.response.status === 401) {
        throw new AppError('El proveedor de DNI rechazo la autenticacion', 502, 'DNI_PROVIDER_UNAUTHORIZED');
      }
      throw new AppError('No fue posible consultar el servicio externo de DNI', 502, 'DNI_PROVIDER_ERROR');
    }
  }
}
module.exports = DecolectaDniService;