import { Consulta } from '../domain/Consulta';
import { IRepositorioConsultas } from './IRepositorioConsultas';

export class RepositorioEmMemoria implements IRepositorioConsultas {
  private readonly consultas = new Map<number, Consulta>();
  private proximoId = 1;

  salvar(consulta: Omit<Consulta, 'id'>): Consulta {
    const nova: Consulta = { ...consulta, id: this.proximoId++ };
    this.consultas.set(nova.id, nova);
    return nova;
  }

  buscarPorId(id: number): Consulta | undefined {
    return this.consultas.get(id);
  }

  atualizar(consulta: Consulta): void {
    if (!this.consultas.has(consulta.id)) {
      throw new Error(`Consulta não encontrada: ${consulta.id}`);
    }
    this.consultas.set(consulta.id, consulta);
  }

  listar(): Consulta[] {
    return Array.from(this.consultas.values());
  }
}