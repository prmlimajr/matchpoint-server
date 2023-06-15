const jwt = require('jsonwebtoken');
const Yup = require('yup');
const knex = require('../../database/knex');
const authConfig = require('../../config/auth');
const { checkPassword } = require('../../utils/checkPassword');

class AuthController {
  async store(req, res) {
    const { email, password } = req.body;

    const [userExists] = await knex('users')
      .select('users.*')
      .where({ 'users.email': email });

    if (!userExists) {
      return res.status(400).json({ error: 'User not found' });
    }

    if (!await checkPassword(password, userExists.password)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    return res.json({
      user: {
        id: userExists.id,
        name: userExists.name,
        email,
        is_provider: !!userExists.is_provider,
        is_instructor: !!userExists.is_instructor
      },
      token: jwt.sign({ id: userExists.id }, authConfig.secret, {
        expiresIn: authConfig.expiresIn,
      }),
    });
  }
}

module.exports = new AuthController();
