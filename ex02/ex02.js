// Exercício 02: Conta de luz
// Conteúdos: switch (cases agrupados), parâmetro padrão e tipos literais.
// ---------- Elementos da página ----------
const campoConsumo = document.getElementById('consumo');
const campoTipo = document.getElementById('tipo');
const campoBandeira = document.getElementById('bandeira');
const botao = document.getElementById('calcular');
const saida = document.getElementById('resultado');
// Nome da bandeira como aparece na linha do resultado
const NOME_BANDEIRA = {
    verde: 'verde',
    amarela: 'amarela',
    vermelha1: 'vermelha (patamar 1)',
    vermelha2: 'vermelha (patamar 2)',
};
// ---------- Regras de negócio ----------
/** Tarifa em R$ por kWh. Os dois cases seguidos compartilham o mesmo bloco. */
function tarifaPorKwh(tipo) {
    switch (tipo) {
        case 'residencial':
        case 'rural':
            return 0.8;
        case 'comercial':
        case 'industrial':
            return 0.95;
    }
}
/** Adicional da bandeira em R$. Se a bandeira não for informada, vale 'verde'. */
function adicionalBandeira(consumo, bandeira = 'verde') {
    switch (bandeira) {
        case 'verde':
            return 0;
        case 'amarela':
            return consumo * 0.02;
        case 'vermelha1':
            return consumo * 0.04;
        case 'vermelha2':
            return consumo * 0.08;
    }
}
/** Mensagem exibida para cada bandeira. As duas vermelhas dividem o mesmo bloco. */
function mensagemBandeira(bandeira) {
    switch (bandeira) {
        case 'verde':
            return 'Condições favoráveis de geração de energia.';
        case 'amarela':
            return 'Condições de geração menos favoráveis.';
        case 'vermelha1':
        case 'vermelha2':
            return 'Condições mais caras de geração. Economize!';
        default:
            return 'Bandeira desconhecida.';
    }
}
// Teste do parâmetro padrão: chamando sem a bandeira, o resultado é 0.
// Motivo: o parâmetro 'bandeira' assume o valor padrão 'verde', que não cobra adicional.
console.log(adicionalBandeira(100)); // 0
// ---------- Página ----------
function calcularConta() {
    const consumo = campoConsumo.valueAsNumber;
    // Retorno antecipado. O ! também pega o campo vazio (NaN).
    if (!(consumo > 0)) {
        saida.className = 'erro';
        saida.textContent = 'Informe um consumo válido';
        return;
    }
    // Conversão do texto do <select> para o tipo literal
    const tipo = campoTipo.value;
    const bandeira = campoBandeira.value;
    const energia = consumo * tarifaPorKwh(tipo);
    const adicional = adicionalBandeira(consumo, bandeira);
    const total = energia + adicional;
    saida.className = bandeira !== 'verde' ? 'alerta' : 'sucesso';
    saida.textContent =
        `Energia: R$ ${energia.toFixed(2)}\n` +
            `Bandeira ${NOME_BANDEIRA[bandeira]}: R$ ${adicional.toFixed(2)}\n` +
            `Total: R$ ${total.toFixed(2)}\n` +
            mensagemBandeira(bandeira);
}
botao.addEventListener('click', calcularConta);
export {};
//# sourceMappingURL=ex02.js.map