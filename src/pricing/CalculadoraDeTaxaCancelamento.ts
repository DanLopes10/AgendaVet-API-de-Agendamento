const MS_POR_MINUTO = 60_000;
const MINUTOS_POR_HORA = 60;

const LIMITE_SEM_TAXA_MIN = 24 * MINUTOS_POR_HORA;
const LIMITE_TAXA_MEDIA_MIN = 2 * MINUTOS_POR_HORA;

const TAXA_NENHUMA = 0;
const TAXA_MEDIA = 0.3;
const TAXA_ALTA = 0.5;
const TAXA_TOTAL = 1;
const FATOR_PLANO_PET = 0.5;

export class CalculadoraDeTaxaCancelamento {
  calcular(
    valor: number,
    inicio: Date,
    momentoCancelamento: Date,
    planoPetMais: boolean,
  ): number {
    if (valor <= 0) {
      throw new Error('Valor inválido');
    }

    const antecedenciaMin = (inicio.getTime() - momentoCancelamento.getTime()) / MS_POR_MINUTO;
    const fator = planoPetMais ? FATOR_PLANO_PET : 1;
    const taxa = valor * this.percentual(antecedenciaMin) * fator;

    return Math.round(taxa * 100) / 100;
  }

  private percentual(antecedenciaMin: number): number {
    if (antecedenciaMin >= LIMITE_SEM_TAXA_MIN) return TAXA_NENHUMA;
    if (antecedenciaMin >= LIMITE_TAXA_MEDIA_MIN) return TAXA_MEDIA;
    if (antecedenciaMin > 0) return TAXA_ALTA;
    return TAXA_TOTAL;
  }
}
