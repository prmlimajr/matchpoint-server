const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class SportController {
  async store(req, res) {
    const { name } = req.body;
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [sportExists] = await knex('sports')
      .select('sports.*')
      .andWhere({ 'sports.name': name});

    if (sportExists) {
      return res.status(403).json({ error: 'Sport already exists' });
    }

    const now = new Date();

    const sport = {
      id: uuidV4(),
      name,
      created_at: now,
      updated_at: now
    };

    await knex('sports').insert(sport, 'id');

    return res.json(sport);
  }

  async update(req, res) {
    const { name } = req.body;
    const { id } = req.params;
    
    const schema = Yup.object().shape({
      name: Yup.string().required(),
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [sportExists] = await knex('sports')
      .select('sports.*')
      .where({ 'sports.id': id });

    if (!sportExists) {
      return res.status(404).json({ error: 'Sport does not exist' });
    }

    const sport = {
      id,
      name,
      created_at: sportExists.created_at,
      updated_at: new Date()
    };

    await knex('sports').update(sport).where({ id });

    return res.json(sport);
  }

  async list(req, res) {
    const { name } = req.query;
    
    const query = knex('sports')
      .select('sports.*');

    if (name) {
      query.andWhere('name', 'like', `%${name}%`);
    }

    const sportsList = await query;

    const sports = sportsList.map(sport => {
      return {
        id: sport.id,
        name: sport.name
      }
    })

    return res.json(sports);
  }

  async destroy(req, res) {
    const { id } = req.params;
    
    const [sport] = await knex('sports')
      .select('sports.*');
      
    if (!sport) { 
      return res.status(404).json({ message: 'Sport does not exist'})
    }

    await knex('sports').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new SportController();
