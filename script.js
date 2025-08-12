document.addEventListener("DOMContentLoaded", () => {
    const projetoContainer = document.querySelector(".projeto-container");
    const anoSelect = document.getElementById("ano-select");
    const pageTitle = document.getElementById("page-title");
    const pageSubTitle = document.getElementById("page-sub-title");
    const footerYear = document.getElementById("footer-year");

    let allData; 

    // Função para carregar e exibir os projetos
    const loadProjetos = (ano) => {
        const anoData = allData[ano];
        if (!anoData) return;

        // Limpa o container de projetos
        projetoContainer.innerHTML = '';

        // Atualiza o título da página
        pageTitle.textContent = `Apresentando a Vitrine dos Projetos 🤖💬`;

        // Atualiza o subtítulo da página
        pageSubTitle.textContent = `Turma ${anoData.turma}!`;
        
        // Adiciona os cards dos projetos
        anoData.projetos.forEach(projeto => {
            const card = document.createElement("div");
            card.classList.add("projeto-card");
            card.innerHTML = `
                <h2>${projeto.nome}</h2>
                <p>${projeto.descricao}</p>
                <a href="${projeto.link}" target="_blank">Acessar Projeto</a>
            `;
            projetoContainer.appendChild(card);
        });
    };

    // Carrega os dados do JSON
    fetch('apps.json')
        .then(response => response.json())
        .then(data => {
            allData = data;
            const anos = Object.keys(allData).sort((a, b) => b - a); // Ordena os anos em ordem decrescente

            // Popula o seletor de ano
            anos.forEach(ano => {
                const option = document.createElement("option");
                option.value = ano;
                option.textContent = ano;
                anoSelect.appendChild(option);
            });

            // Define o ano mais recente como padrão
            const anoMaisRecente = anos[0];
            anoSelect.value = anoMaisRecente;
            footerYear.textContent = `© ${anoMaisRecente} - Vitrine de Projetos`;

            // Carrega os projetos do ano mais recente
            loadProjetos(anoMaisRecente);

            // Adiciona o listener para a mudança de ano
            anoSelect.addEventListener("change", (event) => {
                const anoSelecionado = event.target.value;
                footerYear.textContent = `© ${anoSelecionado} - Vitrine de Projetos`;
                loadProjetos(anoSelecionado);
            });
        })
        .catch(error => {
            console.error('Erro ao carregar os dados dos projetos:', error);
            projetoContainer.innerHTML = '<p style="text-align: center; color: red;">Não foi possível carregar os dados dos projetos.</p>';
        });
});