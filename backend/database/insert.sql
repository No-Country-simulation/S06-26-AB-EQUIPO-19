-- Exemplo de inserção em assinantes (correto)
INSERT INTO assinantes (assinante_hash, home_municipio, uf, income_cluster, age_group, mobility_pattern, flag_flagship)
VALUES (12345, 'Florianópolis', 'SC', 'C', '55+', 'INTENSA', 1);

-- Exemplo de inserção em concentração
INSERT INTO concentracao (municipio, cluster, periodo, n_usuarios, lat, lon)
VALUES ('Florianópolis', 'Centro', 'TARDE', 850, -27.5954, -48.5480);

INSERT INTO assinantes (assinante_hash, home_municipio, uf, income_cluster, age_group, mobility_pattern, flag_flagship)
VALUES 
(12345, 'Florianópolis', 'SC', 'C', '55+', 'INTENSA', 1),
(12346, 'São José', 'SC', 'A', '25-34', 'MODERADA', 1),
(12347, 'Palhoça', 'SC', 'B', '35-44', 'BAIXA', 0),
(12348, 'Florianópolis', 'SC', 'A', '18-24', 'INTENSA', 1);