const knex = require('../../database/knex');
const { v4: uuidV4 } = require('uuid');

class AddressController {
  async store (req, res) {
    const { company_id, address, lat, lng } = req.body;

    const fullAddress = {
      id: uuidV4(),
      company_id,
      address,
      lat,
      lng
    }

    await knex('address').insert(fullAddress, 'id')

    return res.json(fullAddress)
  }
}

module.exports = new AddressController()