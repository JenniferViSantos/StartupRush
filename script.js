const todasStartups = [
  { nome: "CrewAI", slogan: "Torne-se um especialista em multiagentes em horas", ano: 2023 },
  { nome: "Tractian", slogan: "Confiabilidade redefinida, do chão de fábrica à gestão", ano: 2019 },
  { nome: "CRMBonus", slogan: "Crescimento para o seu negócio. Felicidade para o seu cliente.", ano: 2018 },
  { nome: "Stark Bank", slogan: "O Banco das Empresas", ano: 2018 },
  { nome: "Mottu", slogan: "Sempre fortalecendo seu corre", ano: 2020 },
  { nome: "C6 Bank", slogan: "É da sua vida", ano: 2018 },
  { nome: "Solfácil", slogan: "Empoderamos as pessoas através do Sol", ano: 2018 },
  { nome: "Flutterflow ", slogan: "Desenvolva seus aplicativos com rapidez e facilidade", ano: 2020 }
].map(s => ({ ...s, pontos: 70, eventos: criarEventos() }));

let startups = [];
let batalhas = [];
let rodadaAtual = 1;
let historico = [];
let historicoStartups = [];

function criarEventos() {
  return { pitch: 0, bugs: 0, tracao: 0, investidor: 0, fake: 0 };
}

function iniciarTorneio() {
  startups = todasStartups.map(s => ({ ...s }));
  if (historicoStartups.length === 0)
  historicoStartups = startups.map(s => ({
      ...s,
      eventos: { ...s.eventos }
    }));
  
  embaralharStartups();
  criarBatalhas();
  mostrarBatalhas();
  document.getElementById("painelBatalha").innerHTML = "";
  document.getElementById("ranking").innerHTML = "";
}

function embaralharStartups() {
  for (let i = startups.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [startups[i], startups[j]] = [startups[j], startups[i]];
  }
}

function criarBatalhas() {
  batalhas = [];
  for (let i = 0; i < startups.length; i += 2) {
    batalhas.push({
      id: i / 2 + 1,
      startupA: startups[i],
      startupB: startups[i + 1],
      finalizada: false,
      vencedor: null
    });
  }
}

function mostrarBatalhas() {
  const div = document.getElementById("listaBatalhas");
  div.innerHTML = `<h2>Rodada ${rodadaAtual}</h2>`;

  batalhas.forEach((batalha, index) => {
    div.innerHTML += `
      <div class="batalha ${batalha.finalizada ? 'finalizada' : ''}">
        <strong>Batalha ${index + 1}:</strong><br>
        ${batalha.startupA.nome} vs ${batalha.startupB.nome}<br>
        <button onclick="administrarBatalha(${index})">Administrar</button>
        ${batalha.finalizada ? "<span>✔️ Finalizada</span>" : ""}
      </div>
    `;
  });
}

function administrarBatalha(index) {
  const b = batalhas[index];
  const painel = document.getElementById("painelBatalha");

  painel.innerHTML = `
    <h3>Batalha ${index + 1}</h3>
    <p><strong>${b.startupA.nome}:</strong> ${b.startupA.pontos} pontos</p>
    <p><strong>${b.startupB.nome}:</strong> ${b.startupB.pontos} pontos</p>

    <h4>Eventos para ${b.startupA.nome}</h4>
    ${checkboxes("A")}
    <h4>Eventos para ${b.startupB.nome}</h4>
    ${checkboxes("B")}

    <button onclick="concluirBatalha(${index})">Concluir Batalha</button>
  `;

  painel.scrollIntoView({ behavior: 'smooth' });
}

function checkboxes(s) {
  return `
    <label> <input type="checkbox" id="pitch${s}"> Pitch convincente </label>
    <br>
    <label> <input type="checkbox" id="bugs${s}"> Produto com bugs </label>
    <br>
    <label> <input type="checkbox" id="tracao${s}"> Boa tração </label>
    <br>
    <label> <input type="checkbox" id="investidor${s}"> Investidor irritado </label>
    <br>
    <label> <input type="checkbox" id="fake${s}"> Fake news </label>
    <br>
  `;
}

