const Yup = require('yup');
const { v4: uuidV4 } = require('uuid')

const knex = require('../../database/knex');

class CompanyController {
  async store(req, res) {
    const { name, description, cnpj, address, phone } = req.body;
    const { userId } = req;
    
    const schema = Yup.object().shape({
        name: Yup.string().required(),
        description: Yup.string(),
        cnpj: Yup.string().required(),
        address: Yup.string().required(),
        phone: Yup.string().required()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [companyExists] = await knex('company')
      .select('company.*')
      .where({ 'company.user_id': userId })
      .andWhere({ 'company.cnpj': cnpj});

    if (companyExists) {
      return res.status(403).json({ error: 'Company already exists' });
    }

    const company = {
      id: uuidV4(),
      user_id: userId,
      name,
      description,
      cnpj,
      address,
      phone
    };

    await knex('company').insert(company, 'id');

    return res.json(company);
  }

  async update(req, res) {
    const { name, description, cnpj, address, phone } = req.body;
    const { id } = req.params;
    const { userId } = req;

    const schema = Yup.object().shape({
      name: Yup.string(),
      description: Yup.string(),
      cnpj: Yup.string(),
      address: Yup.string(),
      phone: Yup.string()
    });

    if (!await schema.isValid(req.body)) {
      return res.status(400).json({ error: 'Validation failed' });
    }

    const [companyExists] = await knex('company')
      .select('company.*')
      .where({ 'company.id': id });

    if (!companyExists) {
      return res.status(404).json({ error: 'Company does not exist' });
    }

    if (companyExists.user_id !== userId) {
      return res.status(403).json({ message: 'You can not do this operation'});
    }

    const company = {
      name,
      description,
      cnpj,
      address,
      phone,
      user_id: userId,
      created_at: companyExists.created_at,
      updated_at: new Date()
    };

    await knex('company').update(company).where({ id });

    return res.json({
      id,
      ...company,
    });
  }

  async list(req, res) {
    const { name } = req.query;

    const query = knex('company')
      .select('company.*');

    if (name) {
      query.where('name', 'like', `%${name}%`);
    }

    const company = await query;

    return res.json(company);
  }

  async destroy(req, res) {
    const { id } = req.params;
    const { userId } = req;

    const [company] = await knex('company')
      .select('company.*')
      .where({ id, user_id: userId });

    if (!company) { 
      return res.status(404).json({ message: 'Company does not exist'})
    }

    await knex('company').where({ id }).delete();

    return res.sendStatus(204);
  }
}

module.exports = new CompanyController();