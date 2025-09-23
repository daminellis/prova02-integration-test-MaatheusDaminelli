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

  describe('PRODUTOS', () => {
    it('Obter produto específico pelo ID', async () => {
        const response = await p
        .spec()
        .get(`${baseUrl}/products/1`)
        .withHeaders('User-Agent', 'pactum-test')
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          id: 1,
          title: /.+/, // Verifica se o título não está vazio
          price: /.+/, // Verifica se o preço não está vazio
          category: /.+/, // Verifica se a categoria não está vazia
        });
    });
  });

  describe('PRODUTOS', () => {
    it('Criar um novo produto', async () => {
        await p
        .spec()
        .post(`${baseUrl}/products`)
        .withHeaders('Content-Type', 'application/json')
        .withJson({
          title: 'Produto de Teste',
          price: 99.99,
          description: 'Descrição do produto de teste',
          image: 'https://i.pravatar.cc',
          category: 'electronics'
        })
        .expectStatus(StatusCodes.OK)
        .expectJsonLike({
          title: 'Produto de Teste',
          price: 99.99,
          category: 'electronics'
        });
    });
  });

});