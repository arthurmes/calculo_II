# Visualizações interativas para Cálculo II

Este repositório reúne laboratórios interativos de Cálculo II, incluindo curvas e campos vetoriais, superfícies, mudanças de coordenadas e integrais. As páginas são publicadas a partir da pasta `docs/` e utilizam:

- Python
- Plotly
- HTML
- JavaScript (para controles interativos)
- GitHub Pages

## Estrutura

```text
.
├── docs/
│   ├── index.html
│   ├── assets/
│   │   └── site.css
│   └── superficies/
│       ├── paraboloide.html
│       ├── sela.html
│       ├── plano_tangente.html
│       └── solido_paraboloide.html
├── make_surfaces.py
├── requirements.txt
└── README.md
```

## Como gerar novamente as superfícies

Instale as dependências:

```bash
pip install -r requirements.txt
```

Rode:

```bash
python make_surfaces.py
```

Os arquivos HTML serão gerados dentro de:

```text
docs/superficies/
```

## Como publicar no GitHub Pages

1. Crie um repositório no GitHub.
2. Envie todos estes arquivos para o repositório.
3. Vá em `Settings > Pages`.
4. Em `Build and deployment`, escolha `Deploy from a branch`.
5. Em `Branch`, escolha `main` e a pasta `/docs`.
6. Salve.

Depois de alguns instantes, o GitHub mostrará o link público do site.

## Observação sobre celular

As figuras foram geradas com malhas leves, pensadas para funcionar bem em celulares.
Se uma superfície ficar lenta, reduza o número de pontos em `np.linspace`.

## Fatias em integrais duplas

A página `docs/superficies/fatias_integrais_duplas.html` reúne exemplos da Lista 4 com:

- superfície `z = f(x,y)` sobre a região de integração;
- região projetada no plano `xy`;
- fatia móvel com `x` fixo ou `y` fixo;
- limites da fatia e a integral iterada correspondente;
- exemplos dos exercícios 3, 5(c), 6 e 7.

Essa página usa Plotly diretamente no navegador para permitir mover a fatia com um controle deslizante.


## Funções e campos vetoriais

As páginas novas ficam em:

- `docs/vetoriais/curvas.html`: 20 exemplos de funções vetoriais no plano e no espaço. Controles do parâmetro, sentido do percurso, vetor posição, primeira e segunda derivadas, reta tangente, comprimento de arco, rapidez, curvatura e, quando apropriado, superfícies de referência (interseção, cilindro, cone ou toro).
- `docs/vetoriais/campos.html`: 24 exemplos de campos vetoriais em 2D e 3D. Setas e linhas integrais, normalização, densidade da amostragem, mapas de curvas de nível, divergência e rotacional. Inclui fluxo de fluidos, oscilador harmônico, Lei de Coulomb, gravitação, superposição de cargas e campo magnético de fio.

Os scripts `docs/vetoriais/curvas.js` e `docs/vetoriais/campos.js` executam diretamente no navegador; essas duas páginas **não exigem reconstrução com Python**. Dependem da biblioteca Plotly carregada por CDN.

Os conteúdos principais seguem as seções 10.1, 12.1, 12.2 e 15.1 do livro de Anton fornecidas para a preparação didática. Curvatura, comprimento de arco e modelos físicos adicionais aprofundam as visualizações. O livro não é distribuído neste repositório.

### Convenções físicas e geométricas

- Nas figuras de curvas, os vetores derivados são exibidos com comprimento ajustável para visualização. Os valores numéricos não são alterados.
- Em campos de Coulomb e gravitação, as constantes são normalizadas para 1; as singularidades são excluídas da amostragem.
- Os modelos planares da lei do inverso do quadrado são **cortes de campos físicos em três dimensões**, e não soluções bidimensionais da lei de Gauss. A divergência dos cortes 2D não deve ser confundida com a divergência do campo original 3D.
- As linhas integrais de um campo de força não são necessariamente as trajetórias de uma partícula sob essa força.
