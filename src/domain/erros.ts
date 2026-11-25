export class ConsultaNaoEncontradaError extends Error {
  constructor(id: number) {
    super(`Consulta não encontrada: ${id}`);
    this.name = 'ConsultaNaoEncontradaError';
  }
}

export class ConsultaJaCanceladaError extends Error {
  constructor(id: number) {
    super(`Consulta já cancelada: ${id}`);
    this.name = 'ConsultaJaCanceladaError';
  }
}