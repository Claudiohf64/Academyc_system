"use strict";

const bcrypt = require("bcryptjs");
const env = require("../../config/env");

module.exports = {
  async up(queryInterface) {
    const hashedPassword = await bcrypt.hash(env.admin.password, 10);

    await queryInterface.bulkInsert("users", [
      {
        nombres: env.admin.name,
        email: env.admin.email,
        password: hashedPassword,
        role: "admin",
        activo: true,
        created_at: new Date(),
        updated_at: new Date(),
      },
    ]);
  },
  async down(queryInterface) {
    await queryInterface.dropTable("users", { email: env.email });
  },
};
