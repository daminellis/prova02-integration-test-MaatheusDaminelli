import { spec } from 'pactum';
import { StatusCodes } from 'http-status-codes';

const baseUrl = 'https://restful-booker.herokuapp.com';

describe('Restful-booker API - Autenticação', () => {
  it('Deve criar um token de autenticação', async () => {
    await spec()
      .post(`${baseUrl}/auth`)
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .withBody({
        username: 'admin',
        password: 'password123'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({ token: /\w+/ })
      .stores('authToken', 'token');
  });
});

describe('Restful-booker API - Buscar IDs de Reservas', () => {
  it('Deve retornar todos os IDs de reservas disponíveis', async () => {
    await spec()
      .get(`${baseUrl}/booking`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike([{ bookingid: /\d+/ }])
      .stores('firstBookingId', '[0].bookingid');
  });
});

describe('Restful-booker API - Buscar Detalhes da Reserva', () => {
  it('Deve retornar os detalhes da primeira reserva encontrada', async () => {
    await spec()
      .get(`${baseUrl}/booking/$S{firstBookingId}`)
      .withHeaders({
        'Accept': 'application/json'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        firstname: /\w+/,
        lastname: /\w+/,
        totalprice: /\d+/,
        depositpaid: true, // ou false, dependendo do valor esperado
        bookingdates: {
          checkin: /\d{4}-\d{2}-\d{2}/,
          checkout: /\d{4}-\d{2}-\d{2}/
      }
    });
  });
});

describe('Restful-booker API - Criar Reserva', () => {
  it('Deve criar uma nova reserva', async () => {
    await spec()
      .post(`${baseUrl}/booking`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      })
      .withBody({
        firstname: 'Jim',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'Breakfast'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        bookingid: /\d+/,
        booking: {
          firstname: 'Jim',
          lastname: 'Brown',
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: '2018-01-01',
            checkout: '2019-01-01'
          },
          additionalneeds: 'Breakfast'
        }
      })
      .stores('createdBookingId', 'bookingid');
  });
});

describe('Restful-booker API - Atualizar Reserva', () => {
  it('Deve atualizar uma reserva existente', async () => {
    await spec()
      .put(`${baseUrl}/booking/{createdBookingId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'token=$S{authToken}'
      })
      .withBody({
        firstname: 'James',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'Breakfast'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        firstname: 'James',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'Breakfast'
      });
  });
});