# 🏦 Simulador Avançado de Sistemas de Amortização SAC vs PRICE

## 📋 Informações do Trabalho

**Disciplina:** Administração Financeira (CAD 167)  
**Curso:** Sistemas de Informação  
**Instituição:** Universidade Federal de Minas Gerais (UFMG)  
**Faculdade:** Ciências Econômicas  
**Departamento:** Ciências Administrativas (CAD)  
**Professor:** Bruno Pérez Ferreira  
**Período:** 2º Semestre de 2025  
**Trabalho:** Trabalho 2 - Operações Financeiras

---

## 🎯 Objetivo do Projeto

Desenvolver uma aplicação web interativa que simule e compare os dois principais sistemas de amortização utilizados no mercado financeiro brasileiro: **SAC (Sistema de Amortização Constante)** e **PRICE (Tabela Price / Sistema Francês)**.

A aplicação permite realizar análises financeiras completas, incluindo cálculos de indicadores como CET, TIR e VPL, além de fornecer recomendações inteligentes baseadas no perfil do usuário.

---

## 🚀 Funcionalidades Principais

### 📊 Cálculos Financeiros

#### 1. **Sistema SAC (Sistema de Amortização Constante)**

- ✅ Amortização constante em todas as parcelas
- ✅ Juros decrescentes calculados sobre o saldo devedor
- ✅ Prestações decrescentes ao longo do tempo
- ✅ Fórmula: `Amortização = Valor Principal / Número de Parcelas`

#### 2. **Sistema PRICE (Tabela Price)**

- ✅ Prestações fixas durante todo o período
- ✅ Amortização crescente ao longo do tempo
- ✅ Juros decrescentes sobre o saldo devedor
- ✅ Fórmula: `PMT = P × [i × (1+i)^n] / [(1+i)^n - 1]`

### 💰 Recursos Avançados

#### **Período de Carência**

- Simula período inicial onde o devedor paga apenas juros
- Saldo devedor não é amortizado durante a carência
- Comum em financiamentos estudantis e construção

#### **Correção Monetária (Inflação)**

- Aplica correção mensal nas prestações
- Simula contratos com índices como IPCA ou IGP-M
- Permite análise de impacto da inflação no custo real

#### **Amortização Extraordinária Única**

- Simula pagamento extra em um mês específico
- Útil para simular uso de 13º salário ou bônus
- Reduz saldo devedor e economiza juros futuros
- Se não especificar o mês, aplica automaticamente no mês 12

#### **🔥 Amortização Mensal Recorrente** (NOVA!)

- Pagamento extra TODOS os meses
- Estratégia MAIS EFICIENTE para economizar juros
- Reduz drasticamente o prazo total do financiamento
- Efeito acumulativo exponencial de economia

#### **Custos Adicionais**

- **IOF:** Imposto sobre Operações Financeiras
- **Tarifas:** Custos administrativos bancários
- **Seguros:** Seguros mensais obrigatórios ou opcionais

### 📈 Indicadores Financeiros Calculados

#### **CET (Custo Efetivo Total)**

- Inclui juros, IOF, tarifas e seguros
- Mostra o custo real total da operação
- Exibido em percentual mensal e anual
- Regulamentado pelo Banco Central

#### **TIR (Taxa Interna de Retorno)**

- Calculada usando método de Newton-Raphson
- Taxa que iguala o VPL a zero
- Representa a rentabilidade real da operação
- Perspectiva do credor e do devedor

#### **VPL (Valor Presente Líquido)**

- Traz todos os pagamentos futuros ao valor presente
- Considera taxa de desconto
- Permite avaliar viabilidade da operação

### 🧠 Sistema de Recomendação Inteligente

A aplicação analisa múltiplos critérios e atribui pontos para recomendar o sistema mais adequado:

#### **Critérios Avaliados:**

1. **Custo Total (Peso 3)** 🏆

   - Qual sistema resulta em menor pagamento total?
   - Peso alto: custo é muito importante

