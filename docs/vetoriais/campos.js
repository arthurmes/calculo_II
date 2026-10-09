(function vectorFieldsApp(){
  "use strict";
  const $=id=>document.getElementById(id);
  const len=v=>Math.hypot(...v);
  const dist=v=>Math.hypot(...v);
  const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
  const inv=(x,y,z=0)=>{
    const r2=x*x+y*y+z*z;
    if(r2<.06)return null;
    return Math.pow(r2,-1.5);
  };
  const twoCharges=(x,y,z=0)=>{
    const aa=inv(x+1,y,z),bb=inv(x-1,y,z);
    if(aa===null||bb===null)return null;
    return [(x+1)*aa-(x-1)*bb,y*(aa-bb),z*(aa-bb)];
  };
  const F3=(x,y,z,sign=1)=>{
    const d=inv(x,y,z);return d===null?null:[sign*x*d,sign*y*d,sign*z*d];
  };
  const centralSeeds2=()=>Array.from({length:12},(_,i)=>{
    const a=2*Math.PI*i/12;return [.56*Math.cos(a),.56*Math.sin(a)];
  });
  const centralSeeds3=()=>[[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1],[.8,.8,.8],[-.8,.8,.8],[.8,-.8,.8],[-.8,-.8,.8]];
  const fields=[
    {id:"uniform2",dim:2,title:"Campo uniforme",formula:"F(x,y) = (1, 0)",domain:"Todo o plano",
      F:(x,y)=>[1,0],div:"0",curl:"0",type:"constante; conservativo",
      description:"Cada ponto recebe a mesma seta. É um modelo de velocidade uniforme em um escoamento horizontal.",
      question:"Como são as linhas integrais? Por que a divergência é zero?",potential:(x,y)=>x},
    {id:"gradLinear",dim:2,title:"Gradiente de um plano",formula:"φ(x,y)=x+y;  F=∇φ=(1,1)",domain:"Todo o plano",
      F:(x,y)=>[1,1],div:"0",curl:"0",type:"gradiente; conservativo",
      description:"Os vetores são perpendiculares às retas de nível x+y=c. Aumentam o potencial na direção mais rápida.",
      question:"Gire a atenção para as curvas de nível: qual é o ângulo entre elas e F?",potential:(x,y)=>x+y},
    {id:"radial2",dim:2,title:"Campo radial de expansão",formula:"F(x,y)=(x,y)",domain:"Todo o plano",
      F:(x,y)=>[x,y],div:"2",curl:"0",type:"fonte distribuída; conservativo",
      description:"O comprimento dos vetores aumenta linearmente com a distância à origem; a divergência é positiva em todo ponto.",
      question:"Compare o comprimento das setas com e sem normalização.",potential:(x,y)=>(x*x+y*y)/2,
      seeds:centralSeeds2()},
    {id:"sink2",dim:2,title:"Campo de contração",formula:"F(x,y)=(−x,−y)",domain:"Todo o plano",
      F:(x,y)=>[-x,-y],div:"−2",curl:"0",type:"sumidouro distribuído; conservativo",
      description:"Todas as trajetórias apontam para o equilíbrio (0,0). O sinal negativo da divergência indica contração local.",
      question:"Compare o sentido das linhas com o caso radial.",potential:(x,y)=>-(x*x+y*y)/2,
      seeds:centralSeeds2()},
    {id:"rotation2",dim:2,title:"Rotação rígida no plano",formula:"F(x,y)=(−y,x)",domain:"Todo o plano",
      F:(x,y)=>[-y,x],div:"0",curl:"2 (componente z)",type:"rotacional; não conservativo",
      description:"Velocidade de um corpo rígido em rotação uniforme. As linhas integrais são circunferências, e a rapidez cresce com o raio.",
      question:"Por que a divergência é nula apesar de o rotacional ser diferente de zero?",
      seeds:[[.6,0],[1.1,0],[1.6,0],[2.1,0]]},
    {id:"saddle2",dim:2,title:"Campo de sela",formula:"F(x,y)=(x,−y)=∇[(x²−y²)/2]",domain:"Todo o plano",
      F:(x,y)=>[x,-y],div:"0",curl:"0",type:"gradiente; ponto de sela",
      description:"Expansão ao longo de x e contração ao longo de y se compensam. É um campo gradiente com divergência zero.",
      question:"Quais eixos são trajetórias invariantes?",potential:(x,y)=>(x*x-y*y)/2},
    {id:"shear2",dim:2,title:"Escoamento por cisalhamento",formula:"F(x,y)=(y,0)",domain:"Todo o plano",
      F:(x,y)=>[y,0],div:"0",curl:"−1 (componente z)",type:"velocidade; cisalhamento",
      description:"As camadas acima e abaixo do eixo x escoam em sentidos opostos, com velocidades proporcionais a y.",
      question:"Identifique a camada de velocidade zero e discuta o sinal do rotacional."},
    {id:"poiseuille2",dim:2,title:"Escoamento laminar em canal",formula:"F(x,y)=(1−y²,0), para |y|≤1",domain:"Faixa −1≤y≤1 (fora da faixa não há fluido)",
      F:(x,y)=>Math.abs(y)>1?null:[1-y*y,0],range:[[-3,3],[-1.25,1.25]],div:"0",curl:"2y (componente z)",
      type:"velocidade; perfil parabólico",
      description:"Modelo adimensional de Poiseuille: velocidade máxima no centro do canal e condição de não deslizamento nas paredes y=±1.",
      question:"Por que o escoamento é incompressível mesmo tendo perfil não uniforme?",
      seeds:[[-2.3,-.85],[-2.3,-.55],[-2.3,-.25],[-2.3,0],[-2.3,.25],[-2.3,.55],[-2.3,.85]]},
    {id:"potential2",dim:2,title:"Gradiente de um potencial oscilatório",formula:"φ(x,y)=sen x cos y; F=(cos x cos y, −sen x sen y)",domain:"Todo o plano",
      F:(x,y)=>[Math.cos(x)*Math.cos(y),-Math.sin(x)*Math.sin(y)],
      div:"−2 sen x cos y",curl:"0",type:"gradiente; conservativo",
      description:"As linhas integrais cruzam ortogonalmente as curvas de nível. O campo varia tanto de direção quanto de módulo.",
      question:"Encontre pontos em que ∇φ=0 e compare com o mapa de curvas de nível.",
      potential:(x,y)=>Math.sin(x)*Math.cos(y)},
    {id:"vortex2",dim:2,title:"Vórtice potencial",formula:"F(x,y)=(−y,x)/(x²+y²)",domain:"ℝ² sem a origem",
      F:(x,y)=>{let d=x*x+y*y;return d<.06?null:[-y/d,x/d];},
      div:"0 fora da origem",curl:"0 fora da origem",type:"vórtice ideal; singular",
      description:"O movimento gira em torno da origem, mas seu rotacional é zero em todo ponto regular. O campo não é globalmente gradiente de um potencial escalar univalorado no plano perfurado.",
      question:"Compare com a rotação rígida: como a rapidez depende do raio?",
      sources:[{point:[0,0],charge:0}],seeds:[[.65,0],[1,0],[1.45,0],[1.9,0]]},
    {id:"oscillator",dim:2,title:"Oscilador harmônico no plano de fase",formula:"F(x,v)=(v,−x), com frequência ω=1",domain:"Plano de fase (x,v)",
      F:(x,v)=>[v,-x],div:"0",curl:"−2 no plano de fase (não é vorticidade física)",
      type:"sistema dinâmico; energia conservada",
      description:"As linhas integrais representam estados de um oscilador harmônico, não trajetórias no espaço físico. A energia H=(x²+v²)/2 é constante ao longo das soluções.",
      question:"Verifique que dH/dt=∇H·F=0. Qual é o sentido da rotação?",
      seeds:[[.6,0],[1.1,0],[1.6,0],[2.1,0]]},
    {id:"coulomb2",dim:2,title:"Lei de Coulomb: corte no plano",formula:"F(x,y)=k qQ (x,y)/(x²+y²)^(3/2), com k=1",domain:"Plano z=0 sem a carga fonte na origem",
      F:(x,y,z,sign)=>{let d=inv(x,y);return d===null?null:[sign*x*d,sign*y*d];},
      coulomb:true,div:"−qQ/r³ (divergência bidimensional, r≠0)",curl:"0 fora da origem",
      type:"força eletrostática; corte 2D de campo 3D",
      description:"Carga fonte fixa na origem. Escolha os sinais de Q e q para alternar entre força repulsiva e atrativa. A norma varia como 1/r², NÃO como 1/r³.",
      question:"Inverta apenas q. O que muda? Compare setas normalizadas com setas de comprimentos variáveis.",
      physics:"Este é o corte z=0 da força eletrostática tridimensional. No corte, a divergência 2D não coincide com a divergência 3D do campo original.",
      seeds:centralSeeds2(),sources:[{point:[0,0],charge:1}]},
    {id:"gravity2",dim:2,title:"Gravitação de Newton: corte no plano",formula:"F(x,y)=−GMm(x,y)/(x²+y²)^(3/2), com GMm=1",domain:"Plano z=0 sem a massa central",
      F:(x,y)=>{let d=inv(x,y);return d===null?null:[-x*d,-y*d];},
      div:"+1/r³ (divergência bidimensional, r≠0)",curl:"0 fora da origem",
      type:"força gravitacional atrativa; corte 2D",
      description:"A força é sempre atrativa, diferentemente da eletrostática, que depende dos sinais das cargas.",
      question:"Se duplicarmos a distância, como varia a norma da força?",
      physics:"Corte planar de uma força em ℝ³, com decaimento 1/r² e divergência 3D nula fora da massa.",
      sources:[{point:[0,0],charge:0}],seeds:centralSeeds2()},
    {id:"dipole2",dim:2,title:"Dipolo elétrico: superposição",formula:"E(r)=(r−r₊)/|r−r₊|³ − (r−r₋)/|r−r₋|³, r₊=(−1,0), r₋=(1,0)",domain:"Plano sem as cargas em (−1,0) e (1,0)",
      F:(x,y)=>{const a=twoCharges(x,y);return a?a.slice(0,2):null;},
      div:"−1/r₊³ + 1/r₋³ (no corte 2D)",curl:"0 fora das cargas",
      type:"campo elétrico; princípio da superposição",
      description:"Campo de duas cargas opostas. As linhas saem da carga positiva e terminam na negativa; a intensidade resulta da soma vetorial de cada contribuição.",
      question:"Examine o campo no eixo perpendicular ao segmento que une as cargas.",
      physics:"Representação no plano z=0 do campo eletrostático tridimensional. Constante de Coulomb normalizada.",
      sources:[{point:[-1,0],charge:1},{point:[1,0],charge:-1}],
      seeds:[[-1.55,0],[-1.35,.2],[-1.35,-.2],[-1,.42],[-1,-.42],[-1.1,.58],[-1.1,-.58],[-.6,.45],[-.6,-.45]]},
    {id:"wire2",dim:2,title:"Campo magnético de um fio retilíneo",formula:"B(x,y)=μ₀I/(2π) (−y,x)/(x²+y²), com μ₀I/(2π)=1",domain:"Seção transversal a um fio ao longo de z; fora da origem",
      F:(x,y)=>{let d=x*x+y*y;return d<.06?null:[-y/d,x/d];},
      div:"0 fora do fio",curl:"0 fora do fio (componente z)",
      type:"campo magnético; Lei de Ampère",
      description:"A orientação circular das linhas é dada pela regra da mão direita, para corrente ao longo de +z.",
      question:"Se invertêssemos a corrente, em que sentido girariam os vetores?",
      physics:"No fio ideal infinitamente longo, B tem norma proporcional a 1/r, não a 1/r².",
      sources:[{point:[0,0],charge:0}],seeds:[[.6,0],[1,0],[1.45,0],[1.9,0]]},
    {id:"uniform3",dim:3,title:"Campo uniforme tridimensional",formula:"F(x,y,z)=(1,0,0)",domain:"Todo ℝ³",
      F:(x,y,z)=>[1,0,0],div:"0",curl:"(0,0,0)",type:"uniforme; conservativo",
      description:"O mesmo vetor aponta na direção x em todos os pontos. Pode representar um campo de velocidade uniforme.",
      question:"O que acontece com uma linha integral se mudamos o ponto de partida?",
      seeds:[[0,-1,-1],[0,-1,1],[0,1,-1],[0,1,1],[0,0,0]]},
    {id:"rotation3",dim:3,title:"Rotação rígida em torno do eixo z",formula:"F(x,y,z)=(−y,x,0)",domain:"Todo ℝ³",
      F:(x,y,z)=>[-y,x,0],div:"0",curl:"(0,0,2)",type:"rotação; não conservativo",
      description:"Em cada plano horizontal, o escoamento gira em círculos concêntricos. A componente z é nula.",
      question:"Compare as linhas integrais nos planos z=−1 e z=1.",
      seeds:[[1,0,-1],[1.6,0,-1],[1,0,1],[1.6,0,1],[.7,0,0]]},
    {id:"helicoidal3",dim:3,title:"Escoamento helicoidal",formula:"F(x,y,z)=(−y,x,1)",domain:"Todo ℝ³",
      F:(x,y,z)=>[-y,x,1],div:"0",curl:"(0,0,2)",type:"fluxo helicoidal; não conservativo",
      description:"O giro em torno do eixo vertical é combinado com translação em z. As linhas integrais formam hélices.",
      question:"Compare com a hélice no laboratório de curvas: como se relacionam F e r′(t)?",
      seeds:[[.75,0,-1],[1.3,0,-1],[1.8,0,-1],[-.75,0,-1]]},
    {id:"grad3",dim:3,title:"Gradiente quadrático no espaço",formula:"φ=x²+y²+z²; F=∇φ=(2x,2y,2z)",domain:"Todo ℝ³",
      F:(x,y,z)=>[2*x,2*y,2*z],div:"6",curl:"(0,0,0)",type:"gradiente; conservativo",
      description:"O campo é normal às esferas de nível x²+y²+z²=c. Divergência constante e positiva.",
      question:"Como o comprimento cresce quando dobramos o raio?",
      seeds:centralSeeds3()},
    {id:"incompressible3",dim:3,title:"Deformação incompressível tridimensional",formula:"F(x,y,z)=(x,y,−2z)",domain:"Todo ℝ³",
      F:(x,y,z)=>[x,y,-2*z],div:"1+1−2=0",curl:"(0,0,0)",type:"linear; gradiente; incompressível",
      description:"Expansão horizontal e compressão vertical, com divergência zero. O volume local é preservado pelo fluxo.",
      question:"Por que a divergência pode ser zero mesmo que o campo varie no espaço?",
      seeds:[[.5,.5,.7],[-.5,.5,.7],[.5,-.5,.7],[-.5,-.5,.7],[.5,.5,-.7]]},
    {id:"coulomb3",dim:3,title:"Lei de Coulomb em ℝ³",formula:"F(r)=k qQ r/|r|³, com k=1",domain:"ℝ³ sem a origem",
      F:(x,y,z,sign)=>F3(x,y,z,sign),coulomb:true,div:"0 para r≠0 (em ℝ³)",curl:"(0,0,0) para r≠0",
      type:"força central; conservativo fora da carga",
      description:"A lei de Coulomb física é tridimensional: a direção é radial e a intensidade é proporcional a 1/r².",
      question:"Altere o sinal de uma carga e observe a inversão completa das setas.",
      physics:"O campo é singular na carga. A divergência é zero apenas nos pontos regulares, não no sentido distribucional global.",
      sources:[{point:[0,0,0],charge:1}],seeds:centralSeeds3()},
    {id:"gravity3",dim:3,title:"Gravitação newtoniana em ℝ³",formula:"F(r)=−GMm r/|r|³, com GMm=1",domain:"ℝ³ sem a massa central",
      F:(x,y,z)=>F3(x,y,z,-1),div:"0 para r≠0 (em ℝ³)",curl:"(0,0,0) para r≠0",
      type:"força central atrativa; conservativo",
      description:"Lei de Newton escrita como campo vetorial. A massa teste é sempre atraída pela origem.",
      question:"Que semelhanças e diferenças aparecem ao comparar este campo com Coulomb?",
      physics:"A equação tem a mesma dependência radial do campo de Coulomb, mas o sinal físico da gravitação é sempre atrativo.",
      sources:[{point:[0,0,0],charge:0}],seeds:centralSeeds3()},
    {id:"dipole3",dim:3,title:"Campo elétrico de duas cargas em ℝ³",formula:"E(r)=(r−r₊)/|r−r₊|³ − (r−r₋)/|r−r₋|³",domain:"ℝ³ sem as cargas r₊=(−1,0,0), r₋=(1,0,0)",
      F:(x,y,z)=>twoCharges(x,y,z),div:"0 fora das cargas (em ℝ³)",curl:"(0,0,0) fora das cargas",
      type:"campo eletrostático; superposição",
      description:"Observe como o campo do dipolo tridimensional perde a simetria esférica de uma única carga e adquire simetria axial.",
      question:"Gire a figura. Como o campo muda ao refletir z em −z?",
      physics:"Constantes normalizadas e cargas opostas de mesma magnitude.",
      sources:[{point:[-1,0,0],charge:1},{point:[1,0,0],charge:-1}],
      seeds:[[-1.4,.25,0],[-1.4,-.25,0],[-1.4,0,.25],[-1.4,0,-.25],[-1,.5,0],[-1,-.5,0],[-1,0,.5],[-1,0,-.5]]},
    {id:"wire3",dim:3,title:"Campo magnético em torno de um fio (3D)",formula:"B(x,y,z)=(−y,x,0)/(x²+y²)",domain:"ℝ³ sem o eixo z (fio ideal)",
      F:(x,y,z)=>{let rr=x*x+y*y;return rr<.06?null:[-y/rr,x/rr,0];},
      div:"0 fora do fio",curl:"(0,0,0) fora do fio",
      type:"campo magnético; simetria cilíndrica",
      description:"Linhas circulares em planos perpendiculares ao fio. O campo não depende da altura z.",
      question:"Compare as setas em dois pontos com o mesmo (x,y), mas z diferente.",
      physics:"Corrente orientada para +z e fator μ₀I/(2π) normalizado.",
      seeds:[[.75,0,-1.4],[1.4,0,-1.4],[.75,0,0],[1.4,0,0],[.75,0,1.4],[1.4,0,1.4]]}
  ];
  const select=$("example");
  for(const dim of [2,3]){
    const g=document.createElement("optgroup");g.label=dim===2?"Campos no plano (2D)":"Campos no espaço (3D)";
    fields.filter(e=>e.dim===dim).forEach(e=>{const o=document.createElement("option");o.value=e.id;o.textContent=e.title;g.appendChild(o);});
    select.appendChild(g);
  }
  let current=fields[0],camera=null,plotted=false,lastDim=null,previousId=null;
  const fmt=v=>Number.isFinite(v)?v.toLocaleString("pt-BR",{maximumFractionDigits:2}):"não definida";
  const chargeProduct=()=>Number($("sourceCharge").value)*Number($("probeCharge").value);
  const domainRanges=e=>e.range||(e.dim===2?[[-2.7,2.7],[-2.7,2.7]]:[[-2.4,2.4],[-2.4,2.4],[-2.4,2.4]]);
  function getF(e,p){
    const a=e.F(p[0],p[1],p[2]||0,e.coulomb?chargeProduct():1);
    return a&&a.length===e.dim&&a.every(Number.isFinite)?a:null;
  }
  function coords(x,lo,hi,n){return Array.from({length:n},(_,i)=>lo+(hi-lo)*i/(n-1));}
  function inDomain(e,p){
    const rg=domainRanges(e);
    return p.every((v,i)=>v>=rg[i][0]-.001&&v<=rg[i][1]+.001)&&getF(e,p)!==null;
  }
  function unitField(e,p,direction){
    const v=getF(e,p);if(!v)return null;
    const m=len(v);if(m<1e-9)return null;
    return v.map(x=>direction*x/m);
  }
  function traceDirection(e,origin,dir){
    let p=origin.slice(),pts=[p.slice()],range=domainRanges(e);
    const step=Math.min(...range.map(r=>r[1]-r[0]))/(e.dim===2?78:62);
    for(let i=0;i<320;i++){
      const k1=unitField(e,p,dir);if(!k1)break;
      const shift=(u,v,h)=>u.map((x,j)=>x+h*v[j]);
      const k2=unitField(e,shift(p,k1,step/2),dir);if(!k2)break;
      const k3=unitField(e,shift(p,k2,step/2),dir);if(!k3)break;
      const k4=unitField(e,shift(p,k3,step),dir);if(!k4)break;
      const next=p.map((x,j)=>x+step*(k1[j]+2*k2[j]+2*k3[j]+k4[j])/6);
      if(!inDomain(e,next))break;
      pts.push(next);p=next;
      if(i>35&&len(p.map((x,j)=>x-origin[j]))<step*.65)break;
    }
    return pts;
  }
  function seedPoints(e){
    if(e.seeds)return e.seeds;
    const rg=domainRanges(e);
    if(e.dim===2){
      const left=rg[0][0]+.35;
      return Array.from({length:9},(_,i)=>[left,rg[1][0]+.4+(rg[1][1]-rg[1][0]-.8)*i/8]);
    }
    const left=rg[0][0]+.4;
    return [[left,-1,-1],[left,-1,0],[left,-1,1],[left,0,-1],[left,0,0],[left,0,1],[left,1,-1],[left,1,0],[left,1,1]];
  }
  function lineTraces(e){
    const dim=e.dim,x=[],y=[],z=[];
    seedPoints(e).forEach(seed=>{
      if(!inDomain(e,seed))return;
      const neg=traceDirection(e,seed,-1).reverse();
      const pos=traceDirection(e,seed,1).slice(1);
      [...neg,...pos].forEach(p=>{x.push(p[0]);y.push(p[1]);if(dim===3)z.push(p[2]);});
      x.push(null);y.push(null);if(dim===3)z.push(null);
    });
    const data={type:dim===2?"scatter":"scatter3d",mode:"lines",x,y,
      line:{color:"#16a34a",width:dim===2?1.8:3},showlegend:false,hoverinfo:"skip"};
    if(dim===3)data.z=z;
    return data;
  }
  function plot(){
    const e=current,dim=e.dim,range=domainRanges(e);
    const n=Number($("density").value);
    $("densityValue").textContent=n;
    const scale=Number($("scale").value);$("scaleValue").textContent=fmt(scale);
    const nx=dim===2?n:Math.min(n,11);
    const axes=range.map(([a,b])=>coords(0,a,b,nx));
    const all=[],magnitudes=[];
    if(dim===2){for(const x of axes[0])for(const y of axes[1]){const p=[x,y],v=getF(e,p);if(v){all.push({p,v});magnitudes.push(len(v));}}}
    else for(const x of axes[0])for(const y of axes[1])for(const z of axes[2]){
      const p=[x,y,z],v=getF(e,p);if(v){all.push({p,v});magnitudes.push(len(v));}
    }
    const data=[];
    if(dim===2&&e.potential){
      const xs=coords(0,...range[0],58),ys=coords(0,...range[1],58);
      const zz=ys.map(y=>xs.map(x=>{const v=e.potential(x,y);return Number.isFinite(v)?v:null;}));
      data.push({type:"contour",x:xs,y:ys,z:zz,autocontour:true,ncontours:13,
        contours:{coloring:"none",showlabels:false},line:{color:"#cbd5e1",width:1},
        showscale:false,hoverinfo:"skip",showlegend:false});
    }
    if($("lines").checked)data.push(lineTraces(e));
    const x=[],y=[],z=[], hx=[],hy=[],hz=[],texts=[];
    const spacing=Math.min(...range.map(r=>(r[1]-r[0])/(nx-1)));
    for(const {p,v} of all){
      const m=len(v);if(m<1e-10)continue;
      const u=v.map(q=>q/m);
      const shrink=$("normalize").checked?1:clamp(.23+.68*Math.sqrt(m),.07,1.5);
      const l=spacing*.61*scale*shrink, tip=p.map((q,i)=>q+u[i]*l);
      let perp;
      if(dim===2)perp=[-u[1],u[0]];
      else{
        const axis=Math.abs(u[2])<.86?[0,0,1]:[0,1,0];
        perp=[u[1]*axis[2]-u[2]*axis[1],u[2]*axis[0]-u[0]*axis[2],u[0]*axis[1]-u[1]*axis[0]];
        const pl=len(perp);perp=perp.map(q=>q/pl);
      }
      const base=tip.map((q,i)=>q-.24*l*u[i]);
      const left=base.map((q,i)=>q+.12*l*perp[i]),right=base.map((q,i)=>q-.12*l*perp[i]);
      const series=[p,tip,null,left,tip,right,null];
      for(const q of series){x.push(q?q[0]:null);y.push(q?q[1]:null);if(dim===3)z.push(q?q[2]:null);}
      hx.push(p[0]);hy.push(p[1]);if(dim===3)hz.push(p[2]);
      texts.push("P = ("+p.map(fmt).join("; ")+")<br>F(P) = ("+v.map(fmt).join("; ")+")<br>‖F‖ = "+fmt(m));
    }
    const tr={x,y,type:dim===2?"scatter":"scatter3d",mode:"lines",line:{color:"#2563eb",width:dim===2?1.9:2.5},
      showlegend:false,hoverinfo:"skip"};
    if(dim===3)tr.z=z;data.push(tr);
    const hover={x:hx,y:hy,type:tr.type,mode:"markers",marker:{size:dim===2?5:3,color:"#2563eb",opacity:dim===2?.20:.35},
      hoverinfo:"text",text:texts,showlegend:false};
    if(dim===3)hover.z=hz;data.push(hover);
    if(e.sources){
      const sx=e.sources.map(v=>v.point[0]),sy=e.sources.map(v=>v.point[1]);
      const color=e.sources.map(v=>v.charge<0?"#2563eb":v.charge>0?"#dc2626":"#111827");
      const scatter={x:sx,y:sy,type:tr.type,mode:"markers+text",
        text:e.sources.map(v=>v.charge<0?"−":v.charge>0?"+":"●"),
        textposition:"top center",marker:{size:dim===2?13:8,color,line:{color:"#fff",width:1}},
        textfont:{color:"#111827",size:14},showlegend:false,hoverinfo:"skip"};
      if(dim===3)scatter.z=e.sources.map(v=>v.point[2]);
      data.push(scatter);
    }
    const layout={margin:{l:42,r:15,t:14,b:40},showlegend:false,hovermode:"closest",
      paper_bgcolor:"#fff",plot_bgcolor:"#fff",uirevision:e.id,
      font:{family:"system-ui,sans-serif",color:"#334155",size:12}};
    if(dim===2) {
      layout.xaxis={title:e.id==="oscillator"?"posição x":"x",range:range[0],gridcolor:"#e2e8f0",zeroline:true};
      layout.yaxis={title:e.id==="oscillator"?"velocidade v":"y",range:range[1],gridcolor:"#e2e8f0",scaleanchor:"x",scaleratio:1};
    } else {
      layout.margin={l:0,r:0,t:0,b:0};
      const plotEl=$("plot");
      if(plotted&&plotEl._fullLayout?.scene?.camera)camera=plotEl._fullLayout.scene.camera;
      layout.scene={uirevision:e.id,camera:camera||{eye:{x:1.6,y:1.5,z:1.2}},
        aspectmode:"cube",xaxis:{title:"x",range:range[0]},
        yaxis:{title:"y",range:range[1]},zaxis:{title:"z",range:range[2]}};
    }
    if(typeof Plotly==="undefined"){$("description").textContent="Não foi possível carregar a biblioteca de gráficos.";return;}
    const p=$("plot");
    if(lastDim!==null&&lastDim!==dim){Plotly.purge(p);plotted=false;}
    lastDim=dim;
    const draw=plotted?Plotly.react(p,data,layout,{responsive:true,displaylogo:false}):
      Plotly.newPlot(p,data,layout,{responsive:true,displaylogo:false});
    if(!plotted){plotted=true;p.on("plotly_relayout",ev=>{if(ev["scene.camera"])camera=ev["scene.camera"];});}
    if(draw?.catch)draw.catch(console.error);
  }
  function choose(){
    current=fields.find(f=>f.id===select.value)||fields[0];
    if(previousId!==current.id)camera=null;previousId=current.id;
    $("chargeControls").hidden=!current.coulomb;
    $("title").textContent=current.title;$("formula").textContent=current.formula;
    $("domain").textContent="Domínio: "+current.domain;
    $("divergence").textContent=current.div;$("curl").textContent=current.curl;$("type").textContent=current.type;
    $("description").textContent=current.description;$("question").textContent="Investigue: "+current.question;
    $("physics").textContent=current.physics||"Linhas integrais seguem a direção do campo. Em campos de força, não devem ser confundidas automaticamente com trajetórias dinâmicas de partículas.";
    if(current.coulomb){$("sourceCharge").value="1";$("probeCharge").value="1";}
    plot();
  }
  select.addEventListener("change",choose);
  ["sourceCharge","probeCharge","density","scale","normalize","lines"].forEach(id=>$(id).addEventListener("input",plot));
  $("resetView").addEventListener("click",()=>{camera=null;const plotEl=$("plot");if(plotEl?._fullLayout?.scene)Plotly.relayout(plotEl,{"scene.camera":{eye:{x:1.6,y:1.5,z:1.2}}});else plot();});
  choose();
})();
