
async function atualizarDashboard() {
    try {
        // Busca os dados das três rotas da API
        const [resProdutos, resPaises, resPedidos] = await Promise.all([
            fetch('http://localhost:3000/api/produtos'),
            fetch('http://localhost:3000/api/paises'),
            fetch('http://localhost:3000/api/pedidos')
        ]);

        // Verifica se as consultas funcionaram
        if (!resProdutos.ok || !resPaises.ok || !resPedidos.ok) {
            throw new Error('Erro ao consultar a API.');
        }

        // Transforma as respostas em dados JavaScript
        const produtos = await resProdutos.json();
        const paises = await resPaises.json();
        const pedidos = await resPedidos.json();

        // Atualiza a quantidade de registros
        document.getElementById('total-produtos').textContent = produtos.length;
        document.getElementById('total-paises').textContent = paises.length;
        document.getElementById('total-pedidos').textContent = pedidos.length;

        // Calcula o valor exportado em reais
        const valorExportado = pedidos.reduce((total, pedido) => {
            return total + (
                Number(pedido.preco_unitario_brl) *
                Number(pedido.quantidade)
            );
        }, 0);

        // Formata o valor como moeda brasileira
        document.getElementById('valor-exportado').textContent =
            valorExportado.toLocaleString('pt-BR', {
                style: 'currency',
                currency: 'BRL'
            });

    } catch (erro) {
        console.error('Erro ao atualizar o Dashboard:', erro);
    }
}

// Executa quando a página termina de carregar
document.addEventListener('DOMContentLoaded', () => {
    atualizarDashboard();
    listarProdutos();
    listarPaises();
    carregarOpcoesExportacao();
    listarExportacoes();
});


