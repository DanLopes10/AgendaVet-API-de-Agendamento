import { TipoAtendimento } from '../domain/TipoAtendimento';
import { RegraDePreco } from './RegraDePreco';
import { DescontoPlanoPet } from './DescontoPlanoPet';

export class CalculadoraDePreco {
  constructor(private readonly regras: RegraDePreco[]) {}

  calcular(tipo: TipoAtendimento, planoPetMais: boolean = false): number {
    const regra = this.regras.find(r => r.tipo === tipo);
    if (!regra) {
      throw new Error(`Tipo de atendimento não suportado: ${tipo}`);
    }
    const regraFinal = planoPetMais ? new DescontoPlanoPet(regra) : regra;
    return regraFinal.calcular();
  }
}
