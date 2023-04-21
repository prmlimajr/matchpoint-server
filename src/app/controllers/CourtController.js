const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class CourtController {
  async store(req, res) {
    const { company_id, name, description, address, phone } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
      company_id: Yup.string().required(),
      name: Yup.string().required(),
      description: Yup.string(),
      address: Yup.string().required(),
      phone: Yup.string().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [companyExists] = await knex('company')
      .select('company.*')
      .where({ 'company.user_id': userId });

    if (!companyExists) {
      return res.status(400).json({ error: 'Company does not exists' });
    }

    if (companyExists.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to do this operation.' });
    }

    const [courtExists] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.company_id': company_id })
      .andWhere({ 'courts.name': name});

    if (courtExists) {
      return res.status(403).json({ error: 'Court already exists' });
    }

    const court = {
      id: uuidV4(),
      company_id,
      name,
      description,
      address,
      phone,
    };

    await knex('courts').insert(court, 'id');

    return res.json(court);
  }

  async update(req, res) {
    const { name, description, address, phone } = req.body;
    const { id } = req.params;
    const { userId } = req;

    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      address: Yup.string(),
      phone: Yup.string()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [companyExists] = await knex('company')
      .select('company.*')
      .where({ 'company.user_id': userId });

    if (!companyExists) {
      return res.status(400).json({ error: 'Company does not exists' });
    }

    if (companyExists.user_id !== userId) {
      return res.status(403).json({ error: 'You do not have permission to do this operation.' });
    }

    const [courtExists] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': id });

    if (!courtExists) {
      return res.status(404).json({ error: 'Court does not exist' });
    }

    if (courtExists.company_id !== companyExists.id) {
      return res.status(403).json({ message: 'You can not do this operation'});
    }

    const court = {
      name,
      description,
      address,
      phone,
      user_id: userId,
      created_at: courtExists.created_at,
      updated_at: new Date()
    };

    await knex('courts').update(court).where({ id });

    return res.json({
      id,
      ...court,
    });
  }

  async list(req, res) {
    const { name } = req.query;

    const query = knex('courts')
      .select('courts.*');

    if (name) {
      query.where('name', 'like', `%${name}%`);
    }

    const courts = await query;

    return res.json(courts);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { userId } = req;

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ id, user_id: userId });

    if (!court) { 
      return res.status(404).json({ message: 'Court does not exist'})
    }

    await knex('courts').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CourtController();
