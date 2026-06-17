-- ==============================================
-- CRIAÇÃO DO BANCO DE DADOS
-- ==============================================
CREATE DATABASE IF NOT EXISTS appbit_hackathon;
USE appbit_hackathon;

-- ==============================================
-- TABELA 1: ANTENAS
-- Dados de localização das antenas da rede
-- Origem: tensor_antenas.csv
-- ==============================================
CREATE TABLE IF NOT EXISTS antenas (
    ecgi VARCHAR(50) PRIMARY KEY,
    setor VARCHAR(100),
    cluster VARCHAR(100),
    municipio VARCHAR(100),
    uf VARCHAR(2),
    lat FLOAT,
    lon FLOAT,
    tecnologia VARCHAR(10)
);

-- ==============================================
-- TABELA 2: ASSINANTES
-- Base de 200k usuários - Dados para Matching
-- ✅ ALINHADO COM models_db.py e base Vísent
-- ==============================================
CREATE TABLE IF NOT EXISTS assinantes (
    assinante_hash INT PRIMARY KEY,       -- ID anonimizado
    home_cluster VARCHAR(100),            -- Região / Bairro
    home_municipio VARCHAR(100),          -- Município
    uf VARCHAR(2),                        -- Estado
    income_cluster VARCHAR(1),            -- Renda: A, B, C
    age_group VARCHAR(20),                -- Faixa etária: 18-24, 25-34, 55+
    mobility_pattern VARCHAR(50),        -- Mobilidade: INTENSA, MODERADA
    flag_flagship INT                     -- Critério ESG: 1 = grupo sub-representado
);

-- ==============================================
-- TABELA 3: CONCENTRAÇÃO DE MOVIMENTO
-- Dados de fluxo de pessoas por região e horário
-- Usado na rota de Insights / Mapa de Talentos
-- ==============================================
CREATE TABLE IF NOT EXISTS concentracao (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ecgi VARCHAR(50),
    cluster VARCHAR(100),
    municipio VARCHAR(100),
    day_date DATE,
    periodo VARCHAR(20),          -- MADRUGADA / MANHA / TARDE / NOITE
    n_usuarios INT,               -- ✅ Métrica principal: quantidade de pessoas
    n_sessoes INT,
    download_bytes BIGINT,
    upload_bytes BIGINT,
    dur_media_s FLOAT,
    drop_pct_medio FLOAT,
    congestionamento_medio FLOAT,
    chamadas_total INT,
    mensagens_total INT,
    lat FLOAT,
    lon FLOAT
);

-- ==============================================
-- TABELA 4: VAGAS
-- Cadastro de oportunidades de emprego
-- Usado nas rotas de Vagas
-- ==============================================
CREATE TABLE IF NOT EXISTS vagas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cargo VARCHAR(100) NOT NULL,
    descricao VARCHAR(500) NOT NULL,
    escolaridade_requerida VARCHAR(100),
    faixa_salarial VARCHAR(50) NOT NULL,
    localizacao VARCHAR(100) NOT NULL,
    criterios_esg VARCHAR(200),   -- Ex: "PCD, 50+, Mulheres"
    status VARCHAR(20) DEFAULT 'Publicada'
);

-- ==============================================
-- TABELA 5: EMPRESAS
-- Dados das empresas parceiras
-- ==============================================
CREATE TABLE IF NOT EXISTS empresas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100),
    segmento VARCHAR(100),
    cnpj VARCHAR(20),
    cidade VARCHAR(100)
);

-- ==============================================
-- ÍNDICES PARA OTIMIZAÇÃO DE CONSULTAS
-- ==============================================
CREATE INDEX idx_concentracao_municipio ON concentracao(municipio);
CREATE INDEX idx_concentracao_periodo ON concentracao(periodo);
CREATE INDEX idx_concentracao_ecgi ON concentracao(ecgi);

CREATE INDEX idx_assinante_municipio ON assinantes(home_municipio);
CREATE INDEX idx_assinante_renda ON assinantes(income_cluster);
CREATE INDEX idx_assinante_idade ON assinantes(age_group);
CREATE INDEX idx_assinante_esg ON assinantes(flag_flagship);

CREATE INDEX idx_vagas_localizacao ON vagas(localizacao);

-- ==============================================
-- CHAVES ESTRANGEIRAS
-- ==============================================
ALTER TABLE concentracao
    ADD CONSTRAINT fk_concentracao_antena
    FOREIGN KEY (ecgi) REFERENCES antenas(ecgi)
    ON DELETE SET NULL ON UPDATE CASCADE;
