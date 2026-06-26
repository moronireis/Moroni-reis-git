# Import Contacts

Importa contatos de 25 arquivos XLS (Merco) para as tabelas `az_contacts` e `az_contact_brands` no Supabase.

## Dependências

```bash
pip install xlrd requests python-dotenv
```

## Configuração

```bash
cp scripts/.env.example scripts/.env
# Editar scripts/.env com as credenciais do Supabase
```

Variáveis obrigatórias:

| Variável | Descrição |
|----------|-----------|
| `SUPABASE_URL` | URL do projeto Supabase (ex: `https://abc.supabase.co`) |
| `SUPABASE_SERVICE_ROLE_KEY` | Service role key (não a anon key) |

## Pré-requisitos no banco

As tabelas e a tabela `az_brands` devem existir antes de rodar o script. O script lê os `brand_id`s via `GET /rest/v1/az_brands?select=id,slug` — portanto as marcas devem estar cadastradas com os slugs corretos:

`acrimet`, `amoeba`, `bambola`, `bonus`, `br-decor`, `bs-toys`, `buba`, `festa-chic`, `inga`, `kriat`, `mercotoys`, `nathor`, `neoplas`, `pmi`, `polibras`, `rei-do-balde`, `riberball`, `rischioto`, `sert-plast`, `sicad-eurocel`, `silmar`, `tilibra`, `toyng`, `trik-trik`, `wowtoys`

## Execução

```bash
python scripts/import_contacts.py
```

## Lógica de deduplicação

- **Chave primária**: CNPJ (dígitos normalizados)
- Se CNPJ já existe → `merge-duplicates` (upsert sem sobrescrever campos não enviados)
- Se CNPJ novo → inserção
- Vínculo `az_contact_brands` é sempre upsert por `(contact_id, brand_id)`

## Output esperado

```
=== Azeredo IA — Import Contacts ===
Carregando brand IDs...
  25 marcas encontradas no banco: [acrimet, amoeba, ...]

Processando: relatorio ACRIMET.xls → acrimet
  [ACRIMET] 129 registros processados, 45 novos, 84 já existiam, 129 vínculos marca-contato

...

==================================================
RESUMO FINAL
  Arquivos processados : 25
  Arquivos ausentes    : 0
  Contatos processados : XXXX
  Contatos novos       : XXXX
  Contatos existentes  : XXXX
  Vínculos marca-contato: XXXX
==================================================
```

## Fonte dos arquivos

```
/Users/moronireis/Downloads/OneDrive_1_25-06-2026/RELAÇÃO CLIENTES-REPRESENTADAS/
```
