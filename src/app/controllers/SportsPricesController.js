const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class SportsPricesController {
  async store(req, res) {
    const { court_id, sport_id } = req.params;
    const { hourly_rate, monthly_rate } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
      hourly_rate: Yup.string().required(),
      monthly_rate: Yup.string()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }
    
    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [sportExists] = await knex('sports')
      .select('sports.*')
      .where({ 'sports.id': sport_id });

    if (!sportExists) {
      return res.status(403).json({ error: 'Sport does not exists' });
    }
    
    const [sportPriceExists] = await knex('sports-prices')
      .select("sports-prices.*")
      .where({ 'sports-prices.court_id': court_id, 'sports-prices.sport_id': sport_id });

    if (sportPriceExists) {
      return res.status(401).json({ error: 'Prices already exists' });
    }

    const sportPrice = {
      id: uuidV4(),
      sport_id,
      court_id,
      hourly_rate,
      monthly_rate,
    };

    await knex('sports-prices').insert(sportPrice, 'id');

    return res.json(sportPrice);
  }

  async update(req, res) {
    const { court_id, sport_id, id } = req.params
    const { hourly_rate, monthly_rate } = req.body;
    const { userId } = req;

    const schema = Yup.object().shape({
      hourly_rate: Yup.string(),
      monthly_rate: Yup.string()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [sportExists] = await knex('sports')
      .select('sports.*')
      .where({ 'sports.id': sport_id });

    if (!sportExists) {
      return res.status(403).json({ error: 'Sport does not exists' });
    }

    const sportPrice = {
      hourly_rate,
      monthly_rate,
      updated_at: new Date()
    };

    await knex('sports-prices').update(sportPrice).where({ id });

    return res.json(sportPrice);
  }

  async list(req, res) {
    const { court_id, sport_id } = req.params;

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    const [sportExists] = await knex('sports')
      .select('sports.*')
      .where({ 'sports.id': sport_id });

    if (!sportExists) {
      return res.status(403).json({ error: 'Sport does not exists' });
    }

    const sportPrices = await knex('sports-prices')
      .select('sports-prices.*')
      .where({ 'sports-prices.sport_id': sport_id });

    return res.json(sportPrices);
  }

  async destroy(req, res) {
    const { court_id, id } = req.params;
    const { userId } = req;

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (court.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [sportPrice] = await knex('sports-prices')
      .select('sports-prices.*')
      .where({ id });

    if (!sportPrice) { 
      return res.status(404).json({ message: 'Sport prices does not exist'})
    }

    await knex('sports-prices').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new SportsPricesController();
