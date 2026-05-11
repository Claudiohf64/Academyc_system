module.exports = ({ careerUseCases }) => ({
  findAll: async (req, res, next) => {
    try {
      const careers = await careerUseCases.findAll(req.query);
      res.json(careers);
    } catch (error) {
      next(error);
    }
  },
  findById: async (req, res, next) => {
    try {
      const career = await careerUseCases.findById(req.params.id);
      res.json(career);
    } catch (error) {
      next(error);
    }
  },
  create: async (req, res, next) => {
    try {
      const career = await careerUseCases.create(req.body);
      res.status(201).json(career);
    } catch (error) {
      next(error);
    }
  },
  update: async (req, res, next) => {
    try {
      const career = await careerUseCases.update(req.params.id, req.body);
      res.json(career);
    } catch (error) {
      next(error);
    }
  },
  remove: async (req, res, next) => {
    try {
      const result = await careerUseCases.remove(req.params.id);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
});
