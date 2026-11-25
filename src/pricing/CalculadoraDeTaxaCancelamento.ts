export class CalculadoraDeTaxaCancelamento {
  calcular(
    valor: number,
    inicio: Date,
    momentoCancelamento: Date,
    planoPetMais: boolean,
  ): number {
        const antecedenciaMin = (inicio.getTime() - momentoCancelamento.getTime()) / 60_000;

    if (antecedenciaMin >= 24 * 60) {
      return 0;
    }
    if (antecedenciaMin >= 2 * 60) {
      return valor * 0.3;
    }
    return valor * 0.5;
    return 0;
  }
}
