from sqlmodel import SQLModel, create_engine, Session

DATABASE_URL = "postgresql://david:12345678@localhost:5432/CRManage_DB"

# 注意: SQLModel create_engine 目前不支援 asyncpg，需使用同步版本
engine = create_engine(DATABASE_URL, echo=True)

def create_db_and_tables():
    SQLModel.metadata.create_all(engine)

def get_session():
    with Session(engine) as session:
        yield session
