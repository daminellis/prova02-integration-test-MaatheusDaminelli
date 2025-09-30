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
        firstname: 'joao',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'lanche'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        bookingid: /\d+/,
        booking: {
          firstname: 'joao',
          lastname: 'Brown',
          totalprice: 111,
          depositpaid: true,
          bookingdates: {
            checkin: '2018-01-01',
            checkout: '2019-01-01'
          },
          additionalneeds: 'lanche'
        }
      })
      .stores('createdBookingId', 'bookingid');
  });
});

describe('Restful-booker API - Atualizar Reserva', () => {
  it('Deve atualizar uma reserva existente', async () => {
    await spec()
      .put(`${baseUrl}/booking/$S{createdBookingId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cookie': 'token=$S{authToken}'
      })
      .withBody({
        firstname: 'joze',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'lanche'
      })
      .expectStatus(StatusCodes.OK)
      .expectJsonLike({
        firstname: 'joze',
        lastname: 'Brown',
        totalprice: 111,
        depositpaid: true,
        bookingdates: {
          checkin: '2018-01-01',
          checkout: '2019-01-01'
        },
        additionalneeds: 'lanche'
      });
  });
});

describe('Restful-booker API - Deletar Reserva', () => {
  it('Deve deletar uma reserva existente', async () => {
    await spec()
      .delete(`${baseUrl}/booking/$S{createdBookingId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Cookie': 'token=$S{authToken}'
      })
      .expectStatus(StatusCodes.CREATED);
  });
});

describe('Restful-booker API - Deletar Reserva', () => {
  it('Deve deletar uma reserva existente', async () => {
    await spec()
      .delete(`${baseUrl}/booking/$S{createdBookingId}`)
      .withHeaders({
        'Content-Type': 'application/json',
        'Cookie': 'token=$S{authToken}'
      })
      .expectStatus(StatusCodes.CREATED);
  });
});

describe('Restful-booker API - Forçar Erros', () => {
  it('Deve retornar erro ao tentar deletar uma reserva sem autenticação', async () => {
    await spec()
      .delete(`${baseUrl}/booking/$S{createdBookingId}`)
      .withHeaders({
        'Content-Type': 'application/json'
      })
      .expectStatus(StatusCodes.FORBIDDEN);
  });

  it('Deve retornar erro ao tentar atualizar uma reserva com ID inválido', async () => {
    await spec()
      .put(`${baseUrl}/booking/999999999`) 
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
      .expectStatus(StatusCodes.METHOD_NOT_ALLOWED);
  });
});