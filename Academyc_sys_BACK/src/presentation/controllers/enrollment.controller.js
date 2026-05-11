module.exports = ({ enrollmentUseCases }) => ({
  findAll: async (req, res, next) => {
    try {
      const enrollments = await enrollmentUseCases.findAll(req.query);
      res.json(enrollments);
    } catch (error) {
      next(error);
    }
  },
  findById: async (req, res, next) => {
    try {
      const enrollment = await enrollmentUseCases.findById(req.params.id);
      res.json(enrollment);
    } catch (error) {
      next(error);
    }
  },
  registerAndEnroll: async (req, res, next) => {
    try {
      const result = await enrollmentUseCases.registerAndEnroll(req.body);
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const enrollment = await enrollmentUseCases.create(req.body);
      res.status(201).json(enrollment);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const enrollment = await enrollmentUseCases.update(req.params.id, req.body);
      res.json(enrollment);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const result = await enrollmentUseCases.remove(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
});
