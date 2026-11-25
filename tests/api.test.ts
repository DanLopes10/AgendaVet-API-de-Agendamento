import request from 'supertest';
import { criarApp } from '../src/app';
import { montarFacade } from '../src/montagem';

const MS_POR_HORA = 3_600_000;
const emHoras = (horas: number) => new Date(Date.now() + horas * MS_POR_HORA).toISOString();

describe('API /consultas', () => {
  let app: ReturnType<typeof criarApp>;

  const valida = () => ({
    tutor: 'Ana',
    telefone: '31999990000',
    pet: 'Thor',
    tipo: 'CONSULTA',
    dataHora: emHoras(72),
  });

  beforeAll(() => {
    jest.spyOn(console, 'log').mockImplementation(() => undefined); // silencia o "WhatsApp"
  });

  beforeEach(() => {
    app = criarApp(montarFacade()); // repositório novo a cada teste
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it('cria consulta e devolve 201 com valor calculado', async () => {
    const res = await request(app).post('/consultas').send(valida());
    expect(res.status).toBe(201);
    expect(res.body.valor).toBe(120);
    expect(res.body.status).toBe('AGENDADA');
  });

  it('ignora o valor e o status enviados pelo cliente', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), valor: 0, status: 'CANCELADA' });
    expect(res.status).toBe(201);
    expect(res.body.valor).toBe(120);
    expect(res.body.status).toBe('AGENDADA');
  });

  it('aplica o desconto do Plano Pet+ (R$ 96)', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), planoPetMais: true });
    expect(res.body.valor).toBe(96);
  });

  it('rejeita telefone com 9 dígitos (limite inferior - 1)', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), telefone: '319999900' });
    expect(res.status).toBe(400);
  });

  it('rejeita telefone com 12 dígitos (limite superior + 1)', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), telefone: '319999900001' });
    expect(res.status).toBe(400);
  });

  it('aceita telefone com 10 e com 11 dígitos (limites válidos)', async () => {
    const dez = await request(app).post('/consultas').send({ ...valida(), telefone: '3133334444' });
    const onze = await request(app).post('/consultas').send({ ...valida(), telefone: '31999990000' });
    expect(dez.status).toBe(201);
    expect(onze.status).toBe(201);
  });

  it('rejeita tutor com 2 caracteres e aceita com 3 (limite)', async () => {
    const curto = await request(app).post('/consultas').send({ ...valida(), tutor: 'Al' });
    const limite = await request(app).post('/consultas').send({ ...valida(), tutor: 'Ana' });
    expect(curto.status).toBe(400);
    expect(limite.status).toBe(201);
  });

  it("rejeita tipo fora do enum ('TOSA')", async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), tipo: 'TOSA' });
    expect(res.status).toBe(400);
  });

  it('rejeita data no passado', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), dataHora: emHoras(-24) });
    expect(res.status).toBe(400);
  });

  it('rejeita data em formato inválido', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), dataHora: 'amanhã' });
    expect(res.status).toBe(400);
  });

  it('rejeita planoPetMais que não é booleano', async () => {
    const res = await request(app).post('/consultas').send({ ...valida(), planoPetMais: 'sim' });
    expect(res.status).toBe(400);
  });

  it('corpo vazio devolve 400 listando vários erros', async () => {
    const res = await request(app).post('/consultas').send({});
    expect(res.status).toBe(400);
    expect(res.body.erros.length).toBeGreaterThan(1);
  });

  it('JSON malformado devolve 400 e não 500', async () => {
    const res = await request(app)
      .post('/consultas')
      .set('Content-Type', 'application/json')
      .send('{oops');
    expect(res.status).toBe(400);
  });

  it('lista as consultas criadas', async () => {
    await request(app).post('/consultas').send(valida());
    const res = await request(app).get('/consultas');
    expect(res.status).toBe(200);
    expect(res.body).toHaveLength(1);
  });

  it('GET de id existente devolve 200 com a consulta', async () => {
    const criada = await request(app).post('/consultas').send(valida());
    const res = await request(app).get(`/consultas/${criada.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.pet).toBe('Thor');
  });

  it('GET de id inexistente devolve 404', async () => {
    const res = await request(app).get('/consultas/999');
    expect(res.status).toBe(404);
  });

  it('GET de id não numérico devolve 400', async () => {
    const res = await request(app).get('/consultas/abc');
    expect(res.status).toBe(400);
  });

  it('DELETE cancela sem taxa quando há 24h ou mais de antecedência', async () => {
    const criada = await request(app).post('/consultas').send(valida());
    const res = await request(app).delete(`/consultas/${criada.body.id}`);
    expect(res.status).toBe(200);
    expect(res.body.status).toBe('CANCELADA');
    expect(res.body.taxaCancelamento).toBe(0);
  });

  it('DELETE cobra 50% quando faltam menos de 2h', async () => {
    const criada = await request(app).post('/consultas').send({ ...valida(), dataHora: emHoras(1) });
    const res = await request(app).delete(`/consultas/${criada.body.id}`);
    expect(res.body.taxaCancelamento).toBe(60);
  });

  it('DELETE duas vezes seguidas devolve 200 e depois 409', async () => {
    const criada = await request(app).post('/consultas').send(valida());
    const primeira = await request(app).delete(`/consultas/${criada.body.id}`);
    const segunda = await request(app).delete(`/consultas/${criada.body.id}`);
    expect(primeira.status).toBe(200);
    expect(segunda.status).toBe(409);
  });

  it('DELETE de id inexistente devolve 404', async () => {
    const res = await request(app).delete('/consultas/999');
    expect(res.status).toBe(404);
  });

  it('DELETE de id não numérico devolve 400', async () => {
    const res = await request(app).delete('/consultas/abc');
    expect(res.status).toBe(400);
  });
});
