const { client, createTables, createCustomer,
    createResturant,
    fetchCustomers,
    fetchResturants, createReservation, fetchReservations, destroyReservation } = require('./db');
const express = require('express');
const app = express();


app.get('/api/customers', async(req, res, next)=> {
    try {
      res.send(await fetchCustomers());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/resturants', async(req, res, next)=> {
    try {
      res.send(await fetchResturants());
    }
    catch(ex){
      next(ex);
    }
  });
  
  app.get('/api/reservations', async(req, res, next)=> {
    try {
      res.send(await fetchReservations());
    }
    catch(ex){
      next(ex);
    }
  });

  app.delete('/api/reservations/:id', async(req, res, next)=> {
    try {
      await destroyReservation(req.params.id);
      res.sendStatus(204);
    }
    catch(ex){
      next(ex);
    }
  });

  app.post('/api/reservations', async(req, res, next)=> {
    try {
      res.status(201).send(await createReservation(req.body));
    }
    catch(ex){
      next(ex);
    }
  });









const init = async()=> {
  await client.connect();
  console.log('connected to database');
  await createTables();
  console.log('tables created');
  const [jo, bow, ron, fridays, burgar7, burgar21, nandos] = await Promise.all([
    createCustomer('jo'),
    createCustomer('bow'),
    createCustomer('ron'),
    createResturant('fridays'),
    createResturant('burgar7'),
    createResturant('burgar21'),
    createResturant('nandos')
  ]);
  console.log(`jo has an id of ${jo.id}`);
  console.log(`fridays has an id of ${fridays.id}`);
  console.log(await fetchCustomers());
  console.log(await fetchResturants());
  await Promise.all([
    createReservation({ customer_id: jo.id, resturant_id: nandos.id, party_count: '4', date: '04/01/2024'}),
    createReservation({ customer_id: jo.id, resturant_id: burgar21.id, party_count: '2', date: '04/15/2024'}),
    createReservation({ customer_id: bow.id, resturant_id: fridays.id, party_count: '5', date: '07/04/2024'}),
    createReservation({ customer_id: ron.id, resturant_id: burgar7.id, party_count: '9', date: '10/31/2024'}),
  ]);
  const reservations =  await fetchReservations();
  console.log(reservations);
  await destroyReservation(reservations[0].id);
  console.log(await fetchReservations());

  const port = 8000;
  app.listen(port, ()=> console.log(`listening on port ${port}`));
};

init();