2. **Capacidade de Pagamento Inicial (Peso 4)** ⭐

   - O cliente consegue pagar a primeira parcela?
   - Peso máximo: capacidade de pagar é crítica
   - Verifica se compromete mais de 40% da renda

3. **Previsibilidade Orçamentária (Peso 1)** 📅

   - Facilidade de planejamento financeiro
   - PRICE: prestações fixas facilitam planejamento
   - Peso baixo: é uma conveniência, não necessidade

4. **Fluxo de Caixa Futuro (Peso 2)** 💸
   - Como as prestações evoluem ao longo do tempo
   - SAC: libera renda progressivamente
   - Peso médio: importante para planejamento de longo prazo

#### **Sistema de Pontuação:**

- Cada critério favorece um sistema e tem um peso específico
- O sistema com mais pontos totais é recomendado
- Exibe breakdown detalhado da pontuação de cada sistema

### 🎨 Análise de Capacidade de Pagamento

Avalia o comprometimento da renda mensal:

- **Até 30% da renda:** 🟢 Comprometimento SEGURO
- **30% a 40% da renda:** 🟡 Comprometimento MODERADO
- **Acima de 40%:** 🔴 Alto RISCO de inadimplência

### 📊 Visualizações Gráficas (5 Tipos)

1. **Gráfico de Linha - Evolução das Prestações**

   - Mostra como as prestações variam ao longo do tempo
   - Compara SAC (decrescente) vs PRICE (fixa)
   - Tooltip interativo mostra valor exato ao passar o mouse

2. **Gráficos de Pizza - Composição**

   - Proporção entre Juros e Amortização
   - Um gráfico para SAC e outro para PRICE
   - Visualiza o quanto vai para juros vs principal

3. **Gráfico de Barras - Comparação Total**

   - Compara Total Pago e Total de Juros
   - Lado a lado: SAC vs PRICE
   - Tooltip formatado em reais

4. **Gráfico de Linha - Evolução do Saldo Devedor**

   - Como o saldo devedor diminui ao longo do tempo
   - Mostra diferença na velocidade de amortização

5. **Todos os gráficos possuem:**
   - Tooltips interativos formatados em R$
   - Labels nos eixos
   - Legendas coloridas
   - Responsivos (adaptam ao tamanho da tela)

### 📋 Tabelas Detalhadas

#### **Visualização Completa:**

- **Primeiras 10 parcelas** de cada sistema
- **Últimas 10 parcelas** de cada sistema
- Mostra: Mês, Prestação, Juros, Amortização, Saldo

#### **Por que primeiras E últimas?**

- Primeiras: mostra o início (prestações mais altas no SAC)
- Últimas: mostra o final (prestações mais baixas no SAC)
- Evidencia a evolução de cada sistema

### 📄 Exportação de Relatório

- Gera arquivo TXT completo
- Inclui todos os dados da simulação
- Análises de ambos os sistemas
- Recomendação final com justificativas
- Nome do arquivo: `relatorio_amortizacao_YYYY-MM-DD.txt`

---

## 💡 Seção Educativa

### "Por que amortizar CEDO é mais vantajoso?"

A aplicação inclui uma seção educativa que explica:

#### **Conceito Fundamental:**

Os juros são calculados sobre o **saldo devedor**. Quanto antes você reduzir o saldo, menos juros pagará em TODOS os meses seguintes.

#### **Exemplo Prático Numérico:**

Empréstimo de R$ 100.000 a 1% ao mês por 100 meses

- **Amortizar R$ 10.000 no MÊS 2:**
  - Economia: ~R$ 9.800 em juros (98 meses de economia)
- **Amortizar R$ 10.000 no MÊS 99:**
  - Economia: ~R$ 100 em juros (apenas 1 mês)

**Diferença:** Amortizar cedo economiza até **98x mais!**

---