function aplicarEventos(startup, s) {
  if (document.getElementById(`pitch${s}`).checked) { startup.pontos += 6; startup.eventos.pitch++; }
  if (document.getElementById(`bugs${s}`).checked) { startup.pontos -= 4; startup.eventos.bugs++; }
  if (document.getElementById(`tracao${s}`).checked) { startup.pontos += 3; startup.eventos.tracao++; }
  if (document.getElementById(`investidor${s}`).checked) { startup.pontos -= 6; startup.eventos.investidor++; }
  if (document.getElementById(`fake${s}`).checked) { startup.pontos -= 8; startup.eventos.fake++; }
}

function concluirBatalha(index) {
  const b = batalhas[index];
  const a = b.startupA;
  const c = b.startupB;

  aplicarEventos(a, "A");
  aplicarEventos(c, "B");

  let vencedor;
  if (a.pontos > c.pontos) vencedor = a;
  else if (c.pontos > a.pontos) vencedor = c;
  else {
    vencedor = Math.random() < 0.5 ? a : c;
    vencedor.pontos += 2;
    alert("Empate! 🦈 Shark Fight ativada! +2 pontos para " + vencedor.nome);
  }

  vencedor.pontos += 30;
  b.vencedor = vencedor;
  b.finalizada = true;

  alert(`✅ ${vencedor.nome} venceu a batalha! (+30 pontos)`);

  verificarProximaRodada();
  mostrarBatalhas();
  document.getElementById("painelBatalha").innerHTML = "";
}

function verificarProximaRodada() {
  if (batalhas.every(b => b.finalizada)) {
    startups = batalhas.map(b => b.vencedor);
    if (startups.length === 1) {
      mostrarResultadoFinal(startups[0]);
    } else {
      rodadaAtual++;
      criarBatalhas();
      mostrarBatalhas();
    }
  }
}

  // ranking final
  function mostrarResultadoFinal(campea) {
  
  document.getElementById("listaBatalhas").innerHTML = "";
  document.getElementById("painelBatalha").innerHTML = "";

  const ranking = historicoStartups
    .sort((a, b) => b.pontos - a.pontos)
    .map((s, i) => ({
      posicao: i + 1,
      nome: s.nome,
      slogan: s.slogan,
      pontos: s.pontos,
      eventos: s.eventos
    }));

  let html = `
    <h2> <img src= "Imagens/trofeu.png" style= width:50px;  vertical-align:middle; margin-right:10px;> Campeã: ${campea.nome}</h2>
    <p><strong>Slogan:</strong> "${campea.slogan}"</p>
    <p><strong>Pontuação final:</strong> ${campea.pontos}</p>

    <h3>Ranking Final</h3>
    <table>
      <thead>
        <tr>
          <th>Posição</th>
          <th>Startup</th>
          <th>Pontos</th>
          <th>Pitch</th>
          <th>Bugs</th>
          <th>Tração</th>
          <th>Investidor</th>
          <th>Fake News</th>
        </tr>
      </thead>
      <tbody>
  `;

  ranking.forEach(s => {
    html += `
      <tr>
        <td>${s.posicao}</td>
        <td>${s.nome}</td>
        <td>${s.pontos}</td>
        <td>${s.eventos.pitch}</td>
        <td>${s.eventos.bugs}</td>
        <td>${s.eventos.tracao}</td>
        <td>${s.eventos.investidor}</td>
        <td>${s.eventos.fake}</td>
      </tr>
    `;
    document.getElementById("ranking").innerHTML = html;
  });

  html += `
      </tbody>
    </table>
  `;

  document.getElementById("listaBatalhas").innerHTML = html;
}
