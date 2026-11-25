import { Consulta, NovaConsulta } from '../domain/Consulta';
import { IRepositorioConsultas } from '../repositories/IRepositorioConsultas';
import { CalculadoraDePreco } from '../pricing/CalculadoraDePreco';
import { INotificador } from '../notifications/INotificador';
import { ConsultaJaCanceladaError, ConsultaNaoEncontradaError } from '../domain/erros';
import { CalculadoraDeTaxaCancelamento } from '../pricing/CalculadoraDeTaxaCancelamento';

const FORMATO_TELEFONE = /^\d{10,11}$/; // só dígitos, com DDD

export class ClinicaFacade {
  constructor(
    private readonly repositorio: IRepositorioConsultas,
    private readonly calculadora: CalculadoraDePreco,
    private readonly notificador: INotificador,
  ) {}

  agendar(dados: NovaConsulta): Consulta {
    this.validar(dados);

    const valor = this.calculadora.calcular(dados.tipo, dados.planoPetMais);
    const consulta = this.repositorio.salvar({ ...dados, valor, status: 'AGENDADA' });

    this.notificador.enviar(dados.telefone, this.montarMensagem(consulta));
    return consulta;
  }

  cancelar(id: number): Consulta {
    const consulta = this.repositorio.buscarPorId(id);
    if (!consulta) {
      throw new Error(`Consulta não encontrada: ${id}`);
    }
    if (consulta.status === 'CANCELADA') {
      throw new Error(`Consulta já cancelada: ${id}`);
    }

      cancelar(id: number, agora: Date = new Date()): Consulta {
    const consulta = this.buscarPorId(id);
    if (consulta.status === 'CANCELADA') {
      throw new ConsultaJaCanceladaError(id);
    }

    const taxaCancelamento = this.calculadoraTaxa.calcular(
      consulta.valor,
      consulta.dataHora,
      agora,
      consulta.planoPetMais,
    );
    const cancelada: Consulta = { ...consulta, status: 'CANCELADA', taxaCancelamento };
    this.repositorio.atualizar(cancelada);
    return cancelada;
  }
  }

  listar(): Consulta[] {
    return this.repositorio.listar();
  }

  private validar(dados: NovaConsulta): void {
    if (!dados.tutor?.trim()) {
      throw new Error('Tutor é obrigatório');
    }
    if (!dados.pet?.trim()) {
      throw new Error('Pet é obrigatório');
    }
    if (!dados.telefone || !FORMATO_TELEFONE.test(dados.telefone)) {
      throw new Error('Telefone inválido: informe só dígitos, com DDD');
    }
    if (!(dados.dataHora instanceof Date) || Number.isNaN(dados.dataHora.getTime())) {
      throw new Error('Data e hora inválidas');
    }
  }

  private montarMensagem(consulta: Consulta): string {
    return (
      `Olá ${consulta.tutor}! A consulta do ${consulta.pet} foi agendada para ` +
      `${this.formatarDataHora(consulta.dataHora)}. Valor: R$ ${this.formatarValor(consulta.valor)}`
    );
  }

  private formatarDataHora(data: Date): string {
    const dois = (n: number) => String(n).padStart(2, '0');
    return (
      `${dois(data.getDate())}/${dois(data.getMonth() + 1)}/${data.getFullYear()} ` +
      `${dois(data.getHours())}:${dois(data.getMinutes())}`
    );
  }

  private formatarValor(valor: number): string {
    return valor.toFixed(2).replace('.', ',');
  }

    buscarPorId(id: number): Consulta {
    const consulta = this.repositorio.buscarPorId(id);
    if (!consulta) {
      throw new ConsultaNaoEncontradaError(id);
    }
    return consulta;
  }
}
