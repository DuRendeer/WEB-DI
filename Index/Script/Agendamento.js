let currentStep = 1;
const totalSteps = 4;

const today = new Date();
let currentMonth = today.getMonth();
let currentYear = today.getFullYear();

function nextStep() {
    if (!validateStep(currentStep)) return;

    if (currentStep < totalSteps) {
        document.getElementById(`step${currentStep}-content`).classList.remove("active");
        document.getElementById(`step${currentStep}`).classList.remove("active");
        document.getElementById(`step${currentStep}`).classList.add("completed");

        currentStep++;
        document.getElementById(`step${currentStep}-content`).classList.add("active");
        document.getElementById(`step${currentStep}`).classList.add("active");

        if (currentStep === 4) updateSummary();
    }
}

function prevStep() {
    if (currentStep > 1) {
        document.getElementById(`step${currentStep}-content`).classList.remove("active");
        document.getElementById(`step${currentStep}`).classList.remove("active");

        currentStep--;
        document.getElementById(`step${currentStep}-content`).classList.add("active");
        document.getElementById(`step${currentStep}`).classList.add("active");
        document.getElementById(`step${currentStep}`).classList.remove("completed");
    }
}

function selectPet(element) {
    document.querySelectorAll('.pet-card .pet-avatar').forEach(el => el.classList.remove('selected'));
    element.querySelector('.pet-avatar').classList.add('selected');
}

function toggleService(element) {
    element.classList.toggle('selected');
    calculateTotal();
}

function selectTime(element) {
    if (element.classList.contains('disabled')) return;
    document.querySelectorAll('.time-slot').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function selectDay(element) {
    if (element.classList.contains('disabled')) return;
    document.querySelectorAll('.calendar-day').forEach(el => el.classList.remove('selected'));
    element.classList.add('selected');
}

function calculateTotal() {
    let total = 0;
    let tempoTotal = 60;

    const selectedServices = document.querySelectorAll('.service-option.selected');

    selectedServices.forEach(service => {
        const priceText = service.querySelector('.service-price').textContent;
        const price = parseFloat(priceText.replace(/[^\d,]/g, '').replace(',', '.'));
        if (!isNaN(price)) total += price;

        const timeText = service.querySelector('.service-time');
        if (timeText) {
            const minutos = parseInt(timeText.textContent.replace(/[^\d]/g, ''));
            if (!isNaN(minutos)) tempoTotal += minutos;
        }
    });

    document.querySelectorAll('.total-row div:last-child').forEach(el => {
        el.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
    });

    const tempoEl = document.getElementById('resumo-tempo');
    if (tempoEl) {
        const horas = Math.floor(tempoTotal / 60);
        const minutos = tempoTotal % 60;
        tempoEl.textContent = `${horas}h${minutos.toString().padStart(2, '0')}`;
    }

    const summaryTotal = document.querySelector('.summary-section .summary-item .summary-value');
    if (summaryTotal) summaryTotal.textContent = `R$ ${total.toFixed(2).replace('.', ',')}`;
}

function updateSummary() {
    const selectedDay = document.querySelector('.calendar-day.selected');
    const selectedTime = document.querySelector('.time-slot.selected');
    const dayText = selectedDay ? selectedDay.textContent.trim() : '';
    const hour = selectedTime ? selectedTime.textContent.trim() : '';

    const horarioEl = document.getElementById('resumo-horario');
    if (horarioEl && selectedDay && selectedTime) {
        const horaInicio = hour;
        const horaFim = `${parseInt(hour) + 1}:00`;
        const dia = selectedDay.textContent.padStart(2, '0');
        const mes = (currentMonth + 1).toString().padStart(2, '0');
        const dataFormatada = `${dia}/${mes}/${currentYear}`;

        horarioEl.textContent = `${horaInicio} até ${horaFim} - Dia ${dataFormatada}`;
    }


    const summaryContainer = document.querySelectorAll('.summary-section')[1];
    summaryContainer.innerHTML = '<h3 class="section-subtitle">Serviços agendados</h3>';

    const pet = document.querySelector('.pet-avatar.selected');
    const petName = pet ? pet.parentElement.querySelector('.pet-name').textContent : '';

    const petHTML = `
        <div class="pet-info">
            <div class="pet-summary-avatar">${pet?.textContent.trim()}</div>
            <div>
                <div class="pet-name">${petName}</div>
                <div class="section-subtitle">Profissional: Johny Wellington Fagundes Cursino</div>
            </div>
        </div>
    `;
    summaryContainer.insertAdjacentHTML('beforeend', petHTML);

    const selectedServices = document.querySelectorAll('.service-option.selected');
    selectedServices.forEach(service => {
        const name = service.querySelector('.service-name').textContent;
        const price = service.querySelector('.service-price').textContent;

        const item = `
            <div class="summary-item">
                <div class="summary-label">✓ ${name}</div>
                <div class="summary-value">${price}</div>
            </div>
        `;
        summaryContainer.insertAdjacentHTML('beforeend', item);
    });

    calculateTotal();
}

function validateStep(step) {
    if (step === 1) {
        const selectedPet = document.querySelector('.pet-avatar.selected');
        if (!selectedPet) {
            alert("Por favor, selecione um pet para continuar.");
            return false;
        }
    }

    if (step === 2) {
        const selectedServices = document.querySelectorAll('.service-option.selected');
        if (selectedServices.length === 0) {
            alert("Por favor, selecione ao menos um serviço.");
            return false;
        }
    }

    if (step === 3) {
        const selectedDay = document.querySelector('.calendar-day.selected');
        const selectedTime = document.querySelector('.time-slot.selected');
        if (!selectedDay || !selectedTime) {
            alert("Selecione a data e o horário do agendamento.");
            return false;
        }
    }

    return true;
}

function finalizarAgendamento() {
    window.location.href = "Obrigado.html";
}

function renderCalendar(month, year) {
    const monthTitle = document.querySelector('.month-title');
    const calendarGrid = document.querySelector('.calendar-grid');
    const prevBtn = document.querySelector('.month-nav-button[onclick="prevMonth()"]');

    const date = new Date(year, month, 1);
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const startDay = date.getDay(); // dia da semana do primeiro dia do mês

    // Atualiza título
    const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                   'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
    monthTitle.textContent = `${meses[month]} de ${year}`;

    // Habilita/desabilita botão voltar
    if (month === today.getMonth() && year === today.getFullYear()) {
        prevBtn.style.display = 'none';
    } else {
        prevBtn.style.display = 'inline-block';
    }

    // Limpa dias antigos (exceto cabeçalho)
    calendarGrid.querySelectorAll('.calendar-day').forEach(day => day.remove());

    // Preenche espaços antes do primeiro dia
    for (let i = 0; i < startDay; i++) {
        const empty = document.createElement('div');
        empty.classList.add('calendar-day', 'disabled');
        calendarGrid.appendChild(empty);
    }

    // Preenche os dias do mês
    for (let d = 1; d <= daysInMonth; d++) {
        const day = document.createElement('div');
        day.classList.add('calendar-day');
        day.textContent = d;

        const isPast = (year < today.getFullYear()) ||
                       (year === today.getFullYear() && month < today.getMonth()) ||
                       (year === today.getFullYear() && month === today.getMonth() && d < today.getDate());

        if (isPast) {
            day.classList.add('disabled');
        } else {
            day.onclick = () => selectDay(day);
        }

        if (d === today.getDate() && month === today.getMonth() && year === today.getFullYear()) {
            day.classList.add('selected');
        }

        calendarGrid.appendChild(day);
    }
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
