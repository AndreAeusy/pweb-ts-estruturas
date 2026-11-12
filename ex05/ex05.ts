// Exercício 05: Caixa do mercado (projeto integrador)
// Conteúdos: parâmetros rest, sobrecarga de funções, switch, for, break, continue,
// tipo de função e todos os anteriores.

// ---------- Tipo de função ----------
type Formatador = (valor: number) => string;

// ---------- Elementos da página ----------
const areaItens = document.getElementById('itens') as HTMLTextAreaElement;
const campoCupom = document.getElementById('cupom') as HTMLInputElement;
const campoFidelidade = document.getElementById('fidelidade') as HTMLInputElement;
const botao = document.getElementById('fechar') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const MAX_ITENS = 20;
const PERCENTUAL_FIDELIDADE = 5;

const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

/** Arredonda para centavos, evitando erros de ponto flutuante (ex.: 99.99999999999999). */
function arredondar(valor: number): number {
  return Math.round(valor * 100) / 100;
}

// ---------- Regras de negócio ----------

/**
 * Lê um preço por linha. Aceita ponto ou vírgula.
 * Linhas vazias são ignoradas sem contar; linhas inválidas são ignoradas e contadas.
 * Para em MAX_ITENS preços.
 */
function lerPrecos(texto: string): { precos: number[]; ignorados: number } {
  const linhas: string[] = texto.split('\n');
  const precos: number[] = [];
  let ignorados = 0;

  for (let i = 0; i < linhas.length; i++) {
    const linha: string = linhas[i].trim();

    // Linha vazia: pula sem contar
    if (linha === '') {
      continue;
    }

    const valor: number = Number(linha.replace(',', '.'));

    // Não é número ou é menor ou igual a zero: pula e conta
    if (!Number.isFinite(valor) || valor <= 0) {
      ignorados++;
      continue;
    }

    precos.push(valor);

    // Chegou ao limite de itens da compra: os próximos são desconsiderados
    if (precos.length === MAX_ITENS) {
      break;
    }
  }

  return { precos, ignorados };
}

/** Soma qualquer quantidade de preços (parâmetro rest). */
function somarItens(...precos: number[]): number {
  let soma = 0;
  for (const preco of precos) {
    soma += preco;
  }
  return arredondar(soma);
}

// Sobrecarga: o mesmo nome aceita um percentual (number) ou um cupom (string)
function calcularDesconto(total: number, percentual: number): number;
function calcularDesconto(total: number, cupom: string): number;
function calcularDesconto(total: number, regra: number | string): number {
  // typeof descobre qual forma foi chamada
  if (typeof regra === 'number') {
    return (total * regra) / 100;
  }

  switch (regra.trim().toUpperCase()) {
    case 'BEMVINDO':
      return (total * 10) / 100;
    case 'PROMO20':
      return (total * 20) / 100;
    case 'MENOS15':
      return total >= 100 ? 15 : 0; // só vale a partir de R$ 100,00
    default:
      return 0;
  }
}

// ---------- Página ----------

function fecharCompra(): void {
  const { precos, ignorados } = lerPrecos(areaItens.value);

  if (precos.length === 0) {
    saida.className = 'erro';
    saida.textContent = 'Nenhum item válido';
    return;
  }

  // Spread: transforma o array em argumentos separados para o parâmetro rest
  const subtotal: number = somarItens(...precos);

  const codigoCupom: string = campoCupom.value.trim();
  const descontoCupom: number =
    codigoCupom !== '' ? arredondar(calcularDesconto(subtotal, codigoCupom)) : 0;

  // A fidelidade incide sobre o valor já com o cupom
  const aposCupom: number = subtotal - descontoCupom;
  const descontoFidelidade: number = campoFidelidade.checked
    ? arredondar(calcularDesconto(aposCupom, PERCENTUAL_FIDELIDADE))
    : 0;

  const total: number = aposCupom - descontoFidelidade;

  const textoIgnorados: string =
    ignorados > 0 ? ` (${ignorados} ${ignorados === 1 ? 'linha ignorada' : 'linhas ignoradas'})` : '';

  let texto = `Itens: ${precos.length}${textoIgnorados}\n`;
  texto += `Subtotal: ${formatarReal(subtotal)}\n`;

  if (codigoCupom !== '') {
    if (descontoCupom > 0) {
      texto += `Cupom ${codigoCupom.toUpperCase()}: - ${formatarReal(descontoCupom)}\n`;
    } else {
      texto += 'Cupom inválido ou não aplicável\n';
    }
  }
  if (campoFidelidade.checked) {
    texto += `Fidelidade (${PERCENTUAL_FIDELIDADE}%): - ${formatarReal(descontoFidelidade)}\n`;
  }
  texto += `Total a pagar: ${formatarReal(total)}`;

  saida.className = 'sucesso';
  saida.textContent = texto;
}

botao.addEventListener('click', fecharCompra);
