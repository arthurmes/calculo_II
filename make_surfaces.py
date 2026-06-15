from pathlib import Path
import numpy as np
import plotly.graph_objects as go

OUTPUT = Path("docs/superficies")
OUTPUT.mkdir(parents=True, exist_ok=True)

PLOT_CONFIG = {
    "responsive": True,
    "displaylogo": False,
    "scrollZoom": True,
}

def write_page(fig, filename, title, description):
    """Exporta uma figura Plotly como página HTML simples e responsiva."""
    html = fig.to_html(
        full_html=False,
        include_plotlyjs="cdn",
        config=PLOT_CONFIG,
        default_width="100%",
        default_height="72vh",
    )

    page = f"""<!doctype html>
<html lang="pt-BR">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>{title}</title>
  <style>
    body {{
      margin: 0;
      font-family: system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      background: #f7f7f8;
      color: #1f2937;
    }}
    main {{
      max-width: 1100px;
      margin: 0 auto;
      padding: 18px 14px 32px;
    }}
    .top {{
      display: flex;
      gap: 12px;
      justify-content: space-between;
      align-items: baseline;
      flex-wrap: wrap;
      margin-bottom: 12px;
    }}
    h1 {{
      font-size: clamp(1.4rem, 3vw, 2.1rem);
      margin: 0;
    }}
    p {{
      color: #4b5563;
      margin: 8px 0 14px;
    }}
    a {{
      color: #111827;
      font-weight: 650;
    }}
    .figure {{
      background: white;
      border: 1px solid #e5e7eb;
      border-radius: 18px;
      padding: 8px;
      box-shadow: 0 10px 28px rgba(15, 23, 42, 0.06);
    }}
  </style>
</head>
<body>
  <main>
    <div class="top">
      <h1>{title}</h1>
      <a href="../index.html">Voltar</a>
    </div>
    <p>{description}</p>
    <div class="figure">
      {html}
    </div>
  </main>
</body>
</html>"""

    (OUTPUT / filename).write_text(page, encoding="utf-8")


def scene_layout(title):
    return dict(
        title=title,
        margin=dict(l=0, r=0, t=45, b=0),
        scene=dict(
            xaxis_title="x",
            yaxis_title="y",
            zaxis_title="z",
            aspectmode="cube",
            camera=dict(eye=dict(x=1.55, y=1.55, z=1.15)),
        ),
    )


def paraboloide():
    x = np.linspace(-2, 2, 70)
    y = np.linspace(-2, 2, 70)
    X, Y = np.meshgrid(x, y)
    Z = X**2 + Y**2

    fig = go.Figure(data=[
        go.Surface(x=X, y=Y, z=Z, showscale=False)
    ])
    fig.update_layout(**scene_layout("z = x² + y²"))

    write_page(
        fig,
        "paraboloide.html",
        "Paraboloide elíptico",
        "Arraste a figura para observar a simetria radial e o mínimo em (0,0)."
    )


def sela():
    x = np.linspace(-2, 2, 70)
    y = np.linspace(-2, 2, 70)
    X, Y = np.meshgrid(x, y)
    Z = X**2 - Y**2

    fig = go.Figure(data=[
        go.Surface(x=X, y=Y, z=Z, showscale=False)
    ])
    fig.update_layout(**scene_layout("z = x² - y²"))

    write_page(
        fig,
        "sela.html",
        "Superfície de sela",
        "Um exemplo visualmente forte de ponto crítico que não é máximo nem mínimo."
    )


def plano_tangente():
    x = np.linspace(-2, 2, 70)
    y = np.linspace(-2, 2, 70)
    X, Y = np.meshgrid(x, y)
    Z = X**2 + Y**2

    # Ponto de tangência: (x0, y0)
    x0, y0 = 1.0, 0.5
    z0 = x0**2 + y0**2

    # f_x = 2x, f_y = 2y
    T = z0 + 2*x0*(X - x0) + 2*y0*(Y - y0)

    fig = go.Figure(data=[
        go.Surface(x=X, y=Y, z=Z, opacity=0.72, showscale=False, name="Superfície"),
        go.Surface(x=X, y=Y, z=T, opacity=0.48, showscale=False, name="Plano tangente"),
        go.Scatter3d(
            x=[x0], y=[y0], z=[z0],
            mode="markers+text",
            text=["ponto de tangência"],
            textposition="top center",
            marker=dict(size=5),
            name="Ponto"
        )
    ])
    fig.update_layout(**scene_layout("Plano tangente a z = x² + y²"))

    write_page(
        fig,
        "plano_tangente.html",
        "Plano tangente",
        "Paraboloide e plano tangente no ponto (1, 0.5). Bom para discutir linearização."
    )


