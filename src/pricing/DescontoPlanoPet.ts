import { RegraDePreco } from './RegraDePreco';

const FATOR_DESCONTO_PLANO = 0.8; // 20% de desconto

export class DescontoPlanoPet implements RegraDePreco {
  constructor(private readonly regraOriginal: RegraDePreco) {}

  get tipo() {
    return this.regraOriginal.tipo;
  }

  calcular(): number {
    return Math.round(this.regraOriginal.calcular() * FATOR_DESCONTO_PLANO * 100) / 100;
  }
}
