import { ZapLegacySDK } from './libs/zap-legacy-sdk';
import { TipoAtendimento } from './domain/TipoAtendimento';
import { CalculadoraDePreco } from './pricing/CalculadoraDePreco';
import { PrecoConsulta, PrecoVacina, PrecoCirurgia } from './pricing/regras';
import { RepositorioEmMemoria } from './repositories/RepositorioEmMemoria';
import { ZapAdapter } from './notifications/ZapAdapter';
import { ClinicaFacade } from './facade/ClinicaFacade';


const calculadora = new CalculadoraDePreco([
  new PrecoConsulta(),
  new PrecoVacina(),
  new PrecoCirurgia(),
]);
const repositorio = new RepositorioEmMemoria();
const notificador = new ZapAdapter(new ZapLegacySDK('TOKEN-123'));

const clinica = new ClinicaFacade(repositorio, calculadora, notificador);


clinica.agendar({
  tutor: 'Danilo',
  telefone: '31999990000',
  pet: 'Thor',
  tipo: TipoAtendimento.CONSULTA,
  dataHora: new Date(2027, 0, 10, 14, 0),
  planoPetMais: false,
});

clinica.agendar({
  tutor: 'Bruno',
  telefone: '31988887777',
  pet: 'Mel',
  tipo: TipoAtendimento.VACINA,
  dataHora: new Date(2027, 0, 11, 9, 30),
  planoPetMais: true,
});

console.log(clinica.listar());
