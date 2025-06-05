class UserManager {
    constructor() {
        this.registeredUsers = new Map();
    }

    registerUser(userData) {
        const userKey = userData.email.toLowerCase();
        this.registeredUsers.set(userKey, {
            ...userData,
            registeredAt: new Date()
        });
        return true;
    }

    userExists(identifier) {
        const key = identifier.toLowerCase();
        if (this.registeredUsers.has(key)) {
            return true;
        }
        for (let [email, userData] of this.registeredUsers) {
            if (userData.cpf === identifier) {
                return true;
            }
        }
        return false;
    }

    validateLogin(identifier, password) {
        const key = identifier.toLowerCase();
        let userData = null;

        if (this.registeredUsers.has(key)) {
            userData = this.registeredUsers.get(key);
        } else {
            for (let [email, user] of this.registeredUsers) {
                if (user.cpf === identifier) {
                    userData = user;
                    break;
                }
            }
        }

        if (userData && userData.password === password) {
            return { success: true, user: userData };
        }

        if (userData) {
            return { success: false, error: 'Senha incorreta' };
        }

        return { success: false, error: 'Usuário não encontrado' };
    }

    getAllUsers() {
        return Array.from(this.registeredUsers.values());
    }
}

const userManager = new UserManager();

function showLogin() {
    document.getElementById('login-page').classList.add('active');
    document.getElementById('registration-page').classList.remove('active');
}

function showRegistration() {
    document.getElementById('login-page').classList.remove('active');
    document.getElementById('registration-page').classList.add('active');
}

function showModal(modalId) {
    document.getElementById(modalId).style.display = 'block';
}

function closeModal() {
    document.querySelectorAll('.modal').forEach(modal => {
        modal.style.display = 'none';
    });
}

function closeModalAndGoToRegister() {
    closeModal();
    showRegistration();
}

function showSuccessModal(message) {
    document.getElementById('successMessage').textContent = message;
    showModal('successModal');
}

