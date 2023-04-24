const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class LeadController {
  async store(req, res) {
    const { email, phone, notify } = req.body;
    
    const schema = Yup.object().shape({
      email: Yup.string().email().required(),
      phone: Yup.string().required(),
      notify: Yup.boolean().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [leadExists] = await knex('lead')
      .select('lead.*')
      .where({ 'lead.email': email, 'lead.phone': phone });

    if (leadExists) {
      return res.status(403).json({ error: 'Lead already exists' });
    }

    const lead = {
      id: uuidV4(),
      email,
      phone,
      notify
    };

    await knex('lead').insert(lead, 'id');

    return res.json(lead);
  }

  async list(req, res) {
    const { email, phone, notify } = req.query;

    const query = knex('lead')
      .select('lead.*');

    if (phone) {
      query.where({ phone });
    }

    if (email) {
      query.where({ email });
    }

    if (notify) {
      query.where({ notify });
    }

    const leads = await query;

    return res.json(leads);
  }

  async destroy(req, res) {
    const { id } = req.params;

    const [lead] = await knex('lead')
      .select('lead.*')
      .where({ id });

    if (!lead) { 
      return res.status(404).json({ message: 'lead does not exist'})
    }

    await knex('lead').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new LeadController();