def solido_paraboloide():
    r = np.linspace(0, 2, 60)
    theta = np.linspace(0, 2*np.pi, 90)
    R, TH = np.meshgrid(r, theta)

    X = R * np.cos(TH)
    Y = R * np.sin(TH)
    Z = 4 - X**2 - Y**2

    # Base z = 0
    Z0 = np.zeros_like(Z)

    fig = go.Figure(data=[
        go.Surface(x=X, y=Y, z=Z, opacity=0.82, showscale=False, name="z = 4 - x² - y²"),
        go.Surface(x=X, y=Y, z=Z0, opacity=0.28, showscale=False, name="base"),
    ])

    fig.update_layout(**scene_layout("Sólido sob z = 4 - x² - y²"))

    write_page(
        fig,
        "solido_paraboloide.html",
        "Sólido sob uma superfície",
        "Volume sob z = 4 - x² - y² sobre o disco x² + y² ≤ 4."
    )

def campo_vetorial(nome_arquivo, titulo, descricao, field_func, lim=2, n=5):
    x = np.linspace(-lim, lim, n)
    y = np.linspace(-lim, lim, n)
    z = np.linspace(-lim, lim, n)
    X, Y, Z = np.meshgrid(x, y, z)

    U, V, W = field_func(X, Y, Z)

    # Normaliza para as setas não ficarem gigantes
    N = np.sqrt(U**2 + V**2 + W**2)
    N[N == 0] = 1
    U, V, W = U / N, V / N, W / N

    fig = go.Figure(data=[
        go.Cone(
            x=X.flatten(), y=Y.flatten(), z=Z.flatten(),
            u=U.flatten(), v=V.flatten(), w=W.flatten(),
            sizemode="absolute",
            sizeref=0.35,
            showscale=False,
            anchor="tail"
        )
    ])

    fig.update_layout(**scene_layout(titulo))

    write_page(fig, nome_arquivo, titulo, descricao)

def campo_radial():
    campo_vetorial(
        "campo_radial.html",
        "Campo radial",
        "Campo F(x,y,z) = (x,y,z). As setas apontam para fora da origem.",
        lambda X, Y, Z: (X, Y, Z)
    )


def campo_rotacional_z():
    campo_vetorial(
        "campo_rotacional_z.html",
        "Campo rotacional em torno do eixo z",
        "Campo F(x,y,z) = (-y,x,0). Bom para visualizar rotação e discutir rotacional.",
        lambda X, Y, Z: (-Y, X, 0*Z)
    )


def campo_helicoidal():
    campo_vetorial(
        "campo_helicoidal.html",
        "Campo helicoidal",
        "Campo F(x,y,z) = (-y,x,1). As setas giram em torno do eixo z enquanto sobem.",
        lambda X, Y, Z: (-Y, X, 1 + 0*Z)
    )


def campo_sela():
    campo_vetorial(
        "campo_sela_3d.html",
        "Campo tipo sela",
        "Campo F(x,y,z) = (x,-y,0). Expande em uma direção e contrai em outra.",
        lambda X, Y, Z: (X, -Y, 0*Z)
    )


def campo_constante():
    campo_vetorial(
        "campo_constante.html",
        "Campo constante",
        "Campo F(x,y,z) = (1,1,1). Todas as setas têm a mesma direção.",
        lambda X, Y, Z: (1 + 0*X, 1 + 0*Y, 1 + 0*Z)
    )


def campo_gradiente_quadratico():
    campo_vetorial(
        "campo_gradiente_quadratico.html",
        "Campo gradiente quadrático",
        "Campo F = grad(x² + y² + z²) = (2x,2y,2z). Exemplo conservativo.",
        lambda X, Y, Z: (2*X, 2*Y, 2*Z)
    )


if __name__ == "__main__":
    paraboloide()
    sela()
    plano_tangente()
    solido_paraboloide()
    campo_radial()
    campo_rotacional_z()
    campo_helicoidal()
    campo_sela()
    campo_constante()
    campo_gradiente_quadratico()
    print("Arquivos gerados em docs/superficies/")