function togglePassword(inputId) {
    const passwordInput = document.getElementById(inputId);
    const toggleButton = passwordInput.nextElementSibling;
    
    if (passwordInput.type === 'password') {
        passwordInput.type = 'text';
        toggleButton.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M3.707 2.293a1 1 0 00-1.414 1.414l14 14a1 1 0 001.414-1.414l-1.473-1.473A10.014 10.014 0 0019.542 10C18.268 5.943 14.478 3 10 3a9.958 9.958 0 00-4.512 1.074l-1.78-1.781zm4.261 4.26l1.514 1.515a2.003 2.003 0 012.45 2.45l1.514 1.514a4 4 0 00-5.478-5.478z" clip-rule="evenodd"/>
                <path d="M12.454 16.697L9.75 13.992a4 4 0 01-3.742-3.741L2.335 6.578A9.98 9.98 0 00.458 10c1.274 4.057 5.065 7 9.542 7 .847 0 1.669-.105 2.454-.303z"/>
            </svg>
        `;
    } else {
        passwordInput.type = 'password';
        toggleButton.innerHTML = `
            <svg width="20" height="20" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 12a2 2 0 100-4 2 2 0 000 4z"/>
                <path fill-rule="evenodd" d="M.458 10C1.732 5.943 5.522 3 10 3s8.268 2.943 9.542 7c-1.274 4.057-5.064 7-9.542 7S1.732 14.057.458 10zM14 10a4 4 0 11-8 0 4 4 0 018 0z" clip-rule="evenodd"/>
            </svg>
        `;
    }
}

function formatCPF(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d{1,2})/, '$1-$2')
        .replace(/(-\d{2})\d+?$/, '$1');
}

function formatPhone(value) {
    return value
        .replace(/\D/g, '')
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{4})(\d)/, '$1-$2')
        .replace(/(\d{4})-(\d)(\d{4})/, '$1$2-$3')
        .replace(/(-\d{4})\d+?$/, '$1');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

function validateCPF(cpf) {
    cpf = cpf.replace(/[^\d]+/g, '');
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;
    
    let sum = 0;
    for (let i = 0; i < 9; i++) {
        sum += parseInt(cpf.charAt(i)) * (10 - i);
    }
    let rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(9))) return false;
    
    sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(cpf.charAt(i)) * (11 - i);
    }
    rev = 11 - (sum % 11);
    if (rev === 10 || rev === 11) rev = 0;
    if (rev !== parseInt(cpf.charAt(10))) return false;
    
    return true;
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    field.classList.add('error');
    errorDiv.textContent = message;
    errorDiv.style.display = 'block';
}

function clearError(fieldId) {
    const field = document.getElementById(fieldId);
    const errorDiv = document.getElementById(fieldId + '-error');
    field.classList.remove('error');
    errorDiv.style.display = 'none';
}

document.addEventListener('DOMContentLoaded', function() {
    const cpfInput = document.getElementById('reg-cpf');
    if (cpfInput) {
        cpfInput.addEventListener('input', function(e) {
            e.target.value = formatCPF(e.target.value);
        });
    }

    const phoneInput = document.getElementById('reg-phone');
    if (phoneInput) {
        phoneInput.addEventListener('input', function(e) {
            e.target.value = formatPhone(e.target.value);
        });
    }

    window.addEventListener('click', function(e) {
        if (e.target.classList.contains('modal')) {
            closeModal();
        }
    });

    document.getElementById('login-form').addEventListener('submit', function(e) {
        e.preventDefault();
        const identifier = document.getElementById('email').value.trim();
        const password = document.getElementById('password').value;
        
        let hasErrors = false;

        clearError('email');
        clearError('password');

        if (!identifier) {
            showError('email', 'Por favor, digite seu e-mail ou CPF.');
            hasErrors = true;
        }

        if (!password) {
            showError('password', 'Por favor, digite sua senha.');
            hasErrors = true;
        }

        if (!hasErrors) {
            const loginResult = userManager.validateLogin(identifier, password);
            
            if (loginResult.success) {
                showSuccessModal(`Bem-vindo de volta, ${loginResult.user.firstName}! Login realizado com sucesso.`);
                document.getElementById('login-form').reset();
            } else {
                if (loginResult.error === 'Usuário não encontrado') {
                    showModal('userNotFoundModal');
                } else if (loginResult.error === 'Senha incorreta') {
                    showError('password', 'Senha incorreta. Tente novamente.');
                }
            }
        }
    });

    document.getElementById('registration-form').addEventListener('submit', function(e) {
        e.preventDefault();
        
        const firstName = document.getElementById('reg-first-name').value.trim();
        const lastName = document.getElementById('reg-last-name').value.trim();
        const email = document.getElementById('reg-email').value.trim();
        const cpf = document.getElementById('reg-cpf').value;
        const phone = document.getElementById('reg-phone').value;
        const birthDate = document.getElementById('reg-birth-date').value;
        const gender = document.getElementById('reg-gender').value;
        const password = document.getElementById('reg-password').value;
        const confirmPassword = document.getElementById('reg-confirm-password').value;
        const termsAgreed = document.getElementById('terms-agreement').checked;
        const newsletterAgreed = document.getElementById('newsletter-agreement').checked;

        let hasErrors = false;

        // Clear all previous errors
        const errorFields = [
            'reg-first-name', 'reg-last-name', 'reg-email', 'reg-cpf', 
            'reg-phone', 'reg-birth-date', 'reg-password', 'reg-confirm-password'
        ];
        errorFields.forEach(field => clearError(field));

        if (!firstName) {
            showError('reg-first-name', 'Nome é obrigatório.');
            hasErrors = true;
        }

        if (!lastName) {
            showError('reg-last-name', 'Sobrenome é obrigatório.');
            hasErrors = true;
        }

        if (!email) {
            showError('reg-email', 'E-mail é obrigatório.');
            hasErrors = true;
        } else if (!validateEmail(email)) {
            showError('reg-email', 'Digite um e-mail válido.');
            hasErrors = true;
        } else if (userManager.userExists(email)) {
            showError('reg-email', 'Este e-mail já está cadastrado.');
            hasErrors = true;
        }

        if (!cpf) {
            showError('reg-cpf', 'CPF é obrigatório.');
            hasErrors = true;
        } else if (!validateCPF(cpf)) {
            showError('reg-cpf', 'Digite um CPF válido.');
            hasErrors = true;
        } else if (userManager.userExists(cpf)) {
            showError('reg-cpf', 'Este CPF já está cadastrado.');
            hasErrors = true;
        }

        if (!phone) {
            showError('reg-phone', 'Telefone é obrigatório.');
            hasErrors = true;
        }

        if (!birthDate) {
            showError('reg-birth-date', 'Data de nascimento é obrigatória.');
            hasErrors = true;
        } else {
            const today = new Date();
            const birth = new Date(birthDate);
            const age = today.getFullYear() - birth.getFullYear();
            
            if (age < 13) {
                showError('reg-birth-date', 'Você deve ter pelo menos 13 anos para se cadastrar.');
                hasErrors = true;
            }
        }

        if (!password) {
            showError('reg-password', 'Senha é obrigatória.');
            hasErrors = true;
        } else if (password.length < 8) {
            showError('reg-password', 'Senha deve ter pelo menos 8 caracteres.');
            hasErrors = true;
        }

        if (!confirmPassword) {
            showError('reg-confirm-password', 'Confirmação de senha é obrigatória.');
            hasErrors = true;
        } else if (password !== confirmPassword) {
            showError('reg-confirm-password', 'Senhas não coincidem.');
            hasErrors = true;
        }

        if (!termsAgreed) {
            alert('Você deve aceitar os Termos de Uso e Política de Privacidade.');
            hasErrors = true;
        }

        if (!hasErrors) {
            const userData = {
                firstName,
                lastName,
                email,
                cpf,
                phone,
                birthDate,
                gender,
                password,
                newsletterAgreed
            };

            const registrationSuccess = userManager.registerUser(userData);

            if (registrationSuccess) {
                alert(`Parabéns, ${firstName}! Sua conta foi criada com sucesso. Agora você pode fazer login.`);
                setTimeout(() => {
                    document.getElementById('registration-form').reset();
                    closeModal();
                    showLogin();
                }, 2000);
            } else {
                alert('Erro ao criar conta. Tente novamente.');
            }
        }
    });

    document.querySelector('.quick-access-btn').addEventListener('click', function() {
        const email = document.getElementById('email').value.trim();
        
        if (!email) {
            showError('email', 'Digite seu e-mail para receber o código de acesso.');
            return;
        }

        if (!userManager.userExists(email)) {
            showModal('userNotFoundModal');
            return;
        }

        showSuccessModal('Código de acesso rápido enviado para seu e-mail!');
    });
});