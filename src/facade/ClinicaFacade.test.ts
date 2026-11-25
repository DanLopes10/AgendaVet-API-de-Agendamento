import { ClinicaFacade } from './ClinicaFacade';
import { RepositorioEmMemoria } from '../repositories/RepositorioEmMemoria';
import { CalculadoraDePreco } from '../pricing/CalculadoraDePreco';
import { PrecoConsulta, PrecoVacina, PrecoCirurgia } from '../pricing/regras';
import { INotificador } from '../notifications/INotificador';
import { NovaConsulta } from '../domain/Consulta';
import { TipoAtendimento } from '../domain/TipoAtendimento';

describe('ClinicaFacade', () => {
  const notificador: INotificador = { enviar: jest.fn() };
  let facade: ClinicaFacade;

  const dados: NovaConsulta = {
    tutor: 'Ana',
    telefone: '31999990000',
    pet: 'Thor',
    tipo: TipoAtendimento.CONSULTA,
    dataHora: new Date('2027-01-10T14:00:00'),
    planoPetMais: false,
  };

  beforeEach(() => {
    jest.clearAllMocks();
    facade = new ClinicaFacade(
      new RepositorioEmMemoria(),
      new CalculadoraDePreco([new PrecoConsulta(), new PrecoVacina(), new PrecoCirurgia()]),
      notificador,
    );
  });

  it('notifica o tutor uma única vez ao agendar', () => {
    facade.agendar(dados);

    expect(notificador.enviar).toHaveBeenCalledTimes(1);
    expect(notificador.enviar).toHaveBeenCalledWith('31999990000', expect.stringContaining('Thor'));
  });

  it('não notifica quando os dados são inválidos', () => {
    expect(() => facade.agendar({ ...dados, tutor: '' })).toThrow();
    expect(notificador.enviar).not.toHaveBeenCalled();
  });

  it('aplica 20% de desconto do Plano Pet+ (R$ 96)', () => {
    const consulta = facade.agendar({ ...dados, planoPetMais: true });
    expect(consulta.valor).toBe(96);
  });

  it('lança erro ao cancelar consulta inexistente', () => {
    expect(() => facade.cancelar(999)).toThrow('Consulta não encontrada');
  });

    it('cancela com taxa calculada pela antecedência', () => {
    const consulta = facade.agendar(dados);
    const umaHoraAntes = new Date(dados.dataHora.getTime() - 60 * 60_000);

    const cancelada = facade.cancelar(consulta.id, umaHoraAntes);

    expect(cancelada.status).toBe('CANCELADA');
    expect(cancelada.taxaCancelamento).toBe(60);
  });

  it('lança erro ao cancelar duas vezes a mesma consulta', () => {
    const consulta = facade.agendar(dados);
    facade.cancelar(consulta.id);
    expect(() => facade.cancelar(consulta.id)).toThrow('já cancelada');
  });
});