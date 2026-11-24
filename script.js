const API_URL = 'https://eventos-academicos-api.onrender.com';

const form = document.getElementById('form-evento');
const lista = document.getElementById('lista-eventos');
const mensagem = document.getElementById('mensagem');

function formatarData(data) {
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

async function carregarEventos() {
  try {
    const resposta = await fetch(`${API_URL}/eventos`);
    const eventos = await resposta.json();

    if (!resposta.ok) {
      throw new Error(eventos.erro);
    }

    lista.innerHTML = '';

    if (eventos.length === 0) {
      lista.innerHTML = '<tr><td colspan="5">Nenhum evento cadastrado.</td></tr>';
      return;
    }

    eventos.forEach((evento) => {
      const tr = document.createElement('tr');
      const colunas = [evento.id, evento.titulo, evento.descricao || '-', evento.data_evento, evento.local];

      colunas.forEach((valor) => {
        const td = document.createElement('td');
        td.textContent = valor;
        tr.appendChild(td);
      });

      lista.appendChild(tr);
    });
  } catch (erro) {
    console.error(erro);
    lista.innerHTML = '<tr><td colspan="5">Erro ao carregar os eventos.</td></tr>';
  }
}

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  const botao = form.querySelector('button');
  botao.disabled = true;
  mensagem.textContent = '';
  mensagem.className = '';

  const evento = {
    titulo: document.getElementById('titulo').value.trim(),
    descricao: document.getElementById('descricao').value.trim(),
    data_evento: formatarData(document.getElementById('data_evento').value),
    local: document.getElementById('local').value.trim()
  };

  try {
    const resposta = await fetch(`${API_URL}/eventos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(evento)
    });

    const resultado = await resposta.json();

    if (!resposta.ok) {
      throw new Error(resultado.erro);
    }

    mensagem.textContent = 'Evento cadastrado com sucesso!';
    mensagem.className = 'sucesso';
    form.reset();
    carregarEventos();
  } catch (erro) {
    mensagem.textContent = erro.message || 'Erro ao cadastrar o evento.';
    mensagem.className = 'erro';
  } finally {
    botao.disabled = false;
  }
});

carregarEventos();
