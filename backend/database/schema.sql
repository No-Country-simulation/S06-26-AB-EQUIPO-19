-- AS DUAS LINHAS MÁGICAS PARA SELECIONAR O BANCO
CREATE DATABASE IF NOT EXISTS appbit_hackathon;
USE appbit_hackathon;

-- 1. MÓDULO BASE (EMPREGABILIDADE E EMPRESAS)
CREATE TABLE Empresa (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_empresa VARCHAR(255) NOT NULL,
    cnpj VARCHAR(18) UNIQUE NOT NULL,
    metas_esg TEXT
);

CREATE TABLE Vaga (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    titulo_vaga VARCHAR(255) NOT NULL,
    skills_exigidas VARCHAR(255) NOT NULL,
    regiao VARCHAR(100) NOT NULL,
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id) ON DELETE CASCADE
);

CREATE TABLE Candidato (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome_completo VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    skills_candidato VARCHAR(255) NOT NULL,
    genero VARCHAR(50),
    raca VARCHAR(50),
    latitude FLOAT,
    longitude FLOAT
);

CREATE TABLE Match_Score (
    id INT AUTO_INCREMENT PRIMARY KEY,
    vaga_id INT NOT NULL,
    candidato_id INT NOT NULL,
    porcentagem_compatibilidade FLOAT NOT NULL,
    badge_diversidade BOOLEAN DEFAULT FALSE,
    justificativa_analise TEXT,
    FOREIGN KEY (vaga_id) REFERENCES Vaga(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES Candidato(id) ON DELETE CASCADE
);

-- 2. MÓDULO DE FORMAÇÕES
CREATE TABLE Curso_Trilha (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    descricao TEXT,
    carga_horaria INT
);

CREATE TABLE Progresso_Treinamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    curso_id INT NOT NULL,
    status_conclusao VARCHAR(50) DEFAULT 'Em Andamento',
    data_atualizacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (curso_id) REFERENCES Curso_Trilha(id) ON DELETE CASCADE
);

-- 3. MÓDULO DE EXPERIÊNCIAS ESTRUTURANTES
CREATE TABLE Evento_Corporativo (
    id INT AUTO_INCREMENT PRIMARY KEY,
    titulo_evento VARCHAR(255) NOT NULL,
    palestrante VARCHAR(255),
    data_evento TIMESTAMP,
    tipo_evento VARCHAR(100) DEFAULT 'Painel/Palestra'
);

-- 4. MÓDULO DE MENTORIAS
CREATE TABLE Mentoria_Networking (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_origem_id INT NOT NULL,
    empresa_destino_id INT NOT NULL,
    pauta_discussao TEXT,
    data_agendamento TIMESTAMP,
    FOREIGN KEY (empresa_origem_id) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (empresa_destino_id) REFERENCES Empresa(id) ON DELETE CASCADE
);

-- 5. MÓDULO DE SAÚDE DO TIME (DADOS ANONIMIZADOS)
CREATE TABLE Saude_Time_Dashboard (
    id INT AUTO_INCREMENT PRIMARY KEY,
    regiao VARCHAR(100) NOT NULL,
    perfil_demografico VARCHAR(100),
    indice_burnout_medio FLOAT,
    indice_exclusao_medio FLOAT,
    data_coleta TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. DATASET INTEGRADO VÍSENT CDRVIEW (ANATEL COBERTURA)
CREATE TABLE Visent_CDRView_Dados (
    id INT AUTO_INCREMENT PRIMARY KEY,
    zona_coordenadas VARCHAR(255) NOT NULL,
    concentracao_talentos VARCHAR(50),
    cobertura_rede VARCHAR(50), 
    latitude_antena FLOAT,
    longitude_antena FLOAT
);

CREATE TABLE Mensagem_Recrutamento (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    candidato_id INT NOT NULL,
    vaga_id INT NOT NULL,
    conteudo TEXT NOT NULL,
    data_envio TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status_leitura VARCHAR(20) DEFAULT 'Não lida',
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES Candidato(id) ON DELETE CASCADE,
    FOREIGN KEY (vaga_id) REFERENCES Vaga(id) ON DELETE CASCADE
);

CREATE TABLE Contratacao_Comissao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    empresa_id INT NOT NULL,
    candidato_id INT NOT NULL,
    vaga_id INT NOT NULL,
    status_contratacao VARCHAR(50) DEFAULT 'Em negociação',
    valor_comissao DECIMAL(10, 2),
    data_registro TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (empresa_id) REFERENCES Empresa(id) ON DELETE CASCADE,
    FOREIGN KEY (candidato_id) REFERENCES Candidato(id) ON DELETE CASCADE,
    FOREIGN KEY (vaga_id) REFERENCES Vaga(id) ON DELETE CASCADE
);
