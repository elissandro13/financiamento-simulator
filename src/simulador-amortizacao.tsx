import React, { useState } from 'react';
import { Calculator, Download, TrendingDown, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { LineChart, Line, BarChart, Bar, PieChart as RePieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

/**
 * ==================================================================================
 * TRABALHO 2 - ADMINISTRAÇÃO FINANCEIRA - UFMG
 * ==================================================================================
 * Disciplina: Administração Financeira (CAD 167)
 * Curso: Sistemas de Informação
 * 
 * APLICAÇÃO: Simulador Avançado de Sistemas de Amortização SAC vs PRICE
 * 
 * FUNCIONALIDADES:
 * - Cálculo SAC (Sistema de Amortização Constante)
 * - Cálculo PRICE (Tabela Price - Sistema Francês)
 * - Período de carência
 * - Correção por inflação
 * - Amortização extraordinária
 * - Cálculo de CET (Custo Efetivo Total)
 * - Cálculo de TIR (Taxa Interna de Retorno)
 * - Cálculo de VPL (Valor Presente Líquido)
 * - Análise de capacidade de pagamento
 * - Sistema de recomendação inteligente
 * - 5 tipos de gráficos interativos
 * - Geração de relatório completo
 * ==================================================================================
 */

const SimuladorAmortizacao = () => {
  
  /**
   * ESTADOS - DADOS PRÉ-PREENCHIDOS
   * Exemplo: Financiamento imobiliário de R$ 200.000 em 30 anos
   */
  const [valorEmprestimo, setValorEmprestimo] = useState('200000');
  const [numParcelas, setNumParcelas] = useState('360');
  const [taxaJuros, setTaxaJuros] = useState('0.80');
  const [rendaMensal, setRendaMensal] = useState('8000');
  const [periodoCarencia, setPeriodoCarencia] = useState('0');
  const [taxaInflacao, setTaxaInflacao] = useState('0.40');
  const [iof, setIof] = useState('3000');
  const [tarifas, setTarifas] = useState('2500');
  const [seguros, setSeguros] = useState('150');
  const [amortizacaoExtra, setAmortizacaoExtra] = useState('');
  const [mesAmortizacaoExtra, setMesAmortizacaoExtra] = useState('');
  const [amortizacaoMensal, setAmortizacaoMensal] = useState('');
  const [resultados, setResultados] = useState(null);
  const [abaAtiva, setAbaAtiva] = useState('resumo');
  const [mostrarAvancado, setMostrarAvancado] = useState(false);

  const CORES = ['#10b981', '#3b82f6', '#f59e0b', '#ef4444'];

  /**
   * FUNÇÃO: calcularSAC
   * Sistema de Amortização Constante
   * - Amortização constante = Valor / Número de parcelas
   * - Juros = Saldo Devedor × Taxa
   * - Prestação = Amortização + Juros (decrescente)
   */
  const calcularSAC = (P, n, i, carencia = 0, inflacao = 0, valorExtra = 0, mesExtra = 0, amortMensal = 0) => {
    const parcelas = [];
    let saldoDevedor = P;
    
    // Período de carência: paga apenas juros (saldo devedor NÃO diminui)
    for (let mes = 1; mes <= carencia; mes++) {
      const juros = saldoDevedor * i;
      const fatorInflacao = Math.pow(1 + inflacao, mes - 1);
      parcelas.push({
        mes, 
        prestacao: juros * fatorInflacao, 
        juros: juros * fatorInflacao,
        amortizacao: 0,
        saldoDevedor, 
        saldoFinal: saldoDevedor,
        emCarencia: true,
        amortizacaoMensal: 0
      });
    }
    
    // Calcula amortização constante sobre o valor ORIGINAL
    const amortizacao = P / n;
    
    // Parcelas normais (após carência)
    for (let mes = carencia + 1; mes <= carencia + n; mes++) {
      // Aplica amortização extraordinária única (se houver)
      if (mes === mesExtra && valorExtra > 0) saldoDevedor -= valorExtra;
      
      // Aplica amortização mensal recorrente (todo mês após carência)
      if (amortMensal > 0 && saldoDevedor > 0) {
        const amortMensalAplicada = Math.min(amortMensal, saldoDevedor);
        saldoDevedor -= amortMensalAplicada;
      }
      
      const juros = saldoDevedor * i;
      const amortizacaoAtual = Math.min(amortizacao, saldoDevedor);
      const prestacao = amortizacaoAtual + juros;
      const fatorInflacao = Math.pow(1 + inflacao, mes - 1);
      parcelas.push({
        mes, 
        prestacao: prestacao * fatorInflacao, 
        juros: juros * fatorInflacao,
        amortizacao: amortizacaoAtual * fatorInflacao, 
        saldoDevedor,
        saldoFinal: Math.max(0, saldoDevedor - amortizacaoAtual), 
        emCarencia: false,
        amortizacaoMensal: amortMensal * fatorInflacao
      });
      saldoDevedor -= amortizacaoAtual;
      if (saldoDevedor <= 0) break;
    }
    return parcelas;
  };

  /**
   * FUNÇÃO: calcularPRICE
   * Sistema Francês (Tabela Price)
   * - Prestação fixa = P × [i × (1+i)^n] / [(1+i)^n - 1]
   * - Juros = Saldo Devedor × Taxa (decrescente)
   * - Amortização = Prestação - Juros (crescente)
   */
  const calcularPRICE = (P, n, i, carencia = 0, inflacao = 0, valorExtra = 0, mesExtra = 0, amortMensal = 0) => {
    const parcelas = [];
    let saldoDevedor = P;
    
    // Período de carência
    for (let mes = 1; mes <= carencia; mes++) {
      const juros = saldoDevedor * i;
      const fatorInflacao = Math.pow(1 + inflacao, mes - 1);
      parcelas.push({
        mes, 
        prestacao: juros * fatorInflacao, 
        juros: juros * fatorInflacao,
        amortizacao: 0,
        saldoDevedor, 
        saldoFinal: saldoDevedor,
        emCarencia: true,
        amortizacaoMensal: 0
      });
    }
    
    // Calcula prestação fixa sobre o valor ORIGINAL
    const fator = Math.pow(1 + i, n);
    const prestacaoBase = P * (i * fator) / (fator - 1);
    
    // Parcelas normais (após carência)
    for (let mes = carencia + 1; mes <= carencia + n; mes++) {
      // Aplica amortização extraordinária única
      if (mes === mesExtra && valorExtra > 0) saldoDevedor -= valorExtra;
      
      // Aplica amortização mensal recorrente
      if (amortMensal > 0 && saldoDevedor > 0) {
        const amortMensalAplicada = Math.min(amortMensal, saldoDevedor);
        saldoDevedor -= amortMensalAplicada;
      }
      
      const juros = saldoDevedor * i;
      const amortizacaoAtual = Math.min(prestacaoBase - juros, saldoDevedor);
      const prestacao = amortizacaoAtual + juros;
      const fatorInflacao = Math.pow(1 + inflacao, mes - 1);
      parcelas.push({
        mes, 
        prestacao: prestacao * fatorInflacao, 
        juros: juros * fatorInflacao,
        amortizacao: amortizacaoAtual * fatorInflacao, 
        saldoDevedor,
        saldoFinal: Math.max(0, saldoDevedor - amortizacaoAtual), 
        emCarencia: false,
        amortizacaoMensal: amortMensal * fatorInflacao
      });
      saldoDevedor -= amortizacaoAtual;
      if (saldoDevedor <= 0) break;
    }
    return parcelas;
  };

  /**
   * FUNÇÃO: calcularCET
   * Custo Efetivo Total - inclui juros, IOF, tarifas e seguros
   */
  const calcularCET = (parcelas, valorPrincipal, iofValor, tarifasValor, segurosValor) => {
    const valorLiquido = valorPrincipal - iofValor - tarifasValor;
    const totalPago = parcelas.reduce((sum, p) => sum + p.prestacao, 0) + segurosValor;
    const n = parcelas.length;
    const cetMensal = Math.pow(totalPago / valorLiquido, 1/n) - 1;
    const cetAnual = Math.pow(1 + cetMensal, 12) - 1;
    return { cetMensal: cetMensal * 100, cetAnual: cetAnual * 100, valorLiquido, totalPago, custoTotal: totalPago - valorPrincipal };
  };

  /**
   * FUNÇÃO: calcularTIR
   * Taxa Interna de Retorno - usa método de Newton-Raphson
   */
  const calcularTIR = (valorInicial, parcelas) => {
    let tir = 0.01;
    for (let iter = 0; iter < 100; iter++) {
      let vpl = -valorInicial, derivada = 0;
      parcelas.forEach((p, index) => {
        const periodo = index + 1;
        vpl += p.prestacao / Math.pow(1 + tir, periodo);
        derivada -= (periodo * p.prestacao) / Math.pow(1 + tir, periodo + 1);
      });
      if (Math.abs(vpl) < 0.000001) break;
      tir = tir - vpl / derivada;
    }
    return tir * 100;
  };

  /**
   * FUNÇÃO: calcularVPL
   * Valor Presente Líquido
   */
  const calcularVPL = (parcelas, valorInicial, taxaDesconto) => {
    let vpl = -valorInicial;
    parcelas.forEach((p, index) => {
      vpl += p.prestacao / Math.pow(1 + taxaDesconto, index + 1);
    });
    return vpl;
  };

  /**
   * FUNÇÃO: analisarCapacidadePagamento
   * Analisa se a prestação está dentro da capacidade financeira
   * Regra: até 30% seguro, 30-40% atenção, >40% risco
   */
  const analisarCapacidadePagamento = (prestacao, renda) => {
    if (!renda || renda <= 0) return null;
    const percentual = (prestacao / renda) * 100;
    if (percentual <= 30) {
      return { nivel: 'seguro', percentual, mensagem: 'Comprometimento saudável', cor: 'text-green-600', icon: CheckCircle };
    } else if (percentual <= 40) {
      return { nivel: 'atencao', percentual, mensagem: 'Comprometimento moderado', cor: 'text-yellow-600', icon: AlertTriangle };
    } else {
      return { nivel: 'risco', percentual, mensagem: 'Alto comprometimento', cor: 'text-red-600', icon: AlertTriangle };
    }
  };

  /**
   * FUNÇÃO: recomendarSistema
   * Sistema de recomendação baseado em múltiplos critérios com pesos
   */
  const recomendarSistema = (sacResumo, priceResumo, renda, primeiraParcelaSAC, prestacaoPRICE) => {
    const recomendacoes = [];
    if (sacResumo.totalPago < priceResumo.totalPago) {
      recomendacoes.push({ tipo: 'custo', sistema: 'SAC', motivo: 'Menor custo total', peso: 3 });
    } else {
      recomendacoes.push({ tipo: 'custo', sistema: 'PRICE', motivo: 'Menor custo total', peso: 3 });
    }
    if (renda > 0) {
      const capacidadeSAC = (primeiraParcelaSAC / renda) * 100;
      const capacidadePRICE = (prestacaoPRICE / renda) * 100;
      if (capacidadeSAC > 40 && capacidadePRICE <= 40) {
        recomendacoes.push({ tipo: 'capacidade', sistema: 'PRICE', motivo: '1ª parcela SAC alta', peso: 4 });
      }
    }
    recomendacoes.push({ tipo: 'previsibilidade', sistema: 'PRICE', motivo: 'Prestações fixas', peso: 1 });
    recomendacoes.push({ tipo: 'fluxo', sistema: 'SAC', motivo: 'Prestações decrescentes', peso: 2 });
    const pontosSAC = recomendacoes.filter(r => r.sistema === 'SAC').reduce((sum, r) => sum + r.peso, 0);
    const pontosPRICE = recomendacoes.filter(r => r.sistema === 'PRICE').reduce((sum, r) => sum + r.peso, 0);
    return { sistemaRecomendado: pontosSAC > pontosPRICE ? 'SAC' : 'PRICE', pontosSAC, pontosPRICE, recomendacoes };
  };

  const calcularResumo = (parcelas) => {
    return {
      totalPago: parcelas.reduce((sum, p) => sum + p.prestacao, 0),
      totalJuros: parcelas.reduce((sum, p) => sum + p.juros, 0),
      totalAmortizacao: parcelas.reduce((sum, p) => sum + p.amortizacao, 0)
    };
  };

  /**
   * FUNÇÃO PRINCIPAL: handleCalcular
   * Orquestra todos os cálculos e análises
   */
  const handleCalcular = () => {
    const P = parseFloat(valorEmprestimo);
    const n = parseInt(numParcelas);
    const i = parseFloat(taxaJuros) / 100;
    const carencia = parseInt(periodoCarencia) || 0;
    const inflacao = parseFloat(taxaInflacao) / 100 || 0;
    const renda = parseFloat(rendaMensal) || 0;
    const iofValor = parseFloat(iof) || 0;
    const tarifasValor = parseFloat(tarifas) || 0;
    const segurosValor = parseFloat(seguros) || 0;
    const valorExtra = parseFloat(amortizacaoExtra) || 0;
    const amortMensal = parseFloat(amortizacaoMensal) || 0;
    
    // Se há amortização extra mas não especificou o mês, usa mês 12 (padrão: final do 1º ano)
    let mesExtra = parseInt(mesAmortizacaoExtra) || 0;
    if (valorExtra > 0 && mesExtra === 0) {
      mesExtra = carencia + 12; // 12 meses após o início da amortização normal
    }
    
    if (isNaN(P) || isNaN(n) || isNaN(i) || P <= 0 || n <= 0 || i <= 0) {
      alert('Preencha os campos obrigatórios com valores válidos.');
      return;
    }
    
    // Validação: mês extra não pode ser durante a carência
    if (valorExtra > 0 && mesExtra > 0 && mesExtra <= carencia) {
      alert(`O mês da amortização extra deve ser após o período de carência (mês ${carencia + 1} ou posterior).`);
      return;
    }
    
    // Validação: mês extra não pode ser maior que o total de parcelas
    if (valorExtra > 0 && mesExtra > (carencia + n)) {
      alert(`O mês da amortização extra não pode ser maior que o total de parcelas (${carencia + n}).`);
      return;
    }
    
    // Validação: valor extra não pode ser maior que o valor do empréstimo
    if (valorExtra > P) {
      alert('O valor da amortização extra não pode ser maior que o valor do empréstimo.');
      return;
    }
    
    const parcelasSAC = calcularSAC(P, n, i, carencia, inflacao, valorExtra, mesExtra, amortMensal);
    const parcelasPRICE = calcularPRICE(P, n, i, carencia, inflacao, valorExtra, mesExtra, amortMensal);
    const resumoSAC = calcularResumo(parcelasSAC);
    const resumoPRICE = calcularResumo(parcelasPRICE);
    const cetSAC = calcularCET(parcelasSAC, P, iofValor, tarifasValor, segurosValor);
    const cetPRICE = calcularCET(parcelasPRICE, P, iofValor, tarifasValor, segurosValor);
    const tirSAC = calcularTIR(P, parcelasSAC);
    const tirPRICE = calcularTIR(P, parcelasPRICE);
    const vplSAC = calcularVPL(parcelasSAC, P, i);
    const vplPRICE = calcularVPL(parcelasPRICE, P, i);
    const capacidadeSAC = analisarCapacidadePagamento(parcelasSAC[carencia]?.prestacao || parcelasSAC[0]?.prestacao, renda);
    const capacidadePRICE = analisarCapacidadePagamento(parcelasPRICE[carencia]?.prestacao || parcelasPRICE[0]?.prestacao, renda);
    const recomendacao = recomendarSistema(resumoSAC, resumoPRICE, renda, parcelasSAC[carencia]?.prestacao || parcelasSAC[0]?.prestacao, parcelasPRICE[carencia]?.prestacao || parcelasPRICE[0]?.prestacao);
    
    setResultados({
      valorPrincipal: P, numParcelas: n, taxaJuros: i * 100, periodoCarencia: carencia,
      amortizacaoExtra: valorExtra > 0 ? { valor: valorExtra, mes: mesExtra } : null,
      amortizacaoMensal: amortMensal > 0 ? amortMensal : null,
      sac: { parcelas: parcelasSAC, resumo: resumoSAC, cet: cetSAC, tir: tirSAC, vpl: vplSAC, capacidade: capacidadeSAC },
      price: { parcelas: parcelasPRICE, resumo: resumoPRICE, cet: cetPRICE, tir: tirPRICE, vpl: vplPRICE, capacidade: capacidadePRICE },
      recomendacao
    });
    setAbaAtiva('resumo');
  };

  const formatarMoeda = (valor) => valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  const prepararDadosGraficoLinha = () => {
    if (!resultados) return [];
    return resultados.sac.parcelas.map((sac, index) => ({
      mes: sac.mes, SAC: sac.prestacao, PRICE: resultados.price.parcelas[index]?.prestacao || 0
    }));
  };

  const prepararDadosGraficoPizza = (sistema) => {
    if (!resultados) return [];
    const dados = sistema === 'sac' ? resultados.sac : resultados.price;
    return [{ name: 'Juros', value: dados.resumo.totalJuros }, { name: 'Amortização', value: dados.resumo.totalAmortizacao }];
  };

  const prepararDadosGraficoBarras = () => {
    if (!resultados) return [];
    return [
      { categoria: 'Total Pago', SAC: resultados.sac.resumo.totalPago, PRICE: resultados.price.resumo.totalPago },
      { categoria: 'Total Juros', SAC: resultados.sac.resumo.totalJuros, PRICE: resultados.price.resumo.totalJuros }
    ];
  };

  const prepararDadosSaldoDevedor = () => {
    if (!resultados) return [];
    return resultados.sac.parcelas.map((sac, index) => ({
      mes: sac.mes, SAC: sac.saldoFinal, PRICE: resultados.price.parcelas[index]?.saldoFinal || 0
    }));
  };

  const exportarRelatorio = () => {
    if (!resultados) return;
    let r = '='.repeat(80) + '\n';
    r += 'RELATÓRIO - SISTEMAS DE AMORTIZAÇÃO\nUFMG - Administração Financeira\n' + '='.repeat(80) + '\n\n';
    r += `Valor: ${formatarMoeda(resultados.valorPrincipal)}\nParcelas: ${resultados.numParcelas}\nTaxa: ${resultados.taxaJuros.toFixed(2)}%\n\n`;
    r += `SAC - Total: ${formatarMoeda(resultados.sac.resumo.totalPago)} | Juros: ${formatarMoeda(resultados.sac.resumo.totalJuros)} | CET: ${resultados.sac.cet.cetAnual.toFixed(2)}%\n`;
    r += `PRICE - Total: ${formatarMoeda(resultados.price.resumo.totalPago)} | Juros: ${formatarMoeda(resultados.price.resumo.totalJuros)} | CET: ${resultados.price.cet.cetAnual.toFixed(2)}%\n\n`;
    r += `RECOMENDADO: ${resultados.recomendacao.sistemaRecomendado}\n`;
    const blob = new Blob([r], { type: 'text/plain' });
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'relatorio_amortizacao.txt';
    a.click();
  };

  const IconeCapacidade = ({ capacidade }) => {
    if (!capacidade) return null;
    const Icon = capacidade.icon;
    return <Icon className={`w-5 h-5 ${capacidade.cor}`} />;
  };

  /**
   * COMPONENTE: Tooltip
   * Exibe informação explicativa ao passar o mouse
   */
  const Tooltip = ({ texto }) => {
    const [mostrar, setMostrar] = useState(false);
    
    return (
      <div className="relative inline-block ml-2">
        <div 
          className="w-5 h-5 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs font-bold cursor-help hover:bg-blue-600"
          onMouseEnter={() => setMostrar(true)}
          onMouseLeave={() => setMostrar(false)}
        >
          ?
        </div>
        {mostrar && (
          <div className="absolute z-50 w-80 p-3 text-sm text-white bg-gray-900 rounded-lg shadow-2xl left-0 top-7 border border-gray-700">
            <div className="absolute -top-1 left-3 w-2 h-2 bg-gray-900 border-l border-t border-gray-700 transform rotate-45"></div>
            {texto}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex items-center gap-3 mb-4">
            <Calculator className="w-8 h-8 text-indigo-600" />
            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-gray-800">Simulador de Amortização SAC vs PRICE</h1>
              <p className="text-sm text-gray-600">UFMG - Administração Financeira - Trabalho 2</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Dados do Financiamento</h2>
          
          <div className="grid md:grid-cols-4 gap-4 mb-6">
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Valor (R$) *
                <Tooltip texto="Valor total do empréstimo/financiamento. Este é o principal (P) que será amortizado. Quanto maior o valor, maiores serão as prestações e o total de juros pagos." />
              </label>
              <input type="number" value={valorEmprestimo} onChange={(e) => setValorEmprestimo(e.target.value)} 
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Parcelas *
                <Tooltip texto="Número de meses para pagar (prazo). Quanto mais parcelas, menor cada prestação, mas maior o total de juros pagos ao longo do tempo. Ex: 360 meses = 30 anos." />
              </label>
              <input type="number" value={numParcelas} onChange={(e) => setNumParcelas(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Taxa % mês *
                <Tooltip texto="Taxa de juros mensal aplicada sobre o saldo devedor. Esta taxa determina quanto você pagará de juros. Ex: 0.80% ao mês = aprox. 10% ao ano. Quanto maior a taxa, maior o custo total." />
              </label>
              <input type="number" step="0.01" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
            <div>
              <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                Renda (R$)
                <Tooltip texto="Sua renda mensal para análise de capacidade de pagamento. O sistema avaliará se a prestação não compromete mais de 30-40% da sua renda, indicando se o financiamento é saudável." />
              </label>
              <input type="number" value={rendaMensal} onChange={(e) => setRendaMensal(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500" />
            </div>
          </div>

          <button onClick={() => setMostrarAvancado(!mostrarAvancado)} className="text-indigo-600 font-medium mb-4">
            {mostrarAvancado ? '▼' : '▶'} Opções Avançadas
          </button>

          {mostrarAvancado && (
            <div className="space-y-6">
              
              {/* Seção Educativa */}
              <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                <h3 className="font-bold text-blue-800 mb-2 flex items-center gap-2">
                  <Info className="w-5 h-5" />
                  💡 Por que amortizar CEDO é mais vantajoso?
                </h3>
                <p className="text-sm text-blue-900 mb-2">
                  Os <strong>juros são calculados sobre o saldo devedor</strong>. Quanto antes você reduzir o saldo, menos juros pagará nos meses seguintes!
                </p>
                <div className="bg-white rounded p-3 text-sm">
                  <p className="font-semibold mb-1">Exemplo: Empréstimo de R$ 100.000 a 1% ao mês por 100 meses</p>
                  <div className="grid grid-cols-2 gap-4 mt-2">
                    <div>
                      <p className="font-medium text-green-700">✅ Amortizar R$ 10.000 no MÊS 2:</p>
                      <p className="text-xs">Economia: ~R$ 9.800 em juros (98 meses)</p>
                    </div>
                    <div>
                      <p className="font-medium text-red-700">❌ Amortizar R$ 10.000 no MÊS 99:</p>
                      <p className="text-xs">Economia: ~R$ 100 em juros (apenas 1 mês)</p>
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 mt-2">
                    <strong>Diferença:</strong> Amortizar cedo economiza até <strong>98x mais!</strong>
                  </p>
                </div>
              </div>

              <div className="grid md:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Carência (meses)
                  <Tooltip texto="Período inicial onde você paga apenas os juros, sem amortizar a dívida. O saldo devedor não diminui neste período. Usado em financiamentos estudantis ou construção. Ex: 12 meses de carência." />
                </label>
                <input type="number" value={periodoCarencia} onChange={(e) => setPeriodoCarencia(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Inflação % mês
                  <Tooltip texto="Taxa de inflação mensal para correção monetária das prestações. Simula contratos com correção por IPCA/IGP-M. Ex: 0.40% ao mês ≈ 5% ao ano. Aumenta o valor nominal das prestações ao longo do tempo." />
                </label>
                <input type="number" step="0.01" value={taxaInflacao} onChange={(e) => setTaxaInflacao(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  IOF (R$)
                  <Tooltip texto="Imposto sobre Operações Financeiras. Tributo federal cobrado na contratação do crédito. Reduz o valor líquido que você recebe, mas não afeta as prestações. Típico: 0.38% ao dia + 3% do valor total." />
                </label>
                <input type="number" value={iof} onChange={(e) => setIof(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Tarifas (R$)
                  <Tooltip texto="Tarifas bancárias cobradas na contratação: análise de crédito, cadastro, avaliação de garantia, etc. Valor único descontado no início. Aumenta o CET (Custo Efetivo Total) da operação." />
                </label>
                <input type="number" value={tarifas} onChange={(e) => setTarifas(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Seguros (R$)
                  <Tooltip texto="Valor mensal de seguros obrigatórios ou opcionais (morte, invalidez, desemprego, danos ao imóvel). Este valor é SOMADO às prestações. Aumenta significativamente o custo mensal e o CET." />
                </label>
                <input type="number" value={seguros} onChange={(e) => setSeguros(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Amort. Extra (R$)
                  <Tooltip texto="Valor ÚNICO de amortização extraordinária. Simula um pagamento extra em um mês específico (ex: usar 13º salário). Se não especificar o mês, será aplicado no mês 12. Reduz o saldo devedor e economiza juros futuros!" />
                </label>
                <input type="number" value={amortizacaoExtra} onChange={(e) => setAmortizacaoExtra(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" placeholder="Opcional" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  Mês Amort. Extra
                  <Tooltip texto="Em qual mês realizar a amortização extraordinária ÚNICA. Se deixar em branco, o sistema aplicará no mês 12. O pagamento é aplicado ANTES dos juros, maximizando a economia. QUANTO MAIS CEDO, MAIOR A ECONOMIA!" />
                </label>
                <input type="number" value={mesAmortizacaoExtra} onChange={(e) => setMesAmortizacaoExtra(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg" placeholder="Padrão: 12" />
              </div>
              <div>
                <label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                  <span className="bg-yellow-100 px-2 py-1 rounded">🔥 Amort. Mensal (R$)</span>
                  <Tooltip texto="Valor RECORRENTE pago TODO MÊS além da prestação normal. Exemplo: pagar R$ 500 extras por mês reduz drasticamente o prazo e os juros totais. Esta é a estratégia MAIS EFICIENTE para economizar, pois amortiza desde o início!" />
                </label>
                <input type="number" value={amortizacaoMensal} onChange={(e) => setAmortizacaoMensal(e.target.value)}
                  className="w-full px-4 py-2 border rounded-lg border-yellow-400 bg-yellow-50" placeholder="Opcional" />
              </div>
            </div>
            </div>
          )}
          
          <button onClick={handleCalcular}
            className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700">
            🧮 Calcular Amortização
          </button>
        </div>

        {resultados && (
          <>
            <div className="bg-gradient-to-r from-indigo-500 to-purple-600 rounded-lg shadow-lg p-6 mb-8 text-white">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Recomendado: {resultados.recomendacao.sistemaRecomendado}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p className="mb-2">Motivos da recomendação:</p>
                  <ul className="space-y-2">
                    {resultados.recomendacao.recomendacoes
                      .filter(r => r.sistema === resultados.recomendacao.sistemaRecomendado)
                      .map((rec, i) => (
                        <li key={i} className="text-sm flex items-start gap-2">
                          <span className="font-bold text-lg">•</span>
                          <div>
                            <span className="font-medium">{rec.motivo}</span>
                            <span className="text-xs ml-2 bg-white/20 px-2 py-0.5 rounded">+{rec.peso} ponto{rec.peso > 1 ? 's' : ''}</span>
                          </div>
                        </li>
                      ))}
                  </ul>
                </div>
                <div className="bg-white/10 rounded-lg p-4">
                  <p className="font-semibold mb-3">Pontuação da Análise:</p>
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between mb-1">
                        <span>SAC</span>
                        <span className="font-bold">{resultados.recomendacao.pontosSAC} pontos</span>
                      </div>
                      <div className="text-xs space-y-1">
                        {resultados.recomendacao.recomendacoes
                          .filter(r => r.sistema === 'SAC')
                          .map((rec, i) => (
                            <div key={i} className="flex justify-between opacity-80">
                              <span>• {rec.tipo}</span>
                              <span>+{rec.peso}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                    <div className="border-t border-white/20 pt-2">
                      <div className="flex justify-between mb-1">
                        <span>PRICE</span>
                        <span className="font-bold">{resultados.recomendacao.pontosPRICE} pontos</span>
                      </div>
                      <div className="text-xs space-y-1">
                        {resultados.recomendacao.recomendacoes
                          .filter(r => r.sistema === 'PRICE')
                          .map((rec, i) => (
                            <div key={i} className="flex justify-between opacity-80">
                              <span>• {rec.tipo}</span>
                              <span>+{rec.peso}</span>
                            </div>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {(resultados.sac.capacidade?.nivel === 'risco' || resultados.price.capacidade?.nivel === 'risco') && (
              <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-8 rounded">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                  <div>
                    <h3 className="font-bold text-red-800">Alerta</h3>
                    <p className="text-sm text-red-700">Alto comprometimento de renda. Considere aumentar prazo.</p>
                  </div>
                </div>
              </div>
            )}

            {resultados.amortizacaoExtra && (
              <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-8 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <h3 className="font-bold text-green-800">Amortização Extraordinária Aplicada</h3>
                    <p className="text-sm text-green-700">
                      Pagamento extra de <strong>{formatarMoeda(resultados.amortizacaoExtra.valor)}</strong> no mês <strong>{resultados.amortizacaoExtra.mes}</strong>. 
                      Isso reduz o saldo devedor e economiza juros futuros!
                    </p>
                  </div>
                </div>
              </div>
            )}

            {resultados.amortizacaoMensal && (
              <div className="bg-yellow-50 border-l-4 border-yellow-500 p-4 mb-8 rounded">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-6 h-6 text-yellow-600" />
                  <div>
                    <h3 className="font-bold text-yellow-800">🔥 Amortização Mensal Recorrente</h3>
                    <p className="text-sm text-yellow-700">
                      Pagando <strong>{formatarMoeda(resultados.amortizacaoMensal)}</strong> extras TODO MÊS! 
                      Esta é a estratégia MAIS EFICIENTE para economizar juros e reduzir o prazo do financiamento.
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-white rounded-lg shadow-lg mb-8">
              <div className="border-b">
                <div className="flex overflow-x-auto">
                  {['resumo', 'graficos', 'analise', 'tabelas'].map((tab) => (
                    <button key={tab} onClick={() => setAbaAtiva(tab)}
                      className={`px-6 py-3 font-medium whitespace-nowrap ${abaAtiva === tab ? 'border-b-2 border-indigo-600 text-indigo-600' : 'text-gray-600'}`}>
                      {tab === 'resumo' && '📊 Resumo'}
                      {tab === 'graficos' && '📈 Gráficos'}
                      {tab === 'analise' && '🔍 Análise'}
                      {tab === 'tabelas' && '📋 Tabelas'}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-6">
                {abaAtiva === 'resumo' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-green-800 mb-4 flex items-center gap-2">
                        <TrendingDown className="w-6 h-6" />SAC (Decrescente)
                      </h3>
                      <div className="space-y-3">
                        <div className="flex justify-between"><span>Total:</span><span className="font-bold">{formatarMoeda(resultados.sac.resumo.totalPago)}</span></div>
                        <div className="flex justify-between"><span>Juros:</span><span className="font-bold">{formatarMoeda(resultados.sac.resumo.totalJuros)}</span></div>
                        <div className="flex justify-between"><span>1ª Parcela:</span><span className="font-bold">{formatarMoeda(resultados.sac.parcelas[resultados.periodoCarencia || 0].prestacao)}</span></div>
                        <div className="flex justify-between"><span>Última:</span><span className="font-bold">{formatarMoeda(resultados.sac.parcelas[resultados.sac.parcelas.length - 1].prestacao)}</span></div>
                        <div className="flex justify-between"><span>CET Anual:</span><span className="font-bold">{resultados.sac.cet.cetAnual.toFixed(2)}%</span></div>
                        {resultados.sac.capacidade && (
                          <div className="mt-4 p-3 bg-white rounded-lg">
                            <div className="flex items-center gap-2">
                              <IconeCapacidade capacidade={resultados.sac.capacidade} />
                              <div>
                                <p className="text-sm font-medium">Comprometimento</p>
                                <p className={`text-lg font-bold ${resultados.sac.capacidade.cor}`}>{resultados.sac.capacidade.percentual.toFixed(1)}%</p>
                                <p className="text-xs text-gray-600">{resultados.sac.capacidade.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg p-6">
                      <h3 className="text-xl font-bold text-blue-800 mb-4">PRICE (Fixa)</h3>
                      <div className="space-y-3">
                        <div className="flex justify-between"><span>Total:</span><span className="font-bold">{formatarMoeda(resultados.price.resumo.totalPago)}</span></div>
                        <div className="flex justify-between"><span>Juros:</span><span className="font-bold">{formatarMoeda(resultados.price.resumo.totalJuros)}</span></div>
                        <div className="flex justify-between"><span>Prestação:</span><span className="font-bold">{formatarMoeda(resultados.price.parcelas[resultados.periodoCarencia || 0].prestacao)}</span></div>
                        <div className="flex justify-between"><span>Economia vs SAC:</span><span className="font-bold">{formatarMoeda(Math.abs(resultados.sac.resumo.totalPago - resultados.price.resumo.totalPago))}</span></div>
                        <div className="flex justify-between"><span>CET Anual:</span><span className="font-bold">{resultados.price.cet.cetAnual.toFixed(2)}%</span></div>
                        {resultados.price.capacidade && (
                          <div className="mt-4 p-3 bg-white rounded-lg">
                            <div className="flex items-center gap-2">
                              <IconeCapacidade capacidade={resultados.price.capacidade} />
                              <div>
                                <p className="text-sm font-medium">Comprometimento</p>
                                <p className={`text-lg font-bold ${resultados.price.capacidade.cor}`}>{resultados.price.capacidade.percentual.toFixed(1)}%</p>
                                <p className="text-xs text-gray-600">{resultados.price.capacidade.mensagem}</p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {abaAtiva === 'graficos' && (
                  <div className="space-y-8">
                    <div>
                      <h3 className="text-lg font-bold mb-4">Evolução das Prestações</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prepararDadosGraficoLinha()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" label={{ value: 'Mês', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => formatarMoeda(value)}
                            labelFormatter={(label) => `Mês ${label}`}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="SAC" stroke="#10b981" strokeWidth={2} name="SAC" dot={false} />
                          <Line type="monotone" dataKey="PRICE" stroke="#3b82f6" strokeWidth={2} name="PRICE" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <h3 className="text-lg font-bold mb-4">Composição SAC</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <RePieChart>
                            <Pie data={prepararDadosGraficoPizza('sac')} cx="50%" cy="50%" labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={80} dataKey="value">
                              {prepararDadosGraficoPizza('sac').map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatarMoeda(value)} />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>

                      <div>
                        <h3 className="text-lg font-bold mb-4">Composição PRICE</h3>
                        <ResponsiveContainer width="100%" height={250}>
                          <RePieChart>
                            <Pie data={prepararDadosGraficoPizza('price')} cx="50%" cy="50%" labelLine={false}
                              label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(1)}%`}
                              outerRadius={80} dataKey="value">
                              {prepararDadosGraficoPizza('price').map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={CORES[index % CORES.length]} />
                              ))}
                            </Pie>
                            <Tooltip formatter={(value) => formatarMoeda(value)} />
                          </RePieChart>
                        </ResponsiveContainer>
                      </div>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Comparação Total</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={prepararDadosGraficoBarras()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="categoria" />
                          <YAxis label={{ value: 'Valor (R$)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => formatarMoeda(value)}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                          />
                          <Legend />
                          <Bar dataKey="SAC" fill="#10b981" name="SAC" />
                          <Bar dataKey="PRICE" fill="#3b82f6" name="PRICE" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>

                    <div>
                      <h3 className="text-lg font-bold mb-4">Evolução do Saldo Devedor</h3>
                      <ResponsiveContainer width="100%" height={300}>
                        <LineChart data={prepararDadosSaldoDevedor()}>
                          <CartesianGrid strokeDasharray="3 3" />
                          <XAxis dataKey="mes" label={{ value: 'Mês', position: 'insideBottom', offset: -5 }} />
                          <YAxis label={{ value: 'Saldo (R$)', angle: -90, position: 'insideLeft' }} />
                          <Tooltip 
                            formatter={(value) => formatarMoeda(value)}
                            labelFormatter={(label) => `Mês ${label}`}
                            contentStyle={{ backgroundColor: 'rgba(255, 255, 255, 0.95)', border: '1px solid #ccc', borderRadius: '8px', padding: '10px' }}
                          />
                          <Legend />
                          <Line type="monotone" dataKey="SAC" stroke="#10b981" strokeWidth={2} name="SAC" dot={false} />
                          <Line type="monotone" dataKey="PRICE" stroke="#3b82f6" strokeWidth={2} name="PRICE" dot={false} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                )}

                {abaAtiva === 'analise' && (
                  <div className="space-y-6">
                    <div className="bg-gray-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4">Análise Financeira Detalhada</h3>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-semibold mb-3">SAC</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>CET Mensal:</span><span className="font-medium">{resultados.sac.cet.cetMensal.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>CET Anual:</span><span className="font-medium">{resultados.sac.cet.cetAnual.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>TIR:</span><span className="font-medium">{resultados.sac.tir.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>VPL:</span><span className="font-medium">{formatarMoeda(resultados.sac.vpl)}</span></div>
                          </div>
                        </div>
                        <div>
                          <h4 className="font-semibold mb-3">PRICE</h4>
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between"><span>CET Mensal:</span><span className="font-medium">{resultados.price.cet.cetMensal.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>CET Anual:</span><span className="font-medium">{resultados.price.cet.cetAnual.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>TIR:</span><span className="font-medium">{resultados.price.tir.toFixed(2)}%</span></div>
                            <div className="flex justify-between"><span>VPL:</span><span className="font-medium">{formatarMoeda(resultados.price.vpl)}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-blue-50 rounded-lg p-6">
                      <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                        <Info className="w-5 h-5 text-blue-600" />Interpretação
                      </h3>
                      <div className="space-y-3 text-sm text-gray-700">
                        <p><strong>CET:</strong> Custo efetivo total incluindo juros, IOF, tarifas e seguros.</p>
                        <p><strong>TIR:</strong> Taxa interna de retorno da operação.</p>
                        <p><strong>VPL:</strong> Valor presente líquido das prestações.</p>
                      </div>
                    </div>
                  </div>
                )}

                {abaAtiva === 'tabelas' && (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="overflow-x-auto">
                      <h3 className="text-lg font-bold mb-4">SAC - Primeiras 10 Parcelas</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="p-2">Mês</th>
                            <th className="p-2">Prestação</th>
                            <th className="p-2">Juros</th>
                            <th className="p-2">Amort</th>
                            <th className="p-2">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.sac.parcelas.slice(0, 10).map((p) => (
                            <tr key={p.mes} className="border-b">
                              <td className="p-2">{p.mes}</td>
                              <td className="p-2">{formatarMoeda(p.prestacao)}</td>
                              <td className="p-2">{formatarMoeda(p.juros)}</td>
                              <td className="p-2">{formatarMoeda(p.amortizacao)}</td>
                              <td className="p-2">{formatarMoeda(p.saldoFinal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <h3 className="text-lg font-bold mb-4 mt-6">SAC - Últimas 10 Parcelas</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-green-100">
                          <tr>
                            <th className="p-2">Mês</th>
                            <th className="p-2">Prestação</th>
                            <th className="p-2">Juros</th>
                            <th className="p-2">Amort</th>
                            <th className="p-2">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.sac.parcelas.slice(-10).map((p) => (
                            <tr key={p.mes} className="border-b">
                              <td className="p-2">{p.mes}</td>
                              <td className="p-2">{formatarMoeda(p.prestacao)}</td>
                              <td className="p-2">{formatarMoeda(p.juros)}</td>
                              <td className="p-2">{formatarMoeda(p.amortizacao)}</td>
                              <td className="p-2">{formatarMoeda(p.saldoFinal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    <div className="overflow-x-auto">
                      <h3 className="text-lg font-bold mb-4">PRICE - Primeiras 10 Parcelas</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="p-2">Mês</th>
                            <th className="p-2">Prestação</th>
                            <th className="p-2">Juros</th>
                            <th className="p-2">Amort</th>
                            <th className="p-2">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.price.parcelas.slice(0, 10).map((p) => (
                            <tr key={p.mes} className="border-b">
                              <td className="p-2">{p.mes}</td>
                              <td className="p-2">{formatarMoeda(p.prestacao)}</td>
                              <td className="p-2">{formatarMoeda(p.juros)}</td>
                              <td className="p-2">{formatarMoeda(p.amortizacao)}</td>
                              <td className="p-2">{formatarMoeda(p.saldoFinal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                      
                      <h3 className="text-lg font-bold mb-4 mt-6">PRICE - Últimas 10 Parcelas</h3>
                      <table className="w-full text-sm">
                        <thead className="bg-blue-100">
                          <tr>
                            <th className="p-2">Mês</th>
                            <th className="p-2">Prestação</th>
                            <th className="p-2">Juros</th>
                            <th className="p-2">Amort</th>
                            <th className="p-2">Saldo</th>
                          </tr>
                        </thead>
                        <tbody>
                          {resultados.price.parcelas.slice(-10).map((p) => (
                            <tr key={p.mes} className="border-b">
                              <td className="p-2">{p.mes}</td>
                              <td className="p-2">{formatarMoeda(p.prestacao)}</td>
                              <td className="p-2">{formatarMoeda(p.juros)}</td>
                              <td className="p-2">{formatarMoeda(p.amortizacao)}</td>
                              <td className="p-2">{formatarMoeda(p.saldoFinal)}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>

            <button onClick={exportarRelatorio}
              className="w-full bg-indigo-600 text-white py-3 rounded-lg font-semibold hover:bg-indigo-700 flex items-center justify-center gap-2">
              <Download className="w-5 h-5" />Exportar Relatório Completo
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default SimuladorAmortizacao;