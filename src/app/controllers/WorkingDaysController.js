const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class WorkingDaysController {
  async store(req, res) {
    const { userId } = req;
    const { court_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;
    
    const schema = Yup.object().shape({
      court_id: Yup.string().required(),
      sunday: Yup.boolean(),
      monday: Yup.boolean(),
      tuesday: Yup.boolean(),
      wednesday: Yup.boolean(),
      thursday: Yup.boolean(),
      friday: Yup.boolean(),
      saturday: Yup.boolean()
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

    const [workingDaysExists] = await knex('working-days')
      .select('working-days.*')
      .where({ 'working-days.court_id': court_id });

    if (workingDaysExists) {
      return res.status(403).json({ error: 'Working Days already exists' });
    }

    const now = new Date();

    const workingDays = {
      id: uuidV4(),
      court_id,
      sunday,
      monday,
      tuesday,
      wednesday,
      thursday,
      friday,
      saturday,
      created_at: now,
      updated_at: now
    };

    await knex('working-days').insert(workingDays, 'id');

    return res.json(workingDays);
  }

  async update(req, res) {
    const { id } = req.params;
    const { userId } = req;
    const { court_id, sunday, monday, tuesday, wednesday, thursday, friday, saturday } = req.body;

    const schema = Yup.object().shape({
      court_id: Yup.string().required(),
      sunday: Yup.boolean(),
      monday: Yup.boolean(),
      tuesday: Yup.boolean(),
      wednesday: Yup.boolean(),
      thursday: Yup.boolean(),
      friday: Yup.boolean(),
      saturday: Yup.boolean()
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

    const [workingDaysExists] = await knex('working-days')
      .select('working-days.*')
      .where({ 'working-days.id': id });

    if (!workingDaysExists) {
      return res.status(404).json({ error: 'Working Days does not exist' });
    }

    if (workingDaysExists.court_id !== court_id) {
      return res.status(401).json({ error: 'Courts dont match' });
    }
    
    const workingDays = {
      id,
      court_id,
      sunday: sunday ? sunday : !!workingDaysExists.sunday,
      monday: monday ? monday : !!workingDaysExists.monday,
      tuesday: tuesday ? tuesday : !!workingDaysExists.tuesday,
      wednesday: wednesday ? wednesday : !!workingDaysExists.wednesday,
      thursday: thursday ? thursday : !!workingDaysExists.thursday,
      friday: friday ? friday : !!workingDaysExists.friday,
      saturday: saturday ? saturday : !!workingDaysExists.saturday,
      created_at: workingDaysExists.created_at,
      updated_at: new Date()
    };

    await knex('working-days').update(workingDays).where({ id });

    return res.json(workingDays);
  }

  async list(req, res) {
    const { court_id } = req.params;

    let [workingDays] = await knex('working-days')
      .select('working-days.*')
      .where({ 'working-days.court_id': court_id });

    if (!workingDays) {
      return res.status(404).json({ error: 'Working days not found'});
    }

    workingDays = {
      id: workingDays.id,
      court_id: workingDays.court_id,
      sunday: !!workingDays.sunday,
      monday: !!workingDays.monday,
      tuesday: !!workingDays.tuesday,
      wednesday: !!workingDays.wednesday,
      thursday: !!workingDays.thursday,
      friday: !!workingDays.friday,
      saturday: !!workingDays.saturday,
      created_at: workingDays.created_at,
      updated_at: workingDays.updated_at
    };

    return res.json(workingDays);
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
    
    const [workingDays] = await knex('working-days')
      .select('working-days.*')
      .where({ id });

    if (!workingDays) { 
      return res.status(404).json({ message: 'Working Days does not exist'})
    }

    await knex('working-days').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new WorkingDaysController();
