import { CalculadoraDePreco } from './CalculadoraDePreco';
import { PrecoConsulta, PrecoVacina, PrecoCirurgia, PrecoBanhoTosa } from './regras';
import { TipoAtendimento } from '../domain/TipoAtendimento';

describe('CalculadoraDePreco', () => {
  const calc = new CalculadoraDePreco([
    new PrecoConsulta(),
    new PrecoVacina(),
    new PrecoCirurgia(),
    new PrecoBanhoTosa(),
  ]);

  it.each([
    [TipoAtendimento.CONSULTA, 120],
    [TipoAtendimento.VACINA, 80],
    [TipoAtendimento.CIRURGIA, 540],
    [TipoAtendimento.BANHO_TOSA, 65],
  ])('cobra o preço cheio de %s (R$ %d)', (tipo, esperado) => {
    expect(calc.calcular(tipo)).toBe(esperado);
  });

  it('aplica 20% de desconto do Plano Pet+ mantendo o tipo da regra', () => {
    expect(calc.calcular(TipoAtendimento.CIRURGIA, true)).toBe(432);
  });

  it('lança erro para tipo sem regra registrada', () => {
    const semBanho = new CalculadoraDePreco([new PrecoConsulta()]);
    expect(() => semBanho.calcular(TipoAtendimento.BANHO_TOSA)).toThrow('Tipo de atendimento não suportado');
  });
});
