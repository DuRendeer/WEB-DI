       // Catálogo de produtos
        const catalogoProdutos = [
            {
                id: 1,
                nome: 'Ração Premium Cães',
                preco: 89.90,
                imagem: 'https://www.petz.com.br/blog/wp-content/uploads/2019/06/racao-canina.jpg',
                categoria: 'alimentacao'
            },
            {
                id: 2,
                nome: 'Areia Sanitária Gatos',
                preco: 24.90,
                imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQXVPehODQE-k9lYXrXX-m5XQcmNwG6Go5rPw&s',
                categoria: 'higiene'
            },
            {
                id: 3,
                nome: 'Brinquedos Interativos',
                preco: 35.90,
                imagem: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop',
                categoria: 'brinquedos'
            },
            {
                id: 4,
                nome: 'Casinha Confort',
                preco: 149.90,
                imagem: 'https://encrypted-tbn0.gstatic.com/shopping?q=tbn:ANd9GcRtywXBcw-C0bl4CuBguF-2Um0bkkiT4oT91gT8SmPMjJumrHvc6li0E9gp7XF6r_UtXmP_u7KcQokZI3B9zwLEINIYmC26IccJurXS52_BTsijTYwJBEt-ENoWncdwZ4z7zdF6JTKVO-U&usqp=CAc',
                categoria: 'acessorios'
            },
            {
                id: 5,
                nome: 'Shampoo Pet Deluxe',
                preco: 19.90,
                imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcT5RFhfkn0HBhCu6dI3cFAABy5bxVvwwp2qjA&s',
                categoria: 'higiene'
            },
            {
                id: 6,
                nome: 'Kit Higiene Bucal',
                preco: 45.90,
                imagem: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFVFBGwhvOKWXtyEswQSUxV6xEwwHn8tK0uw&s',
                categoria: 'higiene'
            }
        ];

        // Variáveis do carrinho
        let carrinho = [];
        let totalItens = 0;
        let formaPagamentoSelecionada = null;

        // Mostrar produtos na tela
        function mostrarProdutos() {
            const container = document.getElementById('area-produtos');
            container.innerHTML = '';
            
            catalogoProdutos.forEach(produto => {
                const cardProduto = document.createElement('div');
                cardProduto.className = 'product-card';
                cardProduto.innerHTML = `
                    <div class="product-image">
                        <img src="${produto.imagem}" alt="${produto.nome}" onerror="this.src='https://via.placeholder.com/400x300/CCCCCC/FFFFFF?text=Produto'">
                    </div>
                    <div class="product-info">
                        <h3 class="product-title">${produto.nome}</h3>
                        <div class="product-price">R$ ${produto.preco.toFixed(2).replace('.', ',')}</div>
                        <button class="product-button" onclick="adicionarAoCarrinho(${produto.id})">Adicionar ao Carrinho</button>
                    </div>
                `;
                container.appendChild(cardProduto);
            });
        }

        // Adicionar produto ao carrinho
        function adicionarAoCarrinho(idProduto) {
            const produto = catalogoProdutos.find(p => p.id === idProduto);
            if (produto) {
                const itemExistente = carrinho.find(item => item.id === idProduto);
                
                if (itemExistente) {
                    itemExistente.quantidade += 1;
                } else {
                    carrinho.push({
                        ...produto,
                        quantidade: 1
                    });
                }
                
                totalItens++;
                atualizarCarrinho();
                
                // Animação do botão
                const botao = event.target;
                const textoOriginal = botao.textContent;
                const corOriginal = botao.style.background;
                
                botao.style.transform = 'scale(0.95)';
                botao.textContent = 'Adicionado!';
                botao.style.background = '#28a745';
                
                setTimeout(() => {
                    botao.style.transform = 'scale(1)';
                    botao.textContent = textoOriginal;
                    botao.style.background = corOriginal;
                }, 1000);
            }
        }

        // Atualizar display do carrinho
        function atualizarCarrinho() {
            document.querySelector('.cart-count').textContent = totalItens;
            
            if (totalItens > 0) {
                document.querySelector('.cart-icon').style.animation = 'bounce 0.5s ease';
                setTimeout(() => {
                    document.querySelector('.cart-icon').style.animation = '';
                }, 500);
            }
        }

        // Abrir modal do carrinho
        function abrirCarrinho() {
            const modal = document.getElementById('modalCarrinho');
            const containerItens = document.getElementById('itens-carrinho');
            const elementoTotal = document.getElementById('total-carrinho');
            
            // Resetar para visualização do carrinho
            document.getElementById('conteudo-carrinho').style.display = 'block';
            document.getElementById('etapas-compra').style.display = 'none';
            document.getElementById('titulo-modal').textContent = 'Seu Carrinho';
            
            containerItens.innerHTML = '';
            let total = 0;
            
            if (carrinho.length === 0) {
                containerItens.innerHTML = '<p style="text-align: center; color: #666;">Seu carrinho está vazio</p>';
            } else {
                carrinho.forEach((item, indice) => {
                    const totalItem = item.preco * item.quantidade;
                    total += totalItem;
                    
                    const itemCarrinho = document.createElement('div');
                    itemCarrinho.className = 'cart-item';
                    itemCarrinho.innerHTML = `
                        <img src="${item.imagem}" alt="${item.nome}">
                        <div class="cart-item-info">
                            <div class="cart-item-name">${item.nome}</div>
                            <div class="cart-item-details">Quantidade: ${item.quantidade} x R$ ${item.preco.toFixed(2).replace('.', ',')}</div>
                        </div>
                        <div class="cart-item-price">R$ ${totalItem.toFixed(2).replace('.', ',')}</div>
                        <button class="remove-btn" onclick="removerDoCarrinho(${indice})">Remover</button>
                    `;
                    containerItens.appendChild(itemCarrinho);
                });
            }
            
            elementoTotal.textContent = `Total: R$ ${total.toFixed(2).replace('.', ',')}`;
            modal.style.display = 'block';
        }

        // Fechar modal do carrinho
        function fecharCarrinho() {
            document.getElementById('modalCarrinho').style.display = 'none';
        }

        // Remover item do carrinho
        function removerDoCarrinho(indice) {
            const itemRemovido = carrinho[indice];
            totalItens -= itemRemovido.quantidade;
            carrinho.splice(indice, 1);
            atualizarCarrinho();
            abrirCarrinho(); // Atualiza o modal
        }

        // Iniciar processo de compra
        function iniciarCompra() {
            if (carrinho.length === 0) {
                alert('Seu carrinho está vazio!');
                return;
            }
            
            document.getElementById('conteudo-carrinho').style.display = 'none';
            document.getElementById('etapas-compra').style.display = 'block';
            document.getElementById('titulo-modal').textContent = 'Finalizar Compra';
            mostrarEtapa(1);
        }

        // Mostrar etapa específica
        function mostrarEtapa(numeroEtapa) {
            // Esconder todas as etapas
            document.querySelectorAll('.step').forEach(etapa => {
                etapa.classList.remove('active');
            });
            
            // Mostrar etapa específica
            document.getElementById(`etapa-${numeroEtapa}`).classList.add('active');
        }

        // Próxima etapa
        function proximaEtapa(numeroEtapa) {
            // Validar etapa atual antes de avançar
            const etapaAtual = numeroEtapa - 1;
            if (!validarEtapa(etapaAtual)) {
                return;
            }
            
            mostrarEtapa(numeroEtapa);
        }

        // Etapa anterior
        function etapaAnterior(numeroEtapa) {
            mostrarEtapa(numeroEtapa);
        }

        // Validar campos da etapa
        function validarEtapa(numeroEtapa) {
            switch(numeroEtapa) {
                case 1:
                    const nome = document.getElementById('nome').value;
                    const telefone = document.getElementById('telefone').value;
                    
                    if (!nome || !telefone) {
                        alert('Por favor, preencha todos os campos obrigatórios.');
                        return false;
                    }
                    break;
                    
                case 2:
                    const cep = document.getElementById('cep').value;
                    const endereco = document.getElementById('endereco').value;
                    const numero = document.getElementById('numero').value;
                    const cidade = document.getElementById('cidade').value;
                    
                    if (!cep || !endereco || !numero || !cidade) {
                        alert('Por favor, preencha todos os campos de endereço.');
                        return false;
                    }
                    break;
            }
            return true;
        }

        // Escolher forma de pagamento
        function escolherPagamento(metodo) {
            formaPagamentoSelecionada = metodo;
            
            // Remover seleção anterior
            document.querySelectorAll('.payment-method').forEach(pm => {
                pm.classList.remove('selected');
            });
            
            // Adicionar seleção atual
            event.target.closest('.payment-method').classList.add('selected');
            
            // Mostrar detalhes do pagamento
            const divDetalhes = document.getElementById('detalhes-pagamento');
            let htmlDetalhes = '';
            
            switch(metodo) {
                case 'credito':
                    htmlDetalhes = `
                        <div class="form-group">
                            <label>Número do Cartão:</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex: 1;">
                                <label>Validade:</label>
                                <input type="text" placeholder="MM/AA" required>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>CVV:</label>
                                <input type="text" placeholder="000" required>
                            </div>
                        </div>
                        <div class="form-group">
                            <label>Parcelas:</label>
                            <select required>
                                <option value="">Selecione</option>
                                <option value="1">1x sem juros</option>
                                <option value="2">2x sem juros</option>
                                <option value="3">3x sem juros</option>
                                <option value="6">6x sem juros</option>
                                <option value="12">12x sem juros</option>
                            </select>
                        </div>
                    `;
                    break;
                    
                case 'debito':
                    htmlDetalhes = `
                        <div class="form-group">
                            <label>Número do Cartão:</label>
                            <input type="text" placeholder="0000 0000 0000 0000" required>
                        </div>
                        <div style="display: flex; gap: 1rem;">
                            <div class="form-group" style="flex: 1;">
                                <label>Validade:</label>
                                <input type="text" placeholder="MM/AA" required>
                            </div>
                            <div class="form-group" style="flex: 1;">
                                <label>CVV:</label>
                                <input type="text" placeholder="000" required>
                            </div>
                        </div>
                    `;
                    break;
                    
                case 'pix':
                    const total = carrinho.reduce((soma, item) => soma + (item.preco * item.quantidade), 0);
                    const totalDesconto = total * 0.95;
                    htmlDetalhes = `
                        <div style="text-align: center; padding: 1rem; background: #f8f9fa; border-radius: 8px;">
                            <h4>Pagamento via PIX</h4>
                            <p>Total com desconto: <strong>R$ ${totalDesconto.toFixed(2).replace('.', ',')}</strong></p>
                            <p>Você economiza: <strong>R$ ${(total - totalDesconto).toFixed(2).replace('.', ',')}</strong></p>
                            <p style="margin-top: 1rem; color: #666;">O código PIX será gerado após a confirmação do pedido.</p>
                        </div>
                    `;
                    break;
            }
            
            divDetalhes.innerHTML = htmlDetalhes;
            document.getElementById('botao-finalizar').style.display = 'inline-block';
        }

        // Finalizar pedido
        function finalizarPedido() {
            if (!formaPagamentoSelecionada) {
                alert('Por favor, selecione uma forma de pagamento.');
                return;
            }
            
            // Gerar número do pedido
            const numeroPedido = Math.floor(Math.random() * 1000000).toString().padStart(6, '0');
            document.getElementById('numero-pedido').textContent = numeroPedido;
            
            // Limpar carrinho
            carrinho = [];
            totalItens = 0;
            atualizarCarrinho();
            
            // Mostrar tela de sucesso
            mostrarEtapa(4);
        }

        // Resetar processo de compra
        function resetarCompra() {
            // Resetar formulário
            document.querySelectorAll('input, select').forEach(input => {
                input.value = '';
            });
            
            // Resetar seleção de pagamento
            formaPagamentoSelecionada = null;
            document.querySelectorAll('.payment-method').forEach(pm => {
                pm.classList.remove('selected');
            });
            
            // Limpar detalhes de pagamento
            document.getElementById('detalhes-pagamento').innerHTML = '';
            document.getElementById('botao-finalizar').style.display = 'none';
        }

        // Quando a página carregar
        document.addEventListener('DOMContentLoaded', function() {
            mostrarProdutos();
            // Scroll suave para links
            document.querySelectorAll('a[href^="#"]').forEach(ancora => {
                ancora.addEventListener('click', function (e) {
                    e.preventDefault();
                    const idAlvo = this.getAttribute('href');
                    const secaoAlvo = document.querySelector(idAlvo);
                    
                    if (secaoAlvo) {
                        secaoAlvo.scrollIntoView({
                            behavior: 'smooth',
                            block: 'start'
                        });
                    }
                });
            });

            // Fechar modal ao clicar do lado de fora
            window.onclick = function(event) {
                const modal = document.getElementById('modalCarrinho');
                if (event.target === modal) {
                    fecharCarrinho();
                }
            };
        });

        // Animação de entrada dos elementos
        const opcaoObservador = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    entrada.target.style.opacity = '1';
                    entrada.target.style.transform = 'translateY(0)';
                }
            });
        }, opcaoObservador);

        // Aplicar animação aos cards apos renderização
        setTimeout(() => {
            const cards = document.querySelectorAll('.feature-card, .product-card, .testimonial-card');
            cards.forEach(card => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(30px)';
                card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
                observador.observe(card);
            });
        }, 100);
