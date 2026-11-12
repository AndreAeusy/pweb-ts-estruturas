// Exercício 03: Simulador de parcelamento
// Conteúdos: for, break, continue e parâmetro opcional.
// ---------- Elementos da página ----------
const campoPreco = document.getElementById('preco');
const campoEntrada = document.getElementById('entrada');
const botao = document.getElementById('simular');
const saida = document.getElementById('resultado');
const corpoTabela = document.getElementById('parcelas');
// ---------- Regras de negócio ----------
/** Até 3 parcelas não tem juros. A partir de 4, juros compostos de 2% ao mês. */
function calcularTotal(valor, parcelas) {
    if (parcelas <= 3) {
        return valor;
    }
    return valor * 1.02 ** parcelas;
}
/**
 * Monta as linhas <tr> da tabela de parcelamento.
 * 'entrada' é opcional: se não vier, o valor financiado é o preço todo.
 */
function simularParcelamento(preco, entrada) {
    // typeof evita usar um valor 'undefined' na conta
    const financiado = typeof entrada !== 'undefined' ? preco - entrada : preco;
    let linhas = '';
    for (let parcelas = 1; parcelas <= 12; parcelas++) {
        // A loja não oferece 7, 8, 9 e 11 parcelas: pula para a próxima volta
        if (parcelas === 7 || parcelas === 8 || parcelas === 9 || parcelas === 11) {
            continue;
        }
        const total = calcularTotal(financiado, parcelas);
        const valorParcela = total / parcelas;
        // Parcela mínima de R$ 50,00: as opções acabam, então encerra o laço
        if (valorParcela < 50) {
            break;
        }
        const juros = parcelas <= 3 ? 'sem juros' : '2% a.m.';
        linhas +=
            `<tr><td>${parcelas}x</td>` +
                `<td>R$ ${valorParcela.toFixed(2)}</td>` +
                `<td>R$ ${total.toFixed(2)}</td>` +
                `<td>${juros}</td></tr>`;
    }
    return linhas;
}
// ---------- Página ----------
function simular() {
    const preco = campoPreco.valueAsNumber;
    corpoTabela.innerHTML = ''; // limpa a simulação anterior
    if (!(preco > 0)) {
        saida.className = 'erro';
        saida.textContent = 'Informe um preço válido';
        return;
    }
    let financiado;
    let linhas;
    if (campoEntrada.value.trim() === '') {
        // Campo vazio: chama sem o segundo argumento
        financiado = preco;
        linhas = simularParcelamento(preco);
    }
    else {
        const entrada = campoEntrada.valueAsNumber;
        if (!(entrada >= 0)) {
            saida.className = 'erro';
            saida.textContent = 'Informe uma entrada válida';
            return;
        }
        if (entrada >= preco) {
            saida.className = 'sucesso';
            saida.textContent = 'A entrada cobre o valor total. Não há parcelas.';
            return;
        }
        financiado = preco - entrada;
        linhas = simularParcelamento(preco, entrada);
    }
    if (linhas === '') {
        saida.className = 'alerta';
        saida.textContent = `Valor financiado: R$ ${financiado.toFixed(2)}\nValor abaixo da parcela mínima de R$ 50.00.`;
        return;
    }
    saida.className = 'sucesso';
    saida.textContent = `Valor financiado: R$ ${financiado.toFixed(2)}`;
    corpoTabela.innerHTML = linhas;
}
botao.addEventListener('click', simular);
export {};
//# sourceMappingURL=ex03.js.map