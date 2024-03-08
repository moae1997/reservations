const pg = require('pg');
const client = new pg.Client('postgres://localhost/acme_reservations_db');
const uuid = require('uuid');

const createTables = async()=> {
    const SQL = `
  DROP TABLE IF EXISTS reservations;
  DROP TABLE IF EXISTS customers;
  DROP TABLE IF EXISTS resturants;
  
  CREATE TABLE customers(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE resturants(
    id UUID PRIMARY KEY,
    name VARCHAR(100)
  );
  CREATE TABLE reservations(
    id UUID PRIMARY KEY,
    customer_id UUID REFERENCES customers(id) NOT NULL,
    resturant_id UUID REFERENCES resturants(id) NOT NULL,
    party_count INTEGER NOT NULL,
    date DATE NOT NULL
  );
    `;
    await client.query(SQL);
};

const createCustomer = async(name)=> {
    const SQL = `
      INSERT INTO customers(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };
  
  const createResturant = async(name)=> {
    const SQL = `
      INSERT INTO resturants(id, name) VALUES($1, $2) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), name]);
    return response.rows[0];
  };

  const createReservation = async({ resturant_id, customer_id, party_count, date})=> {
    const SQL = `
      INSERT INTO reservations(id, resturant_id, customer_id, party_count, date) VALUES($1, $2, $3, $4, $5) RETURNING *
    `;
    const response = await client.query(SQL, [uuid.v4(), resturant_id, customer_id, party_count, date]);
    return response.rows[0];
  };
  
  const fetchCustomers = async()=> {
    const SQL = `
  SELECT *
  FROM customers
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const fetchResturants = async()=> {
    const SQL = `
  SELECT *
  FROM resturants
    `;
    const response = await client.query(SQL);
    return response.rows;
  };

  const fetchReservations = async()=> {
    const SQL = `
  SELECT *
  FROM reservations
    `;
    const response = await client.query(SQL);
    return response.rows;
  };
  
  const destroyReservation = async(id)=> {
    const SQL = `
  DELETE FROM reservations
  where id = $1
    `;
    await client.query(SQL, [id]);
  };
  

  module.exports = {
    client,
    createTables,
    createCustomer,
    createResturant,
    fetchCustomers,
    fetchResturants,
    createReservation,
    fetchReservations,
    destroyReservation
  };
  