import { ZapLegacySDK } from './libs/zap-legacy-sdk';
import { CalculadoraDePreco } from './pricing/CalculadoraDePreco';
import { PrecoConsulta, PrecoVacina, PrecoCirurgia, PrecoBanhoTosa } from './pricing/regras';
import { RepositorioEmMemoria } from './repositories/RepositorioEmMemoria';
import { ZapAdapter } from './notifications/ZapAdapter';
import { ClinicaFacade } from './facade/ClinicaFacade';

export function montarFacade(): ClinicaFacade {
  const calculadora = new CalculadoraDePreco([
    new PrecoConsulta(),
    new PrecoVacina(),
    new PrecoCirurgia(),
    new PrecoBanhoTosa(),
  ]);
  const repositorio = new RepositorioEmMemoria();
  const notificador = new ZapAdapter(new ZapLegacySDK('TOKEN-123'));

  return new ClinicaFacade(repositorio, calculadora, notificador);
}
