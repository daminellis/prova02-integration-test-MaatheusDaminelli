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

describe('Restful-booker API - Deletar Reserva', () => {
  it('Deve deletar a reserva com sucesso', async () => {
    await spec()
      .delete(`${baseUrl}/booking/$S{firstBookingId}`)
      .withHeaders({
        'Authorization': 'Bearer $S{authToken}'
      })
      .expectStatus(StatusCodes.CREATED);
  });
});