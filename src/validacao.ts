import { NovaConsulta } from './domain/Consulta';
import { TipoAtendimento } from './domain/TipoAtendimento';

const TAMANHO_MINIMO_TUTOR = 3;
const FORMATO_TELEFONE = /^\d{10,11}$/;
const FORMATO_ISO = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}(:\d{2}(\.\d{1,3})?)?(Z|[+-]\d{2}:\d{2})?$/;

export interface ResultadoValidacao {
  erros: string[];
  dados?: NovaConsulta;
}

function ehObjeto(valor: unknown): valor is Record<string, unknown> {
  return typeof valor === 'object' && valor !== null && !Array.isArray(valor);
}

function lerDataIso(valor: unknown): Date | undefined {
  if (typeof valor !== 'string' || !FORMATO_ISO.test(valor)) return undefined;
  const data = new Date(valor);
  return Number.isNaN(data.getTime()) ? undefined : data;
}

export function validarNovaConsulta(corpo: unknown, agora: Date = new Date()): ResultadoValidacao {
  const entrada = ehObjeto(corpo) ? corpo : {};
  const { tutor, telefone, pet, tipo, dataHora, planoPetMais } = entrada;
  const erros: string[] = [];

  if (typeof tutor !== 'string' || tutor.trim().length < TAMANHO_MINIMO_TUTOR) {
    erros.push('tutor deve ter ao menos 3 caracteres');
  }
  if (typeof pet !== 'string' || pet.trim().length === 0) {
    erros.push('pet é obrigatório');
  }
  if (typeof telefone !== 'string' || !FORMATO_TELEFONE.test(telefone)) {
    erros.push('telefone deve ter 10 ou 11 dígitos, apenas números');
  }
  if (!Object.values(TipoAtendimento).includes(tipo as TipoAtendimento)) {
    erros.push(`tipo deve ser um de: ${Object.values(TipoAtendimento).join(', ')}`);
  }

  const data = lerDataIso(dataHora);
  if (!data) {
    erros.push('dataHora deve estar em formato ISO válido (ex.: 2027-01-10T14:00:00)');
  } else if (data.getTime() <= agora.getTime()) {
    erros.push('dataHora deve estar no futuro');
  }

  if (planoPetMais !== undefined && typeof planoPetMais !== 'boolean') {
    erros.push('planoPetMais deve ser verdadeiro ou falso');
  }

  if (erros.length > 0 || !data) {
    return { erros };
  }

  // Só chega aqui se tudo é válido; copia APENAS os campos conhecidos
  // (valor, status e outros campos extras do cliente são descartados).
  return {
    erros,
    dados: {
      tutor: (tutor as string).trim(),
      telefone: telefone as string,
      pet: (pet as string).trim(),
      tipo: tipo as TipoAtendimento,
      dataHora: data,
      planoPetMais: planoPetMais === true,
    },
  };
}
