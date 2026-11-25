import express, { NextFunction, Request, Response } from 'express';
import { ClinicaFacade } from './facade/ClinicaFacade';
import { validarNovaConsulta } from './validacao';
import { ConsultaJaCanceladaError, ConsultaNaoEncontradaError } from './domain/erros';

const FORMATO_ID = /^\d+$/;

function lerId(valor: string): number | undefined {
  return FORMATO_ID.test(valor) ? Number(valor) : undefined;
}

function tratarErros(erro: unknown, _req: Request, res: Response, _next: NextFunction): void {
  if (erro instanceof ConsultaNaoEncontradaError) {
    res.status(404).json({ erro: erro.message });
    return;
  }
  if (erro instanceof ConsultaJaCanceladaError) {
    res.status(409).json({ erro: erro.message });
    return;
  }
  if (erro instanceof SyntaxError) {
    res.status(400).json({ erros: ['corpo da requisição não é um JSON válido'] });
    return;
  }
  console.error(erro);
  res.status(500).json({ erro: 'Erro interno do servidor' });
}

export function criarApp(facade: ClinicaFacade) {
  const app = express();
  app.use(express.json());

  app.post('/consultas', (req, res) => {
    const { erros, dados } = validarNovaConsulta(req.body);
    if (!dados) {
      res.status(400).json({ erros });
      return;
    }
    res.status(201).json(facade.agendar(dados));
  });

  app.get('/consultas', (_req, res) => {
    res.status(200).json(facade.listar());
  });

  app.get('/consultas/:id', (req, res) => {
    const id = lerId(req.params.id);
    if (id === undefined) {
      res.status(400).json({ erros: ['id deve ser numérico'] });
      return;
    }
    res.status(200).json(facade.buscarPorId(id));
  });

  app.delete('/consultas/:id', (req, res) => {
    const id = lerId(req.params.id);
    if (id === undefined) {
      res.status(400).json({ erros: ['id deve ser numérico'] });
      return;
    }
    res.status(200).json(facade.cancelar(id));
  });

  app.use(tratarErros);
  return app;
}
