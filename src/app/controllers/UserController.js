const bcrypt = require('bcryptjs');
const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');
const { checkPassword } = require('../../utils/checkPassword');

class UserController {
  async store(req, res) {
    const { name, email, password, isProvider } = req.body;
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string().email().required(),
      password: Yup.string().required().min(6),
      isProvider: Yup.boolean().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [emailExists] = await knex('users')
      .select('users.*')
      .where({ 'users.email': email });

    if (emailExists) {
      return res.status(403).json({ error: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 8);

    const user = {
      id: uuidV4(),
      name,
      email,
      password: hashedPassword,
      is_provider: isProvider
    };

    await knex('users').insert(user, 'id');

    return res.json(user);
  }

  async update(req, res) {
    const {
      name,
      email,
      is_provider,
      oldPassword,
      password,
    } = req.body;

    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      is_provider: Yup.boolean(),
      oldPassword: Yup.string().min(6),
      password: Yup.string()
        .min(6)
        .when('oldPassword', (oldPassword, field) =>
          oldPassword ? field.required() : field
        ),
      confirmPassword: Yup.string().when('password', (password, field) =>
        password ? field.required().oneOf([Yup.ref('password')]) : field
      ),
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [userExists] = await knex('users')
      .select('users.*')
      .where({ 'users.id': req.userId });

    if (email) {
      const [emailExists] = await knex('users')
      .select('users.*')
      .where({ 'users.email': email });

      if (emailExists) {
        return res.status(400).json({ error: 'Email already in use' });
      }
    }

    const hashedPassword = password
      ? await bcrypt.hash(password, 8)
      : userExists.password;

    if (oldPassword && !await checkPassword(oldPassword, userExists.password)) {
      return res.status(401).json({ error: 'Password does not match' });
    }

    const user = {
      name: name || userExists.name,
      email: email || userExists.email,
      is_provider: is_provider || userExists.is_provider,
      password: hashedPassword,
      created_at: userExists.created_at,
      updated_at: new Date()
    };

    await knex('users').update(user).where({ id: req.userId });

    return res.json({
      id: req.userId,
      ...user,
    });
  }

  async list(req, res) {
    const { id, email } = req.query;

    const query = knex('users')
      .select('users.*');

    if (id) {
      query.where({ id });
    }

    if (email) {
      query.where({ email });
    }

    const users = await query;

    const modifiedUsers = users.map(user => {
      const { password, ...newUser } = user;

      newUser.is_provider = !!user.is_provider;

      return newUser;
    });

    return res.json(modifiedUsers);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const [user] = await knex('users')
      .select('users.*')
      .where({ id });

    if (!user) { 
      return res.status(404).json({ message: 'User does not exist'})
    }

    await knex('users').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new UserController();