## 🛠️ Tecnologias Utilizadas

### **Frontend:**

- ⚛️ **React** - Biblioteca JavaScript para interfaces
- 🎨 **Tailwind CSS** - Framework de estilização
- 📊 **Recharts** - Biblioteca para gráficos interativos
- 🎯 **Lucide React** - Ícones modernos

### **Linguagens:**

- 💻 **JavaScript** - Lógica de negócio
- 🌐 **HTML** - Estrutura
- 🎨 **CSS** - Estilização (via Tailwind)

### **Conceitos de Programação:**

- Hooks do React (useState)
- Componentização
- Funções puras para cálculos financeiros
- Manipulação de arrays e objetos
- Operações matemáticas complexas

---

## 📐 Fórmulas Matemáticas Implementadas

### **Sistema SAC:**

```
Amortização = Valor Principal / Número de Parcelas
Juros(mês) = Saldo Devedor × Taxa de Juros
Prestação(mês) = Amortização + Juros(mês)
Saldo Devedor(novo) = Saldo Devedor(anterior) - Amortização
```

### **Sistema PRICE:**

```
Fator = (1 + i)^n
PMT = P × [i × Fator] / [Fator - 1]
Juros(mês) = Saldo Devedor × Taxa de Juros
Amortização(mês) = PMT - Juros(mês)
Saldo Devedor(novo) = Saldo Devedor(anterior) - Amortização(mês)
```

### **CET (Custo Efetivo Total):**

```
Valor Líquido = Valor Principal - IOF - Tarifas
Total Pago = Σ Prestações + Seguros
CET Mensal = (Total Pago / Valor Líquido)^(1/n) - 1
CET Anual = (1 + CET Mensal)^12 - 1
```

### **TIR (Taxa Interna de Retorno):**

Método de Newton-Raphson:

```
VPL = -P + Σ(PMT(t) / (1 + TIR)^t) = 0
TIR(novo) = TIR(atual) - VPL / Derivada(VPL)
```

### **VPL (Valor Presente Líquido):**

```
VPL = -P + Σ(PMT(t) / (1 + Taxa Desconto)^t)
```

### **Correção por Inflação:**

```
Fator Inflação = (1 + inflação)^(mês - 1)
Valor Corrigido = Valor Original × Fator Inflação
```

---

## 📖 Como Usar

### **1. Dados Básicos (Obrigatórios):**

- **Valor do Empréstimo:** R$ 200.000 (padrão pré-preenchido)
- **Número de Parcelas:** 360 meses (padrão = 30 anos)
- **Taxa de Juros:** 0,80% ao mês (padrão)
- **Renda Mensal:** R$ 8.000 (opcional, para análise de capacidade)

### **2. Opções Avançadas (Opcionais):**

Clique em "▶ Opções Avançadas" para acessar:

- **Carência:** Período inicial sem amortização (apenas juros)
- **Inflação:** Correção monetária mensal (%)
- **IOF:** Imposto sobre operações financeiras (R$)
- **Tarifas:** Custos administrativos (R$)
- **Seguros:** Valor mensal de seguros (R$)
- **Amort. Extra:** Pagamento único em mês específico (R$)
- **Mês Amort. Extra:** Quando aplicar o pagamento extra
- **🔥 Amort. Mensal:** Pagamento RECORRENTE todo mês (R$)

### **3. Calcular:**

Clique em **"Calcular Amortização"**

### **4. Explorar Resultados:**

#### **Banner de Recomendação:**

- Sistema recomendado com justificativas
- Pontuação detalhada de cada sistema
- Breakdown dos critérios avaliados

#### **Alertas:**

- 🔴 Alerta de risco se comprometer >40% da renda
- 🟢 Confirmação de amortização extraordinária
- 🟡 Confirmação de amortização mensal recorrente

#### **4 Abas de Navegação:**

**📊 Resumo Executivo:**

