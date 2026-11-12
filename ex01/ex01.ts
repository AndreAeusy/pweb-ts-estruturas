// Exercício 01: Situação do aluno no semestre
// Conteúdos: if / else if / else, operadores lógicos, ternário e funções.

// ---------- Elementos da página ----------
const campoNome = document.getElementById('nome') as HTMLInputElement;
const campoN1 = document.getElementById('n1') as HTMLInputElement;
const campoN2 = document.getElementById('n2') as HTMLInputElement;
const campoFrequencia = document.getElementById('frequencia') as HTMLInputElement;
const botao = document.getElementById('calcular') as HTMLButtonElement;
const saida = document.getElementById('resultado') as HTMLElement;

// ---------- Regras de negócio (não mexem na página) ----------

/** Média aritmética das duas notas. */
function calcularMedia(n1: number, n2: number): number {
  return (n1 + n2) / 2;
}

/**
 * Notas de 0 a 10 e frequência de 0 a 100.
 * Campo vazio vira NaN (valueAsNumber) e qualquer comparação com NaN
 * dá false, então um campo em branco também é considerado inválido.
 */
function dadosValidos(n1: number, n2: number, frequencia: number): boolean {
  return n1 >= 0 && n1 <= 10 && n2 >= 0 && n2 <= 10 && frequencia >= 0 && frequencia <= 100;
}

/**
 * Devolve a situação do aluno.
 * A ordem importa: a frequência é testada primeiro, porque quem tem
 * menos de 75% é reprovado por falta mesmo com média alta.
 */
function situacao(media: number, frequencia: number): string {
  if (frequencia < 75) {
    return 'Reprovado por falta';
  } else if (media >= 7) {
    return 'Aprovado';
  } else if (media >= 4) {
    return `Exame final (precisa tirar ${(10 - media).toFixed(1)})`;
  } else {
    return 'Reprovado por nota';
  }
}

// ---------- Página ----------

function mostrarSituacao(): void {
  const nome: string = campoNome.value.trim() || 'Aluno(a)';
  const n1: number = campoN1.valueAsNumber;
  const n2: number = campoN2.valueAsNumber;
  const frequencia: number = campoFrequencia.valueAsNumber;

  // Retorno antecipado: dados inválidos
  if (!dadosValidos(n1, n2, frequencia)) {
    saida.className = 'erro';
    saida.textContent = 'Dados inválidos';
    return;
  }

  const media: number = calcularMedia(n1, n2);
  const resultado: string = situacao(media, frequencia);

  // Ternário: verde se aprovado, vermelho nos outros casos
  saida.className = resultado === 'Aprovado' ? 'sucesso' : 'erro';
  saida.textContent = `${nome}: média ${media.toFixed(1)}. ${resultado}`;
}

botao.addEventListener('click', mostrarSituacao);
