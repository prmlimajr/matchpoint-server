const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class BusinessHoursController {
  async store(req, res) {
    const { userId } = req;
    const { court_id, start_at, ends_at } = req.body;
    
    const schema = Yup.object().shape({
      court_id: Yup.string().required(),
      start_at: Yup.string().required(),
      ends_at: Yup.string().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [court] = await knex('courts')
      .select('courts.*')
      .where({ 'courts.id': court_id });

    const [company] = await knex('company')
      .select('company.*')
      .where({ 'company.id': court.company_id });

    if (!court) {
      return res.status(401).json({ error: 'Court does not exists'})
    }

    if (company.user_id !== userId) {
      return res.status(403).json({ error: 'You have no permission to do that' })
    }

    const [businessHoursExists] = await knex('business-hours')
      .select('business-hours.*')
      .where({ 'business-hours.court_id': court_id });

    if (businessHoursExists) {
      return res.status(403).json({ error: 'Business Hours already exists' });
    }

    const now = new Date();

    const businessHours = {
      id: uuidV4(),
      court_id,
      start_at,
      ends_at,
      created_at: now,
      updated_at: now
    };

    await knex('business-hours').insert(businessHours, 'id');

    return res.json(businessHours);
  }

  async update(req, res) {
    const { id } = req.params;
    const { userId } = req;
    const { court_id, start_at, ends_at } = req.body;
    
    const schema = Yup.object().shape({
      court_id: Yup.string().required(),
      start_at: Yup.string(),
      ends_at: Yup.string()
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

    const [businessHoursExists] = await knex('business-hours')
      .select('business-hours.*')
      .where({ 'business-hours.id': id });

    if (!businessHoursExists) {
      return res.status(404).json({ error: 'Business Hours does not exist' });
    }

    if (businessHoursExists.court_id !== court_id) {
      return res.status(401).json({ error: 'Courts dont match' });
    }
    
    const businessHours = {
      id,
      court_id,
      start_at: start_at ? start_at : businessHoursExists.start_at,
      ends_at: ends_at ? ends_at : businessHoursExists.ends_at,
      created_at: businessHoursExists.created_at,
      updated_at: new Date()
    };

    await knex('business-hours').update(businessHours).where({ id });

    return res.json(businessHours);
  }

  async list(req, res) {
    const { court_id } = req.params;

    const [businessHours] = await knex('business-hours')
      .select('business-hours.*')
      .where({ 'business-hours.court_id': court_id });

    if (!businessHours) {
      return res.status(404).json({ error: 'Business Hours not found'});
    }

    return res.json(businessHours);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { court_id } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
      court_id: Yup.string().required()
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
    
    const [businessHours] = await knex('business-hours')
      .select('business-hours.*')
      .where({ id });

    if (!businessHours) { 
      return res.status(404).json({ message: 'Business Hours does not exist'})
    }

    await knex('business-hours').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new BusinessHoursController();
