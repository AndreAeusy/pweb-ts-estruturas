// Exercício 04: Meta de economia
// Conteúdos: while, break, tipo de função e parâmetro padrão.

// ---------- Tipo de função ----------
type Formatador = (valor: number) => string;

// ---------- Elementos da página ----------
const campoMeta = document.getElementById('meta') as HTMLInputElement;
const campoDeposito = document.getElementById('deposito') as HTMLInputElement;
const campoTaxa = document.getElementById('taxa') as HTMLInputElement;
const botao = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

const LIMITE_MESES = 600; // 50 anos

// ---------- Funções que seguem o tipo Formatador ----------

/** 1234.5 → "R$ 1234.50" */
const formatarReal: Formatador = (valor: number): string => `R$ ${valor.toFixed(2)}`;

/** 19 → "1 ano e 7 meses", 25 → "2 anos e 1 mês", 8 → "8 meses" */
const formatarMeses: Formatador = (meses: number): string => {
  const anos: number = Math.floor(meses / 12);
  const resto: number = meses % 12;
  const textoAnos = `${anos} ${anos === 1 ? 'ano' : 'anos'}`;
  const textoMeses = `${resto} ${resto === 1 ? 'mês' : 'meses'}`;

  if (anos === 0) {
    return textoMeses;
  }
  if (resto === 0) {
    return textoAnos;
  }
  return `${textoAnos} e ${textoMeses}`;
};

// ---------- Regras de negócio ----------

interface ResultadoEconomia {
  meses: number;
  saldo: number;
  depositado: number;
}

/**
 * Simula mês a mês. Primeiro o saldo rende, depois entra o depósito.
 * Todo mês 12, 24, 36... o depósito é dobrado (13º salário).
 * 'taxa' é em % ao mês e vale 0,5 se não for informada.
 */
function calcularMeses(meta: number, deposito: number, taxa: number = 0.5): ResultadoEconomia {
  let saldo = 0;
  let meses = 0;
  let depositado = 0;

  while (saldo < meta) {
    meses++;
    const valorDeposito: number = meses % 12 === 0 ? deposito * 2 : deposito;
    saldo = saldo * (1 + taxa / 100) + valorDeposito;
    depositado += valorDeposito;

    // Meta inalcançável: para depois de 600 meses
    if (meses === LIMITE_MESES) {
      break;
    }
  }

  return { meses, saldo, depositado };
}

/** Monta uma linha "rótulo: valor" usando a função de formatação recebida. */
function exibirValor(rotulo: string, valor: number, formatar: Formatador): string {
  return `${rotulo}: ${formatar(valor)}`;
}

// ---------- Página ----------

function calcular(): void {
  const meta: number = campoMeta.valueAsNumber;
  const deposito: number = campoDeposito.valueAsNumber;

  if (!(meta > 0) || !(deposito > 0)) {
    saida.className = 'erro';
    saida.textContent = 'Informe valores positivos';
    return;
  }

  // Rendimento em branco: chama sem o terceiro argumento (vale o padrão 0,5)
  const resultado: ResultadoEconomia =
    campoTaxa.value.trim() === ''
      ? calcularMeses(meta, deposito)
      : calcularMeses(meta, deposito, campoTaxa.valueAsNumber);

  const { meses, saldo, depositado } = resultado;

  if (saldo < meta) {
    saida.className = 'erro';
    saida.textContent =
      'Meta inalcançável em 50 anos.\n' +
      exibirValor(`Saldo após ${LIMITE_MESES} meses`, saldo, formatarReal);
    return;
  }

  const textoMeses = `${meses} ${meses === 1 ? 'mês' : 'meses'}`;
  const detalhe: string = meses >= 12 ? ` (${formatarMeses(meses)})` : '';

  saida.className = 'sucesso';
  saida.textContent =
    `Você atinge a meta em ${textoMeses}${detalhe}.\n` +
    exibirValor('Saldo final', saldo, formatarReal) + '\n' +
    exibirValor('Total depositado', depositado, formatarReal) + '\n' +
    exibirValor('Rendimento', saldo - depositado, formatarReal);
}

botao.addEventListener('click', calcular);
