module.exports = ({ courseUseCases }) => ({
  findAll: async (req, res, next) => {
    try {
      const courses = await courseUseCases.findAll(req.query);
      res.json(courses);
    } catch (error) {
      next(error);
    }
  },
  findById: async (req, res, next) => {
    try {
      const course = await courseUseCases.findById(req.params.id);
      res.json(course);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const course = await courseUseCases.create(req.body);
      res.status(201).json(course);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const course = await courseUseCases.update(req.params.id, req.body);
      res.json(course);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const result = await courseUseCases.remove(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
});
