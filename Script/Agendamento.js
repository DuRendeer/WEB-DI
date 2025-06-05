    let etapaAtual = 1;
    const totalEtapas = 4;
    const dataHoje = new Date();
    let mesCalendario = dataHoje.getMonth();
    let anoCalendario = dataHoje.getFullYear();
    let petEscolhido = null;

    const nomesMeses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                       'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    const tempoBasico = 60;
    const emojisPets = { cachorro: '🐶', gato: '🐱' };

    function buscarPetsSalvos() {
      const container = document.getElementById('containerPets');
      const listaPets = JSON.parse(localStorage.getItem('meusPets')) || [];
      
      if (listaPets.length > 0) {
        let htmlPets = '';
        listaPets.forEach(pet => {
          const emoji = emojisPets[pet.tipo] || '🐾';
          htmlPets += `
            <div class="pet-card" onclick="selecionarPet(this)" data-informacoes='${JSON.stringify(pet)}'>
              <div class="pet-avatar">${emoji}</div>
              <div class="pet-name">${pet.nome}</div>
            </div>
          `;
        });
        container.innerHTML = htmlPets;
        selecionarPet(container.firstElementChild);
      } else {
        container.innerHTML = `
          <div class="pet-card" onclick="selecionarPet(this)">
            <div class="pet-avatar">🐶🐱</div>
            <div class="pet-name">Nenhum Pet Cadastrado</div>
          </div>
        `;
      }
    }

    function selecionarPet(cartao) {
      document.querySelectorAll('.pet-avatar').forEach(el => el.classList.remove('selected'));
      cartao.querySelector('.pet-avatar').classList.add('selected');
      
      const dadosPet = cartao.getAttribute('data-informacoes');
      petEscolhido = dadosPet ? JSON.parse(dadosPet) : {
        nome: cartao.querySelector('.pet-name').textContent,
        tipo: 'cachorro'
      };
      
      mostrarPetEscolhido();
    }

    function mostrarPetEscolhido() {
      const container = document.getElementById('dadosPetEscolhido');
      if (petEscolhido && container) {
        const emoji = emojisPets[petEscolhido.tipo] || '🐾';
        container.innerHTML = `
          <div class="pet-summary-avatar">${emoji}</div>
          <div class="pet-name">${petEscolhido.nome}</div>
        `;
      }
    }

    function avancarEtapa() {
      if (!validarEtapaAtual()) return;

      if (etapaAtual < totalEtapas) {
        trocarEtapa(etapaAtual, etapaAtual + 1);
        etapaAtual++;
        
        if (etapaAtual === 4) criarResumoFinal();
      }
    }

    function voltarEtapa() {
      if (etapaAtual > 1) {
        trocarEtapa(etapaAtual, etapaAtual - 1);
        etapaAtual--;
      }
    }

    function trocarEtapa(origem, destino) {
      document.getElementById(`tela-etapa${origem}`).classList.remove("active");
      document.getElementById(`etapa${origem}`).classList.remove("active");
      
      document.getElementById(`tela-etapa${destino}`).classList.add("active");
      document.getElementById(`etapa${destino}`).classList.add("active");
      
      if (destino > origem) {
        document.getElementById(`etapa${origem}`).classList.add("completed");
      } else {
        document.getElementById(`etapa${destino}`).classList.remove("completed");
      }
    }

    function marcarServico(servico) {
      servico.classList.toggle('selected');
      atualizarTotais();
    }

    function escolherHorario(horario) {
      if (horario.classList.contains('disabled')) return;
      
      document.querySelectorAll('.time-slot').forEach(h => h.classList.remove('selected'));
      horario.classList.add('selected');
    }

    function escolherDia(dia) {
      if (dia.classList.contains('disabled')) return;
      
      document.querySelectorAll('.calendar-day').forEach(d => d.classList.remove('selected'));
      dia.classList.add('selected');
    }

    function atualizarTotais() {
      let valorTotal = 0;
      let tempoTotal = tempoBasico;

      document.querySelectorAll('.service-option.selected').forEach(servico => {
        const valor = parseFloat(servico.getAttribute('data-valor')) || 0;
        const minutos = parseInt(servico.getAttribute('data-minutos')) || 0;
        valorTotal += valor;
        tempoTotal += minutos;
      });

      const valorFormatado = `R$ ${valorTotal.toFixed(2).replace('.', ',')}`;
      
      document.getElementById('valorTotalServicos').textContent = valorFormatado;
      document.getElementById('valorServicos').textContent = valorFormatado;
      document.getElementById('valorFinalAgendamento').textContent = valorFormatado;
      
      const horas = Math.floor(tempoTotal / 60);
      const minutos = tempoTotal % 60;
      document.getElementById('tempoTotalAtendimento').textContent = `${horas}h${minutos.toString().padStart(2, '0')}`;
    }

    function criarResumoFinal() {
      mostrarHorarioEscolhido();
      montarResumoServicos();
      atualizarTotais();
    }

    function mostrarHorarioEscolhido() {
      const diaEscolhido = document.querySelector('.calendar-day.selected');
      const horarioEscolhido = document.querySelector('.time-slot.selected');
      const elementoHorario = document.getElementById('horarioEscolhido');
      
      if (elementoHorario && diaEscolhido && horarioEscolhido) {
        const dia = diaEscolhido.textContent.padStart(2, '0');
        const mes = (mesCalendario + 1).toString().padStart(2, '0');
        const horaInicio = horarioEscolhido.textContent.trim();
        const horaFim = `${parseInt(horaInicio) + 1}:00`;
        
        elementoHorario.textContent = `${horaInicio} até ${horaFim} - Dia ${dia}/${mes}/${anoCalendario}`;
      }
    }

    function montarResumoServicos() {
      const container = document.getElementById('resumoFinal');
      container.innerHTML = '<h3 class="section-subtitle">Serviços agendados</h3>';
      
      if (petEscolhido) {
        const emoji = emojisPets[petEscolhido.tipo] || '🐾';
        container.innerHTML += `
          <div class="pet-info">
            <div class="pet-summary-avatar">${emoji}</div>
            <div>
              <div class="pet-name">${petEscolhido.nome}</div>
              <div class="section-subtitle">Profissional: Jorlan Lemos Sochodolak</div>
            </div>
          </div>
        `;
      }
      
      document.querySelectorAll('.service-option.selected').forEach(servico => {
        const nome = servico.querySelector('.service-name').textContent;
        const preco = servico.querySelector('.service-price').textContent;
        
        container.innerHTML += `
          <div class="summary-item">
            <div class="summary-label">✓ ${nome}</div>
            <div class="summary-value">${preco}</div>
          </div>
        `;
      });
    }

    function validarEtapaAtual() {
      const validacoes = {
        1: () => {
          if (!document.querySelector('.pet-avatar.selected')) {
            alert("Por favor, selecione um pet para continuar.");
            return false;
          }
          return true;
        },
        2: () => {
          if (!document.querySelectorAll('.service-option.selected').length) {
            alert("Por favor, selecione ao menos um serviço.");
            return false;
          }
          return true;
        },
        3: () => {
          const diaOk = document.querySelector('.calendar-day.selected');
          const horarioOk = document.querySelector('.time-slot.selected');
          if (!diaOk || !horarioOk) {
            alert("Selecione a data e o horário do agendamento.");
            return false;
          }
          return true;
        }
      };

      return validacoes[etapaAtual] ? validacoes[etapaAtual]() : true;
    }

    function irParaCadastroPet() {
      window.location.href = "CadastroPet.html";
    }

    function confirmarAgendamento() {
      const dadosAgendamento = {
        pet: petEscolhido,
        servicos: Array.from(document.querySelectorAll('.service-option.selected')).map(s => ({
          nome: s.querySelector('.service-name').textContent,
          valor: s.getAttribute('data-valor')
        })),
        dataEscolhida: {
          dia: document.querySelector('.calendar-day.selected')?.textContent,
          mes: mesCalendario + 1,
          ano: anoCalendario,
          horario: document.querySelector('.time-slot.selected')?.textContent
        },
        observacoes: document.getElementById('observacoesFinais').value,
        momentoAgendamento: new Date().toLocaleString('pt-BR')
      };
      
      localStorage.setItem('agendamentoRealizado', JSON.stringify(dadosAgendamento));
      console.log('Agendamento confirmado:', dadosAgendamento);
      window.location.href = "Obrigado.html";
    }

    function montarCalendario(mes, ano) {
      const titulo = document.getElementById('nomeDoMes');
      const grade = document.getElementById('diasDoCalendario');
      const botaoVoltar = document.querySelector('.month-nav-button[onclick="voltarMes()"]');

      const primeiroDiaDoMes = new Date(ano, mes, 1).getDay();
      const quantidadeDias = new Date(ano, mes + 1, 0).getDate();
      const ehMesAtual = mes === dataHoje.getMonth() && ano === dataHoje.getFullYear();

      titulo.textContent = `${nomesMeses[mes]} de ${ano}`;
      botaoVoltar.style.display = ehMesAtual ? 'none' : 'inline-block';

      grade.querySelectorAll('.calendar-day').forEach(dia => dia.remove());

      for (let i = 0; i < primeiroDiaDoMes; i++) {
        criarDiaCalendario(grade, '', true);
      }

      for (let dia = 1; dia <= quantidadeDias; dia++) {
        const estaNoPassado = verificarSeEPassado(dia, mes, ano);
        const elementoDia = criarDiaCalendario(grade, dia, estaNoPassado);
        
        if (dia === dataHoje.getDate() && ehMesAtual) {
          elementoDia.classList.add('selected');
        }
      }
    }

    function criarDiaCalendario(container, numero, desabilitado) {
      const dia = document.createElement('div');
      dia.classList.add('calendar-day');
      if (numero) dia.textContent = numero;
      
      if (desabilitado) {
        dia.classList.add('disabled');
      } else {
        dia.onclick = () => escolherDia(dia);
      }
      
      container.appendChild(dia);
      return dia;
    }

    function verificarSeEPassado(dia, mes, ano) {
      return (ano < dataHoje.getFullYear()) ||
             (ano === dataHoje.getFullYear() && mes < dataHoje.getMonth()) ||
             (ano === dataHoje.getFullYear() && mes === dataHoje.getMonth() && dia < dataHoje.getDate());
    }

    function avancarMes() {
      mesCalendario++;
      if (mesCalendario > 11) {
        mesCalendario = 0;
        anoCalendario++;
      }
      montarCalendario(mesCalendario, anoCalendario);
    }

    function voltarMes() {
      if (mesCalendario === dataHoje.getMonth() && anoCalendario === dataHoje.getFullYear()) return;

      mesCalendario--;
      if (mesCalendario < 0) {
        mesCalendario = 11;
        anoCalendario--;
      }
      montarCalendario(mesCalendario, anoCalendario);
    }

    document.addEventListener("DOMContentLoaded", () => {
      buscarPetsSalvos();
      atualizarTotais();
      montarCalendario(mesCalendario, anoCalendario);
    });