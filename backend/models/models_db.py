from sqlalchemy import Column, Integer, String, Float, Date, BigInteger, Boolean
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()

# ==============================================
# TABELA: ANTENAS
# ==============================================
class Antena(Base):
    __tablename__ = "antenas"
    ecgi = Column(String(50), primary_key=True)
    setor = Column(String(100))
    cluster = Column(String(100))
    municipio = Column(String(100))
    uf = Column(String(2))
    lat = Column(Float)
    lon = Column(Float)
    tecnologia = Column(String(10))

# ==============================================
# TABELA: ASSINANTES
# ==============================================
class Assinante(Base):
    __tablename__ = "assinantes"
    assinante_hash = Column(Integer, primary_key=True)
    home_cluster = Column(String(100))       # Antes era bairro
    home_municipio = Column(String(100))     # Antes era municipio
    income_cluster = Column(String(1))       # A, B, C (renda)
    age_group = Column(String(20))           # 18-24, 25-34, 55+
    mobility_pattern = Column(String(50))   # INTENSA, MODERADA
    flag_flagship = Column(Integer)          # 0 = comum, 1 = grupo sub-representado

    # Propriedades para o código continuar funcionando sem erro
    @property
    def municipio(self):
        return self.home_municipio

    @property
    def bairro(self):
        return self.home_cluster

    @property
    def faixa_salarial(self):
        return self.income_cluster

    @property
    def idade(self):
        try:
            return int(self.age_group.split("-")[0].replace("+", ""))
        except:
            return 0

    @property
    def deficiente(self):
        # Usamos flag_flagship como critério ESG
        return self.flag_flagship == 1

    @property
    def ocupacao(self):
        return f"Perfil Renda {self.income_cluster}"

    @property
    def escolaridade(self):
        return "Dados de Mobilidade"

# ==============================================
# TABELA: CONCENTRAÇÃO
# ==============================================
class Concentracao(Base):
    __tablename__ = "concentracao"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ecgi = Column(String(50))
    cluster = Column(String(100))
    municipio = Column(String(100))
    day_date = Column(Date)
    periodo = Column(String(20))
    n_usuarios = Column(Integer)
    n_sessoes = Column(Integer)
    download_bytes = Column(BigInteger)
    upload_bytes = Column(BigInteger)
    dur_media_s = Column(Float)
    drop_pct_medio = Column(Float)
    congestionamento_medio = Column(Float)
    chamadas_total = Column(Integer)
    mensagens_total = Column(Integer)
    lat = Column(Float)
    lon = Column(Float)

# ==============================================
# TABELA: FLUXO DE VIAS
# ==============================================
class FluxoVias(Base):
    __tablename__ = "fluxo_vias"
    id = Column(Integer, primary_key=True, autoincrement=True)
    ecgi_origem = Column(String(50))
    cluster_origem = Column(String(100))
    municipio_origem = Column(String(100))
    ecgi_destino = Column(String(50))
    cluster_destino = Column(String(100))
    municipio_destino = Column(String(100))
    n_usuarios = Column(Integer)
    dist_km = Column(Float)

# ==============================================
# TABELA: VAGAS
# ==============================================
# PERMITE VALORES NULOS
class Vaga(Base):
    __tablename__ = "vagas"

    id = Column(Integer, primary_key=True, index=True)
    cargo = Column(String, nullable=False)
    descricao = Column(String, nullable=False)
    escolaridade_requerida = Column(String, nullable=True) 
    faixa_salarial = Column(String, nullable=False)
    localizacao = Column(String, nullable=False)
    criterios_esg = Column(String, nullable=True)
    status = Column(String, default="Publicada")

# ==============================================
# TABELA: EMPRESAS
# ==============================================
class Empresa(Base):
    __tablename__ = "empresas"
    id = Column(Integer, primary_key=True, autoincrement=True)
    nome = Column(String(100))
    segmento = Column(String(100))
    cnpj = Column(String(20))
    cidade = Column(String(100))