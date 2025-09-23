import pactum from 'pactum';
import { StatusCodes } from 'http-status-codes';
import { SimpleReporter } from '../simple-reporter';

describe('API da Loja Falsa', () => {
  const p = pactum;
  const rep = SimpleReporter;
  const baseUrl = 'https://fakestoreapi.com';

  p.request.setDefaultTimeout(30000);

  beforeAll(() => p.reporter.add(rep));
  afterAll(() => p.reporter.end());

  describe('PRODUTOS', () => {
    it('Obter todos os produtos', async () => {
        const response = await p
          .spec()
          .get(`${baseUrl}/products`)
          .toss();
      });
  });
});