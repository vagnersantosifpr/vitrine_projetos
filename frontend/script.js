document.addEventListener("DOMContentLoaded", () => {
    const projetoContainer = document.querySelector(".projeto-container");
    const anoSelect = document.getElementById("ano-select");
    const pageTitle = document.getElementById("page-title");
    const pageSubTitle = document.getElementById("page-sub-title");
    const footerYear = document.getElementById("footer-year");

    // URL do seu backend. Mude para o endereço do seu servidor publicado quando for o caso.
    
    const API_URL = "https://vitrine-projetos-backend.onrender.com/api";

//    const API_URL = "http://localhost:3000/api";

    // Função para carregar e exibir os projetos via API
    const loadProjetos = async (ano) => {
        projetoContainer.innerHTML = '<p style="text-align: center;">Carregando projetos...</p>';
        try {
            const response = await fetch(`${API_URL}/projects/${ano}`);
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const projetos = await response.json();

            // Limpa o container
            projetoContainer.innerHTML = '';

            if (projetos.length === 0) {
                 projetoContainer.innerHTML = '<p style="text-align: center;">Nenhum projeto encontrado para este ano.</p>';
                 return;
            }

            pageTitle.textContent = `Apresentando a Vitrine dos Projetos 🤖💬`;
            pageSubTitle.textContent = `Turma ${projetos[0].turma}!`; // Pega a turma do primeiro projeto

            projetos.forEach(projeto => {
                const card = document.createElement("div");
                card.classList.add("projeto-card");
                card.innerHTML = `
                    <h2>${projeto.nome}</h2>
                    <p>${projeto.descricao}</p>
                    <a href="${projeto.link}" target="_blank">Acessar Projeto</a>
                    <div class="reactions-container" id="reactions-${projeto._id}">
                        <button class="reaction-btn" data-project-id="${projeto._id}" data-reaction="gostei">
                            👍 <span class="reaction-count" id="gostei-count-${projeto._id}">${projeto.reactions.gostei}</span>
                        </button>
                        <button class="reaction-btn" data-project-id="${projeto._id}" data-reaction="amei">
                            ❤️ <span class="reaction-count" id="amei-count-${projeto._id}">${projeto.reactions.amei}</span>
                        </button>
                        <button class="reaction-btn" data-project-id="${projeto._id}" data-reaction="susto">
                            😮 <span class="reaction-count" id="susto-count-${projeto._id}">${projeto.reactions.susto}</span>
                        </button>
                    </div>
                `;
                projetoContainer.appendChild(card);
            });
        } catch (error) {
            console.error('Erro ao carregar os dados dos projetos:', error);
            projetoContainer.innerHTML = '<p style="text-align: center; color: red;">Não foi possível carregar os dados dos projetos.</p>';
        }
    };

    // Função para enviar uma reação
    const handleReaction = async (event) => {
        const button = event.target.closest('.reaction-btn');
        if (!button) return;

        const { projectId, reaction } = button.dataset;
        
        try {
            const response = await fetch(`${API_URL}/projects/${projectId}/react`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ reaction: reaction })
            });

            if (response.status === 409) {
                alert('Você já reagiu a este projeto!');
                return;
            }

            if (!response.ok) {
                throw new Error('Falha ao registrar reação.');
            }
            
            const updatedProject = await response.json();

            // Atualiza a contagem na tela
            document.getElementById(`gostei-count-${projectId}`).textContent = updatedProject.reactions.gostei;
            document.getElementById(`amei-count-${projectId}`).textContent = updatedProject.reactions.amei;
            document.getElementById(`susto-count-${projectId}`).textContent = updatedProject.reactions.susto;

            // Desabilita os botões para este projeto para evitar cliques múltiplos
            const reactionContainer = document.getElementById(`reactions-${projectId}`);
            reactionContainer.querySelectorAll('.reaction-btn').forEach(btn => btn.classList.add('disabled'));

        } catch (error) {
            console.error('Erro ao enviar reação:', error);
            alert('Ocorreu um erro ao registrar sua reação. Tente novamente.');
        }
    };

    // Adiciona o listener de clique no container (event delegation)
    projetoContainer.addEventListener('click', handleReaction);

    // Inicialização
    const inicializar = () => {
        // Por enquanto, vamos manter os anos fixos, mas isso poderia vir de uma API no futuro
        const anos = ["2025"]; // Adicione outros anos se tiver
        
        // Popula o seletor de ano
        anos.forEach(ano => {
            const option = document.createElement("option");
            option.value = ano;
            option.textContent = ano;
            anoSelect.appendChild(option);
        });

        const anoInicial = anos[0];
        anoSelect.value = anoInicial;
        footerYear.textContent = `© ${anoInicial} - Vitrine de Projetos`;
        loadProjetos(anoInicial);

        // Adiciona o listener para a mudança de ano
        anoSelect.addEventListener("change", (event) => {
            const anoSelecionado = event.target.value;
            footerYear.textContent = `© ${anoSelecionado} - Vitrine de Projetos`;
            loadProjetos(anoSelecionado);
        });
    };
    
    inicializar();
});