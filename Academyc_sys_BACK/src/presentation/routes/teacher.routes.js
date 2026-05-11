const express = require('express');
const validateRequest = require('../middlewares/validate.middleware');
const authMiddleware = require('../middlewares/auth.middleware');
const { idParam,cod_docenteParam, dniParam, teacherRules } = require('../middlewares/validation-rules');

module.exports = ({ teacherController }) => {
  const router = express.Router();

  router.use(authMiddleware);
  router.get('/cod_docente/:cod_docente',cod_docenteParam, validateRequest, teacherController.lookupByCod_docente);
  router.get('/dni/:dni', dniParam, validateRequest, teacherController.lookupByDni);
  router.post('/', teacherRules.create, validateRequest, teacherController.create);
  router.post('/register', teacherRules.createFromDni, validateRequest, teacherController.createFromDni);
  router.get('/', teacherController.findAll);
  router.get('/:id', idParam, validateRequest, teacherController.findById);
  router.put('/:id', [...idParam, ...teacherRules.update], validateRequest, teacherController.update);
  router.delete('/:id', idParam, validateRequest, teacherController.remove);
  return router;
};
