export const dadosRegulacao = {
  // ==========================================================
  // 1. REGIÃO DA CABEÇA
  // ==========================================================
  cerebro: { 
    nome: "Região da Cabeça",
    protocolos: [],
    submenus: [
      { label: "Neurologia (Cérebro)", target: "neurologia" },
      { label: "Oftalmologia (Olhos)", target: "oftalmologia" },
      { label: "Otorrino (Ouvido/Nariz)", target: "otorrino" },
      { label: "Bucomaxilo (Face)", target: "bucomaxilo" }
    ]
  },
  olhos: { nome: "Oftalmologia", protocolos: [], submenus: [{label: "Ver Exames de Vista", target: "oftalmologia"}] },
  mandibula: { nome: "Face", protocolos: [], submenus: [{label: "Ver Bucomaxilo", target: "bucomaxilo"}] },
  ouvidos: { nome: "Ouvidos", protocolos: [], submenus: [{label: "Ver Otorrino", target: "otorrino"}] },

  neurologia: {
    nome: "Neurologia / Neurocirurgia",
    protocolos: [
      { problema: "Cefaleia Crônica (Enxaqueca)", exame: "Consulta Neurologia", locais: ["Ambulatório de Especialidades"] },
      { problema: "Suspeita de AVC Prévio", exame: "Tomografia de Crânio", locais: ["Hospital Regional", "Clínica de Imagem"] }
    ]
  },
  oftalmologia: {
    nome: "Oftalmologia",
    protocolos: [
      { problema: "Baixa Acuidade Visual", exame: "Consulta Oftalmo Geral", locais: ["Clínica de Olhos"] },
      { problema: "Catarata (Idoso)", exame: "Avaliação Cirúrgica Catarata", locais: ["Mutirão da Saúde"] }
    ]
  },
  otorrino: {
    nome: "Otorrinolaringologia",
    protocolos: [
      { problema: "Hipoacusia (Surdez)", exame: "Audiometria Tonal e Vocal", locais: ["Centro Auditivo"] },
      { problema: "Sinusite Crônica", exame: "Videolaringoscopia", locais: ["Clínica Otorrino"] }
    ]
  },
  bucomaxilo: {
    nome: "Cirurgia Bucomaxilofacial",
    protocolos: [
      { problema: "Disfunção de ATM (Estalos)", exame: "Consulta Bucomaxilo", locais: ["CEO - Centro Odontológico"] }
    ]
  },

  // ==========================================================
  // 2. REGIÃO DO PESCOÇO
  // ==========================================================
  pescoco: {
    nome: "Pescoço",
    protocolos: [],
    submenus: [
      { label: "Tireoide (Endócrino)", target: "tireoide" },
      { label: "Linfonodos / Cistos", target: "partesMolesPescoco" }
    ]
  },
  tireoide: {
    nome: "Tireoide",
    protocolos: [
      { problema: "Bócio / Nódulo", exame: "USG Tireoide com Doppler", locais: ["Clínica de Imagem"] },
      { problema: "Hipotireoidismo", exame: "Exames Laboratoriais (TSH/T4)", locais: ["Laboratório Municipal"] }
    ]
  },
  partesMolesPescoco: {
    nome: "Partes Moles (Pescoço)",
    protocolos: [
      { problema: "Cisto Tireoglosso / Íngua", exame: "USG Cervical", locais: ["Clínica de Imagem"] }
    ]
  },

  // ==========================================================
  // 3. TÓRAX (Coração, Pulmão, Mamas)
  // ==========================================================
  peito: {
    nome: "Tórax / Peito",
    protocolos: [],
    submenus: [
      { label: "Cardiologia (Coração)", target: "cardiologia" },
      { label: "Pneumologia (Pulmão)", target: "pneumologia" },
      { label: "Mastologia (Mamas)", target: "mastologia" },
      { label: "Arcabouço Costal (Ossos)", target: "arcaboucoCostal" }
    ]
  },
  cardiologia: {
    nome: "Cardiologia",
    protocolos: [
      { problema: "Dor Torácica / Angina", exame: "Teste Ergométrico", locais: ["Clínica do Coração", "Hospital Regional"] },
      { problema: "Arritmia / Palpitação", exame: "Holter 24h", locais: ["Clínica do Coração"] }
    ]
  },
  pneumologia: {
    nome: "Pneumologia",
    protocolos: [
      { problema: "Asma / DPOC", exame: "Espirometria", locais: ["Ambulatório Pneumo"] },
      { problema: "Nódulo Pulmonar", exame: "Tomografia de Tórax", locais: ["Hospital Regional"] }
    ]
  },
  mastologia: {
    nome: "Mastologia / Mamas",
    protocolos: [
      { problema: "Rastreio (40+ anos)", exame: "Mamografia Bilateral", locais: ["Clínica da Mulher"] },
      { problema: "Nódulo Palpável", exame: "USG Mamas", locais: ["Clínica da Mulher", "Hospital Regional"] }
    ]
  },
  arcaboucoCostal: {
    nome: "Parede Torácica",
    protocolos: [
      { problema: "Dor pós-trauma", exame: "Raio-X de Arcos Costais", locais: ["UPA", "Hospital Municipal"] }
    ]
  },

  // ==========================================================
  // 4. ABDÔMEN E PELVE
  // ==========================================================
  abdomen: { 
    nome: "Abdômen", 
    protocolos: [],
    submenus: [
      { label: "Estômago / Digestivo", target: "gastro" },
      { label: "Fígado / Vesícula", target: "figado" },
      { label: "Rins / Urinário", target: "rins" },
      { label: "Parede Abdominal (Hérnia)", target: "paredeAbdominal" }
    ]
  },
  gastro: {
    nome: "Gastroenterologia",
    protocolos: [{ problema: "Gastrite / Refluxo", exame: "Endoscopia Digestiva Alta", locais: ["Hospital Municipal"] }]
  },
  figado: {
    nome: "Fígado e Vesícula",
    protocolos: [{ problema: "Pedra na Vesícula (Colelítiase)", exame: "USG Abdome Superior", locais: ["Clínica de Imagem"] }]
  },
  rins: {
    nome: "Nefro / Urologia",
    protocolos: [{ problema: "Cálculo Renal (Pedra)", exame: "Tomografia de Vias Urinárias", locais: ["Regional"] }]
  },
  paredeAbdominal: {
    nome: "Cirurgia Geral",
    protocolos: [{ problema: "Hérnia Umbilical / Inguinal", exame: "Consulta Cirurgião Geral", locais: ["Ambulatório Cirúrgico"] }]
  },

  pelvis: { 
    nome: "Pelve / Bacia", 
    protocolos: [],
    submenus: [
      { label: "Ginecologia (Mulher)", target: "ginecologia" },
      { label: "Urologia (Homem)", target: "urologia" },
      { label: "Quadril (Ortopedia)", target: "quadril" }
    ]
  },
  ginecologia: {
    nome: "Ginecologia",
    protocolos: [{ problema: "Sangramento Uterino", exame: "USG Transvaginal", locais: ["Clínica da Mulher"] }]
  },
  urologia: {
    nome: "Urologia (Próstata)",
    protocolos: [{ problema: "HPB / Próstata Aumentada", exame: "USG Próstata + PSA", locais: ["Laboratório", "Imagem"] }]
  },
  quadril: {
    nome: "Ortopedia (Quadril)",
    protocolos: [{ problema: "Artrose de Quadril", exame: "Raio-X de Bacia", locais: ["UPA"] }]
  },

  // ==========================================================
  // 5. COLUNA (Visão Costas)
  // ==========================================================
  nuca: { nome: "Coluna Cervical", protocolos: [], submenus: [{label: "Ver Cervical", target: "colunaCervical"}]},
  
  colunaCervical: { 
    nome: "Coluna Cervical (Pescoço)", 
    protocolos: [{ problema: "Cervicalgia", exame: "Raio-X Coluna Cervical", locais: ["UPA"] }]
  },
  colunaToracica: { 
    nome: "Coluna Torácica (Dorso)", 
    protocolos: [{ problema: "Dor Dorsal", exame: "Raio-X Coluna Torácica", locais: ["UPA"] }]
  },
  colunaLombar: { 
    nome: "Coluna Lombar", 
    protocolos: [],
    submenus: [
      { label: "Dor Lombar Comum", target: "lombalgia" },
      { label: "Hérnia / Nervo Ciático", target: "herniaDisco" }
    ]
  },
  lombalgia: {
    nome: "Lombalgia Mecânica",
    protocolos: [{ problema: "Dor Lombar", exame: "Raio-X Coluna Lombar", locais: ["UPA", "Hospital"] }]
  },
  herniaDisco: {
    nome: "Doenças do Disco",
    protocolos: [{ problema: "Hérnia de Disco / Radiculopatia", exame: "Ressonância Magnética", locais: ["Clínica de Imagem"] }]
  },

  // ==========================================================
  // 6. MEMBROS SUPERIORES E INFERIORES
  // ==========================================================
  
  // -- AQUI ESTAVA O ERRO (Corrigido para 'protocolos') --
  ombroDireito: { nome: "Ombro Direito", protocolos: [], submenus: [{label: "Ortopedia Ombro", target: "ortopediaOmbro"}] },
  ombroEsquerdo: { nome: "Ombro Esquerdo", protocolos: [], submenus: [{label: "Ortopedia Ombro", target: "ortopediaOmbro"}] },
  ortopediaOmbro: {
    nome: "Ombro",
    protocolos: [{ problema: "Bursite / Tendinite", exame: "USG de Ombro", locais: ["Clínica de Imagem"] }]
  },
  
  bracoDireito: { nome: "Braço Direito", protocolos: [] }, // Corrigido
  bracoEsquerdo: { nome: "Braço Esquerdo", protocolos: [] }, // Corrigido
  
  maoDireita: {
    nome: "Mão e Punho",
    protocolos: [],
    submenus: [
      { label: "Punho (Articulação)", target: "punho" },
      { label: "Dedos / Mão", target: "dedos" }
    ]
  },
  maoEsquerda: { nome: "Mão Esquerda", protocolos: [], submenus: [{ label: "Ver Opções Mão", target: "maoDireita"}] }, 
  
  punho: {
    nome: "Punho",
    protocolos: [{ problema: "Cisto Sinovial", exame: "USG Articular", locais: ["Regional"] }]
  },
  dedos: {
    nome: "Mão e Dedos",
    protocolos: [{ problema: "Fratura / Trauma", exame: "Raio-X de Mão", locais: ["UPA"] }]
  },

  // -- INFERIORES --
  pernaDireita: { 
    nome: "Membro Inferior Direito", 
    protocolos: [],
    submenus: [
      { label: "Joelho", target: "joelho" },
      { label: "Vascular (Varizes)", target: "vascular" },
      { label: "Tornozelo e Pé", target: "pe" }
    ]
  },
  pernaEsquerda: { nome: "Membro Inferior Esquerdo", protocolos: [], submenus: [{ label: "Ver Opções Perna", target: "pernaDireita"}] },

  joelho: {
    nome: "Joelho",
    protocolos: [
      { problema: "Artrose de Joelho", exame: "Raio-X de Joelho Carga", locais: ["UPA"] },
      { problema: "Lesão de Menisco/Ligamento", exame: "Ressonância Magnética", locais: ["Clínica de Imagem"] }
    ]
  },
  vascular: {
    nome: "Cirurgia Vascular",
    protocolos: [
      { problema: "Varizes / Insuf. Venosa", exame: "Doppler Colorido Venoso", locais: ["Hospital Regional", "Clínica Vascular"] }
    ]
  },
  pe: {
    nome: "Tornozelo e Pé",
    protocolos: [
      { problema: "Entorse / Trauma", exame: "Raio-X Tornozelo/Pé", locais: ["UPA"] },
      { problema: "Esporão de Calcâneo", exame: "Raio-X Calcâneo", locais: ["UPA"] }
    ]
  },
  
  // Itens extras das costas
  gluteos: { nome: "Glúteos", protocolos: [] },
  posteriorCoxaDireita: { nome: "Posterior de Coxa", protocolos: [] },
  panturrilhaDireita: { nome: "Panturrilha", protocolos: [] }
};