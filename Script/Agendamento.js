let currentStep = 1;
const totalSteps = 4;
const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

const MESES = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
               'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
const TEMPO_BASE_ATENDIMENTO = 60;

function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
        mudarPasso(currentStep, currentStep + 1);
        currentStep++;
        
        if (currentStep === 4) updateSummary();
    }
}

function prevStep() {
    if (currentStep > 1) {
        mudarPasso(currentStep, currentStep - 1);
        currentStep--;
    }
}

function mudarPasso(de, para) {
    document.getElementById(`step${de}-content`).classList.remove("active");
    document.getElementById(`step${de}`).classList.remove("active");
    
    document.getElementById(`step${para}-content`).classList.add("active");
    document.getElementById(`step${para}`).classList.add("active");
    
    if (para > de) {
        document.getElementById(`step${de}`).classList.add("completed");
    } else {
        document.getElementById(`step${para}`).classList.remove("completed");
    }
}

function selectPet(element) {
    document.querySelectorAll('.pet-card .pet-avatar').forEach(el => 
        el.classList.remove('selected')
    );
    element.querySelector('.pet-avatar').classList.add('selected');
}

function novoPet(){
    window.location.href = "CadastroPet.html";
}

function toggleService(element) {
    element.classList.toggle('selected');
    calculateTotal();
}

function selectTime(element) {
    if (element.classList.contains('disabled')) return;
    
    document.querySelectorAll('.time-slot').forEach(el => 
        el.classList.remove('selected')
    );
    element.classList.add('selected');
}

function selectDay(element) {
    if (element.classList.contains('disabled')) return;
    
    document.querySelectorAll('.calendar-day').forEach(el => 
        el.classList.remove('selected')
    );
    element.classList.add('selected');
}

function calculateTotal() {
    let total = 0;
    let tempoTotal = TEMPO_BASE_ATENDIMENTO;

    document.querySelectorAll('.service-option.selected').forEach(service => {
        const priceText = service.querySelector('.service-price').textContent;
        const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
        if (!isNaN(price)) total += price;

        const timeElement = service.querySelector('.service-time');
        if (timeElement) {
            const minutos = parseInt(timeElement.textContent.replace(/[^\d]/g, ''));
            if (!isNaN(minutos)) tempoTotal += minutos;
        }
    });

    atualizarValorMonetario('.total-row div:last-child', total);
    atualizarValorMonetario('#total-servicos', total);
    atualizarValorMonetario('#total-final', total);
    
    atualizarTempo('#resumo-tempo', tempoTotal);
}

function atualizarValorMonetario(selector, valor) {
    const elementos = document.querySelectorAll(selector);
    elementos.forEach(el => {
        if (el) el.textContent = `R$ ${valor.toFixed(2).replace('.', ',')}`;
    });
}

function atualizarTempo(selector, minutosTotais) {
    const elemento = document.querySelector(selector);
    if (elemento) {
        const horas = Math.floor(minutosTotais / 60);
        const minutos = minutosTotais % 60;
        elemento.textContent = `${horas}h${minutos.toString().padStart(2, '0')}`;
    }
}

function updateSummary() {
    atualizarHorarioResumo();
    atualizarServicosResumo();
    calculateTotal();
}

function atualizarHorarioResumo() {
    const selectedDay = document.querySelector('.calendar-day.selected');
    const selectedTime = document.querySelector('.time-slot.selected');
    const horarioEl = document.getElementById('resumo-horario');
    
    if (horarioEl && selectedDay && selectedTime) {
        const dia = selectedDay.textContent.padStart(2, '0');
        const mes = (currentMonth + 1).toString().padStart(2, '0');
        const horaInicio = selectedTime.textContent.trim();
        const horaFim = `${parseInt(horaInicio) + 1}:00`;
        
        horarioEl.textContent = `${horaInicio} até ${horaFim} - Dia ${dia}/${mes}/${currentYear}`;
    }
}