async function listarProdutos() {
    try {
        const resposta = await fetch('http://localhost:3000/api/produtos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar produtos.');
        }

        const produtos = await resposta.json();

        const tabela = document.getElementById('lista-produtos');

        tabela.innerHTML = '';

        produtos.forEach(produto => {
            const linha = document.createElement('tr');

            


linha.innerHTML = `
    <td>${produto.id}</td>
    <td>${produto.nome}</td>
    <td>${Number(produto.custo_brl).toLocaleString('pt-BR', {
        style: 'currency',
        currency: 'BRL'
    })}</td>
    <td>${produto.estoque}</td>
    <td>${produto.ativo ? 'Ativo' : 'Inativo'}</td>
    <td>
        <button onclick="editarProduto(${produto.id})"
            ${!produto.ativo ? 'disabled' : ''}>
            Editar
        </button>

        ${produto.ativo
            ? `<button onclick="desativarProduto(${produto.id})">
                Desativar
               </button>`
            : `<button onclick="ativarProduto(${produto.id})">
                Ativar
               </button>`
        }
    </td>
`;




            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao listar produtos:', erro);
    }
}


async function listarPaises() {
    try {
        const resposta = await fetch('http://localhost:3000/api/paises');
        const paises = await resposta.json();

        const tabela = document.getElementById('lista-paises');

        tabela.innerHTML = '';

        paises.forEach(pais => {
            const linha = document.createElement('tr');

            linha.innerHTML = `
                <td>${pais.id}</td>
                <td>${pais.nome}</td>
                <td>${pais.codigo_iso}</td>
                <td>${pais.moeda}</td>
                <td>${pais.codigo_moeda}</td>
                <td>${pais.ativo ? 'Ativo' : 'Inativo'}</td>
                <td>
                    ${pais.ativo
                        ? `<button onclick="desativarPais(${pais.id})">
                            Desativar
                           </button>`
                        : `<button onclick="ativarPais(${pais.id})">
                            Ativar
                           </button>`
                    }
                </td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao listar países:', erro);
    }
}

async function carregarOpcoesExportacao() {
    try {
        const [resProdutos, resPaises] = await Promise.all([
            fetch('http://localhost:3000/api/produtos'),
            fetch('http://localhost:3000/api/paises')
        ]);

        if (!resProdutos.ok || !resPaises.ok) {
            throw new Error('Erro ao carregar produtos ou países.');
        }

        const produtos = await resProdutos.json();
        const paises = await resPaises.json();

        const campoProduto = document.getElementById('produto-exportacao');
        const campoPais = document.getElementById('pais-exportacao');

        campoProduto.innerHTML = '<option value="">Selecione um produto</option>';
        campoPais.innerHTML = '<option value="">Selecione um país</option>';

        produtos
            .filter(produto => produto.ativo)
            .forEach(produto => {
                const opcao = document.createElement('option');

                opcao.value = produto.id;
                opcao.textContent = produto.nome;

                campoProduto.appendChild(opcao);
            });

        paises
            .filter(pais => pais.ativo)
            .forEach(pais => {
                const opcao = document.createElement('option');

                opcao.value = pais.id;
                opcao.textContent = `${pais.nome} (${pais.codigo_moeda})`;

                campoPais.appendChild(opcao);
            });

    } catch (erro) {
        console.error('Erro ao carregar opções de exportação:', erro);
    }
}


async function listarExportacoes() {
    try {
        const resposta = await fetch('http://localhost:3000/api/pedidos');

        if (!resposta.ok) {
            throw new Error('Erro ao buscar exportações.');
        }

        const pedidos = await resposta.json();

        const tabela = document.getElementById('lista-exportacoes');

        tabela.innerHTML = '';

        pedidos.forEach(pedido => {
            const linha = document.createElement('tr');

            const moeda = pedido.codigo_moeda;

            const valorUnitarioBRL = Number(pedido.preco_unitario_brl)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: 'BRL'
                });

            const valorUnitarioDestino = Number(pedido.preco_unitario_destino)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: moeda
                });

            const valorTotalDestino = Number(pedido.valor_total_destino)
                .toLocaleString('pt-BR', {
                    style: 'currency',
                    currency: moeda
                });

            linha.innerHTML = `
                <td>${pedido.id}</td>
                <td>${pedido.produto}</td>
                <td>${pedido.pais}</td>
                <td>${pedido.quantidade}</td>
                <td>${valorUnitarioBRL}</td>
                <td>${valorUnitarioDestino}</td>
                <td>${valorTotalDestino}</td>
                <td>${pedido.status}</td>
            `;

            tabela.appendChild(linha);
        });

    } catch (erro) {
        console.error('Erro ao listar exportações:', erro);
    }
}


const formularioExportacao = document.getElementById('form-exportacao');

formularioExportacao.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const novaExportacao = {
        produto_id: Number(document.getElementById('produto-exportacao').value),
        pais_id: Number(document.getElementById('pais-exportacao').value),
        quantidade: Number(document.getElementById('quantidade-exportacao').value)
    };

    try {
        const resposta = await fetch('http://localhost:3000/api/pedidos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novaExportacao)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao registrar exportação.');
        }

        alert('Exportação registrada com sucesso!');

        formularioExportacao.reset();

        await listarExportacoes();
        await listarProdutos();
        await atualizarDashboard();
        await carregarOpcoesExportacao();

    } catch (erro) {
        console.error('Erro ao registrar exportação:', erro);
        alert(erro.message);
    }
});


const formularioPais = document.getElementById('form-pais');

formularioPais.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    const novoPais = {
        nome: document.getElementById('nome-pais').value.trim(),
        codigo_iso: document.getElementById('codigo-iso').value.trim().toUpperCase(),
        moeda: document.getElementById('moeda-pais').value.trim(),
        codigo_moeda: document.getElementById('codigo-moeda').value.trim().toUpperCase()
    };

    try {
        const resposta = await fetch('http://localhost:3000/api/paises', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoPais)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao cadastrar país.');
        }

        alert('País cadastrado com sucesso!');

        formularioPais.reset();

        await listarPaises();
        await atualizarDashboard();

    } catch (erro) {
        console.error('Erro ao cadastrar país:', erro);
        alert(erro.message);
    }
});

const formularioProduto = document.getElementById('form-produto');

formularioProduto.addEventListener('submit', async (evento) => {
    evento.preventDefault();

    // Captura os valores digitados no formulário
    const nome = document.getElementById('nome-produto').value;
    const descricao = document.getElementById('descricao-produto').value;
    const custo_brl = Number(document.getElementById('custo-produto').value);
    const estoque = Number(document.getElementById('estoque-produto').value);

    // Organiza os dados em um objeto
    const novoProduto = {
        nome,
        descricao,
        custo_brl,
        estoque
    };

    try {
        // Envia os dados para o backend
        const resposta = await fetch('http://localhost:3000/api/produtos', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(novoProduto)
        });

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao cadastrar produto.');
        }

        alert('Produto cadastrado com sucesso!');

        // Limpa o formulário
        formularioProduto.reset();

        // Atualiza a tabela e o Dashboard
        await listarProdutos();
        await atualizarDashboard();

    } catch (erro) {
        console.error('Erro ao cadastrar produto:', erro);
        alert(erro.message);
    }
});


async function editarProduto(id) {
    try {
        // Busca os dados atuais do produto
        const resposta = await fetch(`http://localhost:3000/api/produtos/${id}`);

        if (!resposta.ok) {
            throw new Error('Não foi possível encontrar o produto.');
        }

        const produto = await resposta.json();

        // Solicita os novos dados
        const nome = prompt('Nome do produto:', produto.nome);
        if (nome === null) return;

        const descricao = prompt('Descrição:', produto.descricao || '');
        if (descricao === null) return;

        const custo = prompt('Custo em reais:', produto.custo_brl);
        if (custo === null) return;

        const estoque = prompt('Quantidade em estoque:', produto.estoque);
        if (estoque === null) return;

        // Envia os dados atualizados
        const atualizacao = await fetch(`http://localhost:3000/api/produtos/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                nome,
                descricao,
                custo_brl: Number(custo),
                estoque: Number(estoque)
            })
        });

        const resultado = await atualizacao.json();

        if (!atualizacao.ok) {
            throw new Error(resultado.mensagem || 'Erro ao atualizar produto.');
        }

        alert('Produto atualizado com sucesso!');

        // Atualiza a tabela e o Dashboard
        await listarProdutos();
        await atualizarDashboard();

    } catch (erro) {
        console.error('Erro ao editar produto:', erro);
        alert(erro.message);
    }
}


async function desativarProduto(id) {
    const confirmacao = confirm(
        'Tem certeza de que deseja desativar este produto?'
    );

    if (!confirmacao) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/produtos/${id}/desativar`,
            {
                method: 'PATCH'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao desativar produto.');
        }

        alert('Produto desativado com sucesso!');

        await listarProdutos();
        await atualizarDashboard();
        await carregarOpcoesExportacao();

    } catch (erro) {
        console.error('Erro ao desativar produto:', erro);
        alert(erro.message);
    }
}

async function ativarProduto(id) {
    try {
        const resposta = await fetch(
            `http://localhost:3000/api/produtos/${id}/ativar`,
            {
                method: 'PATCH'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao ativar produto.');
        }

        alert('Produto ativado com sucesso!');

        await listarProdutos();
        await atualizarDashboard();
        await carregarOpcoesExportacao();

    } catch (erro) {
        console.error('Erro ao ativar produto:', erro);
        alert(erro.message);
    }
}

async function desativarPais(id) {
    const confirmar = confirm(
        'Tem certeza de que deseja desativar este país?'
    );

    if (!confirmar) {
        return;
    }

    try {
        const resposta = await fetch(
            `http://localhost:3000/api/paises/${id}/desativar`,
            {
                method: 'PATCH'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao desativar país.');
        }

        alert('País desativado com sucesso!');

        await listarPaises();
        await atualizarDashboard();
        await carregarOpcoesExportacao();

    } catch (erro) {
        console.error('Erro ao desativar país:', erro);
        alert(erro.message);
    }
}

async function ativarPais(id) {
    try {
        const resposta = await fetch(
            `http://localhost:3000/api/paises/${id}/ativar`,
            {
                method: 'PATCH'
            }
        );

        const dados = await resposta.json();

        if (!resposta.ok) {
            throw new Error(dados.mensagem || 'Erro ao ativar país.');
        }

        alert('País ativado com sucesso!');

        await listarPaises();
        await atualizarDashboard();
        await carregarOpcoesExportacao();

    } catch (erro) {
        console.error('Erro ao ativar país:', erro);
        alert(erro.message);
    }
}