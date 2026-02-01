# 🏥 SISREG PRO - Sistema de Regulação de Protocolos Médicos

> Sistema web interativo para consulta e gestão de protocolos médicos e de regulação, com foco em usabilidade, performance e segurança de dados.

![Status](https://img.shields.io/badge/STATUS-EM_DESENVOLVIMENTO-green)
![Tech](https://img.shields.io/badge/STACK-REACT_%7C_SUPABASE-blue)

## 🎯 Sobre o Projeto

O **SISREG PRO** foi desenvolvido para otimizar o processo de consulta de diretrizes médicas. Diferente de PDFs estáticos ou planilhas extensas, o sistema oferece uma interface visual baseada na anatomia humana, permitindo que o regulador encontre a informação necessária com poucos cliques.

O projeto implementa uma arquitetura **Full Stack Serverless**, utilizando React no Frontend e Supabase (PostgreSQL) no Backend, com forte ênfase em Segurança a Nível de Banco de Dados (RLS).

## 🚀 Funcionalidades Principais

### 🧠 Navegação Intuitiva
- **Mapa Corporal Interativo (SVG):** Seleção de protocolos clicando diretamente nas partes do corpo (Frente/Costas).
- **Busca Global Indexada:** Pesquisa rápida por problema, tipo de exame ou códigos.
- **Dark Mode:** Interface adaptável para conforto visual.

### 🛡️ Segurança e Controle de Acesso (RBAC)
O sistema possui uma hierarquia de permissões rigorosa implementada no Backend:

1.  **👑 Super Admin:**
    - Acesso total ao sistema.
    - **Gestão de Equipe:** Poder exclusivo para promover ou rebaixar usuários.
    - Visualização de logs de auditoria (em roadmap).
2.  **🔒 Admin:**
    - Pode Criar, Editar e Excluir protocolos e subáreas.
    - Não tem acesso à gestão de usuários.
3.  **👤 User:**
    - Acesso apenas para leitura e consulta.
4.  **Visitante:**
    - Bloqueio total. O sistema exige autenticação para exibir qualquer dado.

## 🛠️ Tecnologias Utilizadas

- **Frontend:** React.js (Vite), CSS Modules (Responsivo).
- **Backend / Database:** Supabase (PostgreSQL).
- **Autenticação:** Supabase Auth (Email/Password).
- **Segurança:** PostgreSQL Row Level Security (RLS).
- **Deploy:** Vercel.

## 🔒 Arquitetura de Segurança (Destaque Técnico)

Este projeto não depende apenas do Frontend para segurança. As regras são aplicadas diretamente no banco de dados via **RLS (Row Level Security)**.

- **Proteção contra ataques via F12:** Mesmo que um usuário mal-intencionado manipule o estado do React para habilitar botões de "Excluir", o banco de dados rejeitará a requisição se o token de sessão não tiver a `role` correta.
- **Prevenção de Loops Infinitos:** Utilização de funções `SECURITY DEFINER` para checagem de cargos sem causar recursividade nas políticas de acesso.
- **Triggers Automáticos:** Gatilhos SQL (`plpgsql`) que criam automaticamente o perfil do usuário e definem permissões padrão ao registrar uma nova conta.

## 📂 Estrutura do Banco de Dados

O esquema do banco de dados inclui:
- `protocols`: Tabela principal com regras de negócio.
- `body_parts` & `sub_areas`: Tabelas relacionais para categorização.
- `profiles`: Extensão da tabela de usuários para gestão de cargos (roles).
- `audit_logs`: Registro de alterações para compliance.

*O esquema completo pode ser encontrado no arquivo `database_schema.sql` na raiz do projeto.*

## 💻 Como Rodar Localmente

1. Clone o repositório:
```bash
git clone [https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git](https://github.com/SEU-USUARIO/SEU-REPOSITORIO.git)