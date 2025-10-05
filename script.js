// Classe principal para gerenciar as vendas e cálculos
class LucroCalculator {
    constructor() {
        // Array para armazenar as vendas (cada venda é um objeto com venda, taxa, custo e lucro)
        this.sales = JSON.parse(localStorage.getItem('sales')) || [];
        
        // Elementos do DOM
        this.form = document.getElementById('saleForm');
        this.salesList = document.getElementById('salesList');
        this.totalProfitElement = document.getElementById('totalProfit');
        this.clearButton = document.getElementById('clearAll');
        
        // Inicialização
        this.init();
    }

    // Método de inicialização: configura event listeners
    init() {
        // Listener para adicionar nova venda
        this.form.addEventListener('submit', (e) => this.addSale(e));
        
        // Listener para limpar todas as vendas
        this.clearButton.addEventListener('click', () => this.clearAll());
        
        // Renderiza a lista inicial e o total
        this.renderSales();
        this.updateTotalProfit();
    }

    // Método para adicionar uma nova venda
    addSale(e) {
        e.preventDefault(); // Impede o reload da página
        
        // Captura os valores dos inputs
        const saleValue = parseFloat(document.getElementById('saleValue').value);
        const feeValue = parseFloat(document.getElementById('feeValue').value);
        const costValue = parseFloat(document.getElementById('costValue').value);
        
        // Validação básica: verifica se os valores são números válidos
        if (isNaN(saleValue) || isNaN(feeValue) || isNaN(costValue) || saleValue <= 0) {
            alert('Por favor, insira valores válidos para todos os campos.');
            return;
        }
        
        // Calcula o lucro: venda - taxa - custo
        const profit = saleValue - feeValue - costValue;
        
        // Cria o objeto da venda com ID único (timestamp)
        const sale = {
            id: Date.now(),
            saleValue,
            feeValue,
            costValue,
            profit
        };
        
        // Adiciona ao array de vendas
        this.sales.push(sale);
        
        // Salva no localStorage para persistência
        this.saveSales();
        
        // Limpa o formulário
        this.form.reset();
        
        // Atualiza a visualização
        this.renderSales();
        this.updateTotalProfit();
    }

    // Método para renderizar a lista de vendas no DOM
    renderSales() {
        // Limpa a lista atual
        this.salesList.innerHTML = '';
        
        // Para cada venda, cria um item na lista
        this.sales.forEach(sale => {
            const saleItem = document.createElement('div');
            saleItem.className = 'sale-item';
            saleItem.innerHTML = `
                <div class="sale-details">
                    <div class="sale-value">Venda: R$ ${this.formatCurrency(sale.saleValue)}</div>
                    <div class="sale-fee">Taxa: R$ ${this.formatCurrency(sale.feeValue)}</div>
                    <div class="sale-cost">Custo: R$ ${this.formatCurrency(sale.costValue)}</div>
                    <div class="sale-profit">Lucro: ${sale.profit >= 0 ? '+' : ''}R$ ${this.formatCurrency(Math.abs(sale.profit))}</div>
                </div>
                <button class="delete-button" onclick="app.deleteSale(${sale.id})">Excluir</button>
            `;
            this.salesList.appendChild(saleItem);
        });
        
        // Se não houver vendas, mostra uma mensagem
        if (this.sales.length === 0) {
            this.salesList.innerHTML = '<p style="text-align: center; color: #718096; padding: 20px;">Nenhuma venda registrada ainda.</p>';
        }
    }

    // Método para deletar uma venda específica pelo ID
    deleteSale(id) {
        // Filtra o array removendo a venda com o ID correspondente
        this.sales = this.sales.filter(sale => sale.id !== id);
        
        // Salva a atualização
        this.saveSales();
        
        // Atualiza a visualização
        this.renderSales();
        this.updateTotalProfit();
    }

    // Método para calcular e atualizar o lucro total
    updateTotalProfit() {
        // Soma todos os lucros
        const totalProfit = this.sales.reduce((sum, sale) => sum + sale.profit, 0);
        
        // Atualiza o elemento HTML com o total formatado
        this.totalProfitElement.innerHTML = `
            <h3>Lucro Total Acumulado</h3>
            <div class="total-profit-value">R$ ${this.formatCurrency(totalProfit)}</div>
        `;
    }

    // Método para limpar todas as vendas
    clearAll() {
        if (confirm('Tem certeza que deseja limpar todas as vendas?')) {
            this.sales = [];
            this.saveSales();
            this.renderSales();
            this.updateTotalProfit();
        }
    }

    // Método auxiliar para formatar valores em reais (com vírgula e 2 casas decimais)
    formatCurrency(value) {
        return Math.abs(value).toFixed(2).replace('.', ',');
    }

    // Método para salvar as vendas no localStorage
    saveSales() {
        localStorage.setItem('sales', JSON.stringify(this.sales));
    }
}

// Inicializa a aplicação quando o DOM carrega
document.addEventListener('DOMContentLoaded', () => {
    window.app = new LucroCalculator(); // Torna 'app' global para acessar deleteSale
});