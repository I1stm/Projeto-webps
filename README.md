# 🏥 SISREG PRO - Sistema de Regulação de Protocolos Médicos

> Uma plataforma visual e interativa para consulta de protocolos médicos baseada na anatomia humana.

![Status](https://img.shields.io/badge/STATUS-BETA-orange)
![Tech](https://img.shields.io/badge/STACK-REACT_%7C_SUPABASE-blue)
![Security](https://img.shields.io/badge/SECURITY-RLS_ENABLED-green)

## 🎯 Sobre o Projeto

O **SISREG PRO** moderniza o acesso a diretrizes de regulação médica. Ao invés de buscar em listas intermináveis ou PDFs estáticos, o regulador utiliza um **Visualizador Anatômico Interativo** para selecionar a região afetada e encontrar os protocolos corretos (exames necessários, locais de atendimento, critérios de encaminhamento).

O sistema foi projetado com uma arquitetura **Data-Driven**: o Frontend desenha o corpo, mas o Banco de Dados (Supabase) define os nomes, as regras e a estrutura hierárquica.

---

## 🚀 Funcionalidades Principais

### 🧠 Visualizador Anatômico Inteligente
* **Navegação Visual:** Modelo SVG interativo com vistas **Frente** e **Costas**.
* **Design Modular:** O corpo é construído por blocos geométricos (CSS-in-JS) para clareza visual.
* **Camada "Pele/Geral" (Silhueta):** Uma camada de fundo inteligente permite clicar no contorno do boneco para selecionar protocolos sistêmicos ou dermatológicos (que não possuem órgão específico).
* **Mapeamento Dinâmico:** O SVG possui IDs técnicos (`coxa-direita`), mas o "cérebro" do sistema busca o nome real (`Membro Inferior D`) no banco de dados em tempo real.

### 🛡️ Administração e Segurança (RBAC)
* **Permissões via Banco de Dados (RLS):**
    * **Visitante:** Acesso negado.
    * **User:** Leitura dos protocolos.
    * **Admin:** Criar/Editar/Excluir protocolos e renomear áreas.
    * **Super Admin:** Gestão de equipe (promover/rebaixar usuários) e auditoria.
* **Live Edit:** Administradores podem renomear partes do corpo e subcategorias clicando diretamente nos títulos (Inline Editing), sem acessar o painel do banco de dados.

### 🔐 Autenticação Completa
* Login via E-mail/Senha.
* Recuperação de Senha (Fluxo completo com link mágico e modal de redefinição).
* Monitoramento de Usuários Online (Presence).

---

## 🛠️ Stack Tecnológica

| Área | Tecnologia | Detalhes |
| :--- | :--- | :--- |
| **Frontend** | **React.js (Vite)** | Hooks personalizados, SVG Manipulável. |
| **Estilização** | **CSS Modules / CSS-in-JS** | Design System limpo e responsivo. |
| **Backend** | **Supabase** | BaaS (Backend as a Service). |
| **Banco de Dados** | **PostgreSQL** | Relacional, com Triggers e Policies. |
| **Segurança** | **Row Level Security (RLS)** | A segurança é aplicada na query do banco. |
| **Deploy** | **Vercel** | Integração contínua (CI/CD). |

---

## 🧩 Arquitetura do Boneco (Destaque Técnico)

O componente `CorpoHumano.jsx` não é apenas um desenho. Ele funciona em camadas:

1.  **Camada 0 (Silhueta):** Desenha o corpo inteiro com uma borda grossa (`strokeWidth: 12`) e cor de pele. Como os vetores se sobrepõem e têm a mesma cor, eles criam uma silhueta perfeita para representar "Pele/Geral".
2.  **Camada 1 (Módulos):** Desenha os blocos (tórax, membros) por cima.
3.  **O "Cérebro" (Mapper):**
    ```javascript
    // Exemplo de como o React traduz o clique
    const resolverAcao = (sqlIdOriginal) => {
       // O SVG diz: "cliquei em coxa-direita"
       // O Mapa diz: "coxa-direita" = "Protocolo de Fêmur"
       return mapaDeNomes[sqlIdOriginal] || sqlIdOriginal;
    };
    ```

---

## 💾 Instalação e Execução

### Pré-requisitos
* Node.js instalado.
* Conta no Supabase.

### 1. Clonar o repositório
```bash
git clone [https://github.com/seu-usuario/sisreg-pro.git](https://github.com/seu-usuario/sisreg-pro.git)
cd sisreg-pro

2. Instalar dependências
Bash
npm install

3. Configurar Variáveis de Ambiente
Crie um arquivo .env na raiz:

Snippet de código
VITE_SUPABASE_URL=sua_url_do_supabase
VITE_SUPABASE_ANON_KEY=sua_key_anonima

4. Configurar o Banco de Dados
Execute o script SQL contido em src/database_schema.sql no Editor SQL do seu projeto Supabase para criar as tabelas (body_parts, protocols, sub_areas) e as políticas de segurança.

Não esqueça de rodar os INSERTS iniciais das partes do corpo!

5. Rodar o projeto
Bash
npm run dev

Visão Frontal,Visão Costas,Modo Edição (Admin)
[<img width="1596" height="754" alt="image" src="https://github.com/user-attachments/assets/cac3f30d-70b2-45ba-8ac3-747650790c6c" />
],[<img width="1599" height="766" alt="image" src="https://github.com/user-attachments/assets/bd9b1c6e-e606-48b6-9f51-a304f6206ea3" />
],[<img width="1590" height="763" alt="image" src="https://github.com/user-attachments/assets/1ad398c6-b660-40ba-bde9-07c8af30fb59" />
]

📄 Licença
Este projeto está sob a licença MIT. Sinta-se livre para usar e modificar.

Desenvolvido com 💙 e React.
