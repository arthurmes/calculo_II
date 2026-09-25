# Visualizações 3D para Cálculo II

Este repositório é um modelo mínimo para publicar superfícies 3D interativas usando:

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
