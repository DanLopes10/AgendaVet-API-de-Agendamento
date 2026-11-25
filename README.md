# AgendaVet

Projeto 1 - Engenharia de Software II

## Integrantes
- Bruno Gualberto da Silva Rocha
- Danilo Gouvea Sousa Lopes

## Como rodar
```
npm install
npm run dev
```
A API sobe em `http://localhost:3000`.

## Rotas

| Rota | Sucesso | Erros |
|---|---|---|
| `POST /consultas` | 201 + consulta | 400 `{ erros: [...] }` com todas as falhas |
| `GET /consultas` | 200 + lista | — |
| `GET /consultas/:id` | 200 + consulta | 400 id não numérico · 404 não encontrada |
| `DELETE /consultas/:id` | 200 + consulta com `taxaCancelamento` | 400 id não numérico · 404 não encontrada · 409 já cancelada |

## Testes
```
npm test
npm run test:coverage
```
O `test:coverage` falha se a cobertura de branches ficar abaixo de 80% (no total, em `src/pricing/` e em `src/facade/`).

## Cobertura

```
-----------------------------------|---------|----------|---------|---------|-------------------
File                               | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------------|---------|----------|---------|---------|-------------------
All files                          |   98.02 |     95.6 |   97.87 |   97.96 |
 src                               |   97.59 |    94.23 |     100 |   97.56 |
  app.ts                           |   95.12 |    92.85 |     100 |   95.12 | 25-26
  montagem.ts                      |     100 |      100 |     100 |     100 |
  validacao.ts                     |     100 |    94.73 |     100 |     100 | 20,24
 src/domain                        |     100 |      100 |     100 |     100 |
  TipoAtendimento.ts               |     100 |      100 |     100 |     100 |
  erros.ts                         |     100 |      100 |     100 |     100 |
 src/facade                        |     100 |      100 |     100 |     100 |
  ClinicaFacade.ts                 |     100 |      100 |     100 |     100 |
 src/notifications                 |     100 |      100 |     100 |     100 |
  ZapAdapter.ts                    |     100 |      100 |     100 |     100 |
 src/pricing                       |   98.14 |      100 |   93.75 |      98 |
  CalculadoraDePreco.ts            |     100 |      100 |     100 |     100 |
  CalculadoraDeTaxaCancelamento.ts |     100 |      100 |     100 |     100 |
  DescontoPlanoPet.ts              |      80 |      100 |   66.66 |      80 | 9
  regras.ts                        |     100 |      100 |     100 |     100 |
 src/repositories                  |    90.9 |       50 |     100 |    90.9 |
  RepositorioEmMemoria.ts          |    90.9 |       50 |     100 |    90.9 | 20
-----------------------------------|---------|----------|---------|---------|-------------------
Tests: 50 passed, 50 total
```

`src/legado/`, `src/libs/` e `src/index.ts` ficam fora da medição: o legado e a SDK não são código novo do projeto, e o `index.ts` só liga a porta.

## Docker
```
docker build -t agendavet .
docker run -p 3000:3000 agendavet
```
Depois, em outro terminal: `curl.exe http://localhost:3000/consultas` (deve responder `[]`).