- Cards comparativos SAC vs PRICE
- Valores principais de cada sistema
- Análise de capacidade de pagamento
- Indicador visual de comprometimento de renda

**📈 Gráficos e Visualizações:**

- 5 gráficos interativos
- Tooltips ao passar o mouse
- Comparações visuais lado a lado

**🔍 Análise Detalhada:**

- Indicadores financeiros (CET, TIR, VPL)
- Interpretação dos indicadores
- Explicações educativas

**📋 Tabelas Completas:**

- Primeiras 10 parcelas de cada sistema
- Últimas 10 parcelas de cada sistema
- Detalhamento mês a mês

### **5. Exportar:**

Clique em **"📥 Exportar Relatório Completo"** para baixar arquivo TXT

---

## 🎓 Conceitos de Administração Financeira Aplicados

### **1. Valor do Dinheiro no Tempo**

- Dinheiro hoje vale mais que dinheiro no futuro
- Implementado via taxas de juros e descontos
- Base para cálculos de VPL e TIR

### **2. Juros Compostos**

- Juros calculados sobre saldo devedor
- "Juros sobre juros"
- Fórmula: M = P × (1 + i)^n

### **3. Sistemas de Amortização**

- Diferentes formas de quitar uma dívida
- SAC: amortização constante
- PRICE: prestação constante

### **4. Análise de Viabilidade**

- VPL: projeto vale a pena?
- TIR: qual a rentabilidade real?
- Payback: quanto tempo para recuperar?

### **5. Custo Efetivo Total**

- Custo real além dos juros nominais
- Inclui todos os encargos da operação
- Obrigatório por regulamentação do Bacen

### **6. Análise de Capacidade de Endividamento**

- Percentual saudável de comprometimento
- Regras do mercado financeiro
- Prevenção de inadimplência

### **7. Fluxo de Caixa**

- Entradas e saídas ao longo do tempo
- Planejamento financeiro
- Gestão de liquidez

---

## 🎯 Diferenciais do Projeto

### **✨ Interface Intuitiva:**

- Design moderno e responsivo
- Tooltips explicativos em TODOS os campos
- Feedback visual claro

### **🧠 Educação Financeira:**

- Seção educativa sobre timing de amortização
- Explicações claras de cada indicador
- Exemplos práticos numéricos

### **📊 Análise Completa:**

- 8 indicadores financeiros diferentes
- Sistema de recomendação com 4 critérios ponderados
- Comparação detalhada lado a lado

### **🔥 Recursos Únicos:**

- Amortização mensal recorrente
- Simulação de inflação
- Período de carência
- Múltiplos cenários de amortização extra

### **💯 Código Profissional:**

- Totalmente comentado
- Funções documentadas
- Fórmulas matemáticas explicadas
- Organização clara

---

## 📊 Casos de Uso Práticos

### **1. Financiamento Imobiliário**

```
Valor: R$ 300.000
Prazo: 360 meses (30 anos)
Taxa: 0,80% ao mês
```

### **2. Financiamento de Veículo**

```
Valor: R$ 50.000
Prazo: 60 meses (5 anos)
Taxa: 1,20% ao mês
```

### **3. Empréstimo Pessoal**

```
Valor: R$ 20.000
Prazo: 24 meses (2 anos)
Taxa: 2,50% ao mês
```

### **4. Financiamento Estudantil com Carência**

```
Valor: R$ 80.000
Prazo: 120 meses (10 anos)
Taxa: 0,60% ao mês
Carência: 48 meses (durante graduação)
```

---

## 🎨 Estrutura da Interface

```
├── Cabeçalho
│   ├── Título da aplicação
│   └── Informações da disciplina
│
├── Formulário de Entrada
│   ├── Campos obrigatórios (4)
│   └── Opções avançadas (8)
│       └── Seção educativa (novo!)
│
├── Área de Resultados
│   ├── Banner de recomendação
│   ├── Alertas (quando aplicável)
│   └── Sistema de abas
│       ├── 📊 Resumo
│       ├── 📈 Gráficos (5 tipos)
│       ├── 🔍 Análise
│       └── 📋 Tabelas
│
└── Botão de exportação
```

