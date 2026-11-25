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
    const antecedenciaMin = (inicio.getTime() - momentoCancelamento.getTime()) / 60_000;

    let taxa: number;
    if (antecedenciaMin >= 24 * 60) {
      taxa = 0;
    } else if (antecedenciaMin >= 2 * 60) {
      taxa = valor * 0.3;
    } else if (antecedenciaMin > 0) {
      taxa = valor * 0.5;
    } else {
      taxa = valor;
    }

    if (planoPetMais) {
      taxa = taxa * 0.5;
    }
    return Math.round(taxa * 100) / 100;
  }
}