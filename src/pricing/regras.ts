import { TipoAtendimento } from '../domain/TipoAtendimento';
import { RegraDePreco } from './RegraDePreco';

export class PrecoConsulta implements RegraDePreco {
  private static readonly VALOR = 120;
  readonly tipo = TipoAtendimento.CONSULTA;

  calcular(): number {
    return PrecoConsulta.VALOR;
  }
}

export class PrecoVacina implements RegraDePreco {
  private static readonly VALOR = 80;
  readonly tipo = TipoAtendimento.VACINA;

  calcular(): number {
    return PrecoVacina.VALOR;
  }
}

export class PrecoCirurgia implements RegraDePreco {
  private static readonly VALOR = 540;
  readonly tipo = TipoAtendimento.CIRURGIA;

  calcular(): number {
    return PrecoCirurgia.VALOR;
  }
}