---

## 🔍 Estrutura do Código

### **Organização dos Componentes:**

```javascript
SimuladorAmortizacao (Componente Principal)
├── Estados (useState)
├── Funções de Cálculo
│   ├── calcularSAC()
│   ├── calcularPRICE()
│   ├── calcularCET()
│   ├── calcularTIR()
│   ├── calcularVPL()
│   ├── analisarCapacidadePagamento()
│   └── recomendarSistema()
├── Funções Auxiliares
│   ├── calcularResumo()
│   ├── formatarMoeda()
│   ├── prepararDadosGraficoXXX()
│   └── exportarRelatorio()
├── Componentes Visuais
│   ├── Tooltip
│   ├── IconeCapacidade
│   └── Formulários e Tabelas
└── Renderização (JSX)
```

### **Fluxo de Dados:**

```
1. Usuário preenche formulário
   ↓
2. Clica em "Calcular"
   ↓
3. handleCalcular() valida dados
   ↓
4. Executa cálculos (SAC e PRICE)
   ↓
5. Calcula indicadores (CET, TIR, VPL)
   ↓
6. Analisa capacidade de pagamento
   ↓
7. Gera recomendação inteligente
   ↓
8. Armazena em resultados (estado)
   ↓
9. Interface renderiza resultados
   ↓
10. Usuário explora abas e exporta
```

---

## 📚 Referências Teóricas

### **Livros:**

- GITMAN, Lawrence J. **Princípios de Administração Financeira**
- ASSAF NETO, Alexandre. **Matemática Financeira e suas Aplicações**
- ROSS, Stephen A. **Administração Financeira Corporativa**

### **Conceitos:**

- Sistema de Amortização Constante (SAC)
- Tabela Price (Sistema Francês)
- Custo Efetivo Total (CET)
- Taxa Interna de Retorno (TIR)
- Valor Presente Líquido (VPL)

### **Regulamentação:**

- Banco Central do Brasil - Resoluções sobre CET

---

## 🎓 Aprendizados do Projeto

### **Técnicos:**

- Implementação de fórmulas matemáticas complexas
- Manipulação de estados em React
- Criação de gráficos interativos
- Validação de dados financeiros
- Geração de relatórios

### **Financeiros:**

- Funcionamento de sistemas de amortização
- Importância do timing nas amortizações
- Cálculo de indicadores financeiros
- Análise de capacidade de endividamento
- Impacto de custos adicionais (IOF, tarifas)

### **Profissionais:**

- Documentação de código
- Interface centrada no usuário
- Educação financeira através da tecnologia
- Organização de projetos complexos

---

## 🏆 Resultados Esperados

✅ Compreensão profunda dos sistemas SAC e PRICE  
✅ Capacidade de análise financeira completa  
✅ Ferramenta prática para tomada de decisão  
✅ Código bem estruturado e documentado  
✅ Interface profissional e intuitiva  
✅ Aplicação de conceitos teóricos na prática

---

## 👨‍💻 Sobre o Desenvolvimento

Este projeto foi desenvolvido como trabalho acadêmico para a disciplina de Administração Financeira do curso de Sistemas de Informação da UFMG.

O objetivo é demonstrar a aplicação prática de conceitos financeiros através de uma ferramenta tecnológica que auxilie na tomada de decisões sobre financiamentos e empréstimos.

---

## 📞 Suporte

Para dúvidas sobre o projeto ou conceitos financeiros, consulte:

- Material da disciplina CAD 167
- Professor Bruno Pérez Ferreira
- Documentação inline no código (comentários)

---

## 📝 Licença Acadêmica

Este projeto é de uso acadêmico para fins educacionais na UFMG.