function atualizarServicosResumo() {
    const container = document.getElementById('servicos-resumo');
    if (!container) return;
    
    container.innerHTML = '<h3 class="section-subtitle">Serviços agendados</h3>';
    
    const pet = document.querySelector('.pet-avatar.selected');
    if (pet) {
        const petName = pet.parentElement.querySelector('.pet-name').textContent;
        container.innerHTML += `
            <div class="pet-info">
                <div class="pet-summary-avatar">${pet.textContent.trim()}</div>
                <div>
                    <div class="pet-name">${petName}</div>
                    <div class="section-subtitle">Profissional: Johny Wellington Fagundes Cursino</div>
                </div>
            </div>
        `;
    }
    
    document.querySelectorAll('.service-option.selected').forEach(service => {
        const name = service.querySelector('.service-name').textContent;
        const price = service.querySelector('.service-price').textContent;
        
        container.innerHTML += `
            <div class="summary-item">
                <div class="summary-label">✓ ${name}</div>
                <div class="summary-value">${price}</div>
            </div>
        `;
    });
}

function validateStep(step) {
    const validacoes = {
        1: () => {
            const selectedPet = document.querySelector('.pet-avatar.selected');
            if (!selectedPet) {
                alert("Por favor, selecione um pet para continuar.");
                return false;
            }
            return true;
        },
        2: () => {
            const selectedServices = document.querySelectorAll('.service-option.selected');
            if (selectedServices.length === 0) {
                alert("Por favor, selecione ao menos um serviço.");
                return false;
            }
            return true;
        },
        3: () => {
            const selectedDay = document.querySelector('.calendar-day.selected');
            const selectedTime = document.querySelector('.time-slot.selected');
            if (!selectedDay || !selectedTime) {
                alert("Selecione a data e o horário do agendamento.");
                return false;
            }
            return true;
        }
    };

    return validacoes[step] ? validacoes[step]() : true;
}

function novoPet() {
    window.location.href = "CadastroPet.html";
}

function finalizarAgendamento() {
    window.location.href = "Obrigado.html";
}

function renderCalendar(month, year) {
    const monthTitle = document.querySelector('.month-title');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevBtn = document.querySelector('.month-nav-button[onclick="prevMonth()"]');

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const isCurrentMonth = month === today.getMonth() && year === today.getFullYear();

    monthTitle.textContent = `${MESES[month]} de ${year}`;

    prevBtn.style.display = isCurrentMonth ? 'none' : 'inline-block';

    calendarGrid.querySelectorAll('.calendar-day').forEach(day => day.remove());

    for (let i = 0; i < firstDay; i++) {
        adicionarDiaCalendario(calendarGrid, '', true);
    }

    for (let day = 1; day <= daysInMonth; day++) {
        const isPast = ehDiaPassado(day, month, year);
        const dayElement = adicionarDiaCalendario(calendarGrid, day, isPast);
        
        if (day === today.getDate() && isCurrentMonth) {
            dayElement.classList.add('selected');
        }
    }
}

function adicionarDiaCalendario(container, texto, desabilitado) {
    const day = document.createElement('div');
    day.classList.add('calendar-day');
    if (texto) day.textContent = texto;
    
    if (desabilitado) {
        day.classList.add('disabled');
    } else {
        day.onclick = () => selectDay(day);
    }
    
    container.appendChild(day);
    return day;
}

function ehDiaPassado(dia, mes, ano) {
    return (ano < today.getFullYear()) ||
           (ano === today.getFullYear() && mes < today.getMonth()) ||
           (ano === today.getFullYear() && mes === today.getMonth() && dia < today.getDate());
}

function nextMonth() {
    currentMonth++;
    if (currentMonth > 11) {
        currentMonth = 0;
        currentYear++;
    }
    renderCalendar(currentMonth, currentYear);
}

function prevMonth() {
    if (currentMonth === today.getMonth() && currentYear === today.getFullYear()) return;

    currentMonth--;
    if (currentMonth < 0) {
        currentMonth = 11;
        currentYear--;
    }
    renderCalendar(currentMonth, currentYear);
}

document.addEventListener("DOMContentLoaded", () => {
    calculateTotal();
    renderCalendar(currentMonth, currentYear);
});