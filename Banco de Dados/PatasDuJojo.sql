CREATE DATABASE sistema_agendamento;
USE sistema_agendamento;

-- TABELA Usuario
DROP TABLE IF EXISTS Usuario;
CREATE TABLE Usuario (
  id_usuario INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  email VARCHAR(100),
  telefone VARCHAR(20)
);


-- TABELA Pet
DROP TABLE IF EXISTS Pet;
CREATE TABLE Pet (
  id_pet INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  tipo VARCHAR(30),
  id_usuario INT,
  FOREIGN KEY (id_usuario) REFERENCES Usuario(id_usuario)
);

-- TABELA Servico
DROP TABLE IF EXISTS Servico;
CREATE TABLE Servico (
  id_servico INT AUTO_INCREMENT PRIMARY KEY,
  nome VARCHAR(100),
  descricao TEXT,
  preco DECIMAL(10,2),
  tempo_estimado INT -- minutos
);

-- TABELA: Agendamento
DROP TABLE IF EXISTS Agendamento;
CREATE TABLE Agendamento (
  id_agendamento INT AUTO_INCREMENT PRIMARY KEY,
  data DATE,
  hora_inicio TIME,
  hora_fim TIME,
  observacoes TEXT,
  id_pet INT,
  FOREIGN KEY (id_pet) REFERENCES Pet(id_pet)
);

-- TABELA Agendamento_Servico
DROP TABLE IF EXISTS Agendamento_Servico;
CREATE TABLE Agendamento_Servico (
  id_agendamento INT,
  id_servico INT,
  PRIMARY KEY (id_agendamento, id_servico),
  FOREIGN KEY (id_agendamento) REFERENCES Agendamento(id_agendamento),
  FOREIGN KEY (id_servico) REFERENCES Servico(id_servico)
);

INSERT INTO Usuario (nome, email, telefone) VALUES
('Ana Lima', 'ana@gmail.com', '11999887766'),
('Carlos Silva', 'carlos@hotmail.com', '21988776655');

INSERT INTO Pet (nome, tipo, id_usuario) VALUES
('Rex', 'Cachorro', 1),
('Tico', 'Gato', 2);

INSERT INTO Servico (nome, descricao, preco, tempo_estimado) VALUES
('Banho completo', 'Banho com shampoo neutro e secagem', 60.00, 30),
('Hidratação', 'Tratamento com creme hidratante para pelos', 35.50, 20);

INSERT INTO Agendamento (data, hora_inicio, hora_fim, observacoes, id_pet) VALUES
('2025-06-10', '14:00', '15:00', 'Pet dócil, alérgico a perfume', 1);

INSERT INTO Agendamento_Servico (id_agendamento, id_servico) VALUES
(1, 1), (1, 2); -- O agendamento 1 terá os serviços 1 e 2
