(function vectorCurvesApp() {
  "use strict";
  const $=id=>document.getElementById(id);
  const pi=Math.PI, s=Math.sin, c=Math.cos;
  const T=2*pi;
  const knot=(t,order)=>{
    const R=2, a=0.62, p=2, q=3;
    const A=R+a*c(q*t), Ap=-a*q*s(q*t), App=-a*q*q*c(q*t);
    if(order===0)return [A*c(p*t),A*s(p*t),a*s(q*t)];
    if(order===1)return [Ap*c(p*t)-p*A*s(p*t),Ap*s(p*t)+p*A*c(p*t),a*q*c(q*t)];
    return [(App-p*p*A)*c(p*t)-2*p*Ap*s(p*t),(App-p*p*A)*s(p*t)+2*p*Ap*c(p*t),-a*q*q*s(q*t)];
  };
  const curves=[
    {id:"segment",dim:2,title:"Segmento de reta: interpolação linear",formula:"r(t) = (1−t)(−2, −1) + t(3, 2)",min:0,max:1,
     r:t=>[-2+5*t,-1+3*t],d:t=>[5,3],dd:t=>[0,0],
     description:"A derivada é constante. O vetor tangente aponta de P para Q e a trajetória é percorrida uma única vez.",
     question:"Compare t=0, 1/2 e 1. Qual é a posição do ponto médio?"},
    {id:"circle",dim:2,title:"Círculo orientado no sentido anti-horário",formula:"r(t) = (2 cos t, 2 sen t)",min:0,max:T,
     r:t=>[2*c(t),2*s(t)],d:t=>[-2*s(t),2*c(t)],dd:t=>[-2*c(t),-2*s(t)],
     description:"O vetor posição tem norma constante 2 e é ortogonal à derivada: r(t)·r′(t)=0. A aceleração aponta para o centro.",
     question:"Ative r, r′ e r″. Que ângulos esses vetores formam?"},
    {id:"clockwise",dim:2,title:"Mesmo círculo, orientação horária",formula:"r(t) = (2 cos t, −2 sen t)",min:0,max:T,
     r:t=>[2*c(t),-2*s(t)],d:t=>[-2*s(t),-2*c(t)],dd:t=>[-2*c(t),2*s(t)],
     description:"A curva geométrica não muda em relação ao exemplo anterior, mas o sentido de percurso e o vetor velocidade mudam.",
     question:"Compare r′(0) nas duas orientações."},
    {id:"ellipse",dim:2,title:"Elipse e tangentes",formula:"r(t) = (3 cos t, 1,5 sen t)",min:0,max:T,
     r:t=>[3*c(t),1.5*s(t)],d:t=>[-3*s(t),1.5*c(t)],dd:t=>[-3*c(t),-1.5*s(t)],
     description:"A rapidez não é constante. A derivada dá uma direção tangente mesmo nos pontos onde a tangente é vertical.",
     question:"Encontre os instantes em que a reta tangente é horizontal ou vertical."},
    {id:"parabola",dim:2,title:"Parábola parametrizada",formula:"r(t) = (t, t²)",min:-2,max:2,
     r:t=>[t,t*t],d:t=>[1,2*t],dd:t=>[0,2],
     description:"A inclinação é dy/dx=(dy/dt)/(dx/dt)=2t, porque dx/dt=1.",
     question:"Confira a direção da reta tangente no vértice e em t=1."},
    {id:"semicubic",dim:2,title:"Parábola semicúbica: ponto singular",formula:"r(t) = (t², t³), com y²=x³",min:-1.6,max:1.6,
     r:t=>[t*t,t*t*t],d:t=>[2*t,3*t*t],dd:t=>[2,6*t],
     description:"Em t=0, r′(0)=0; o vetor derivada não determina uma reta tangente regular. A cúspide exige análise separada. Para t≠0, dy/dx=3t/2.",
     question:"Faça t aproximar-se de zero por ambos os lados. O que ocorre com a rapidez e a orientação?"},
    {id:"cycloid",dim:2,title:"Cicloide: roda rolando sem escorregar",formula:"r(t) = (t−sen t, 1−cos t)",min:0,max:4*pi,
     r:t=>[t-s(t),1-c(t)],d:t=>[1-c(t),s(t)],dd:t=>[s(t),c(t)],
     description:"A trajetória de um ponto da borda de uma roda apresenta cúspides em t=2kπ. No instante da cúspide, a velocidade é zero.",
     question:"Procure um ponto de tangente horizontal entre cúspides consecutivas."},
    {id:"lissajous",dim:2,title:"Lissajous: oscilações perpendiculares",formula:"r(t) = (sen(3t), sen(4t))",min:0,max:T,
     r:t=>[s(3*t),s(4*t)],d:t=>[3*c(3*t),4*c(4*t)],dd:t=>[-9*s(3*t),-16*s(4*t)],
     description:"Composição de duas oscilações harmônicas em direções ortogonais. Autointersecções não significam, em geral, velocidades iguais.",
     question:"Observe uma autointersecção: a partícula passa por esse ponto com a mesma direção nos dois instantes?"},
    {id:"tricuspoid",dim:2,title:"Tricúspide (deltoide)",formula:"r(t) = (2 cos t + cos 2t, 2 sen t − sen 2t)",min:0,max:T,
     r:t=>[2*c(t)+c(2*t),2*s(t)-s(2*t)],d:t=>[-2*s(t)-2*s(2*t),2*c(t)-2*c(2*t)],dd:t=>[-2*c(t)-4*c(2*t),-2*s(t)+4*s(2*t)],
     description:"Três cúspides e pontos em que a parametrização deixa de ser regular. Mostra por que curvas precisam de amostragem densa.",
     question:"Determine os valores de t em que r′(t)=0."},
    {id:"spiral",dim:2,title:"Espiral de Arquimedes",formula:"r(t) = (0,18 t cos t, 0,18 t sen t)",min:0,max:6*pi,
     r:t=>[.18*t*c(t),.18*t*s(t)],d:t=>[.18*(c(t)-t*s(t)),.18*(s(t)+t*c(t))],
     dd:t=>[.18*(-2*s(t)-t*c(t)),.18*(2*c(t)-t*s(t))],
     description:"A distância à origem cresce linearmente com o parâmetro. A rapidez aumenta à medida que a espiral se desenrola.",
     question:"Compare o vetor posição e o tangente no início e no final."},
    {id:"involute",dim:2,title:"Involuta de um círculo",formula:"r(t) = (cos t+t sen t, sen t−t cos t)",min:0,max:2*pi,
     r:t=>[c(t)+t*s(t),s(t)-t*c(t)],d:t=>[t*c(t),t*s(t)],dd:t=>[c(t)-t*s(t),s(t)+t*c(t)],
     description:"Obtida desenrolando uma corda mantida tensa ao redor de um círculo. Em t=0 a derivada se anula.",
     question:"Como a direção da tangente se relaciona com o ângulo t?"},
    {id:"projectile",dim:2,title:"Física: lançamento oblíquo sem resistência",formula:"r(t) = (12 cos(50°) t, 12 sen(50°) t − 4,9 t²) (SI)",min:0,max:2*12*s(50*pi/180)/9.8,
     r:t=>[12*c(50*pi/180)*t,12*s(50*pi/180)*t-4.9*t*t],
     d:t=>[12*c(50*pi/180),12*s(50*pi/180)-9.8*t],dd:t=>[0,-9.8],
     description:"Aqui t é tempo (s), a derivada é velocidade (m/s) e a segunda derivada é aceleração constante g=(0,−9,8) m/s².",
     question:"Em que instante a velocidade vertical é nula? A velocidade total também se anula?"},
    {id:"line3",dim:3,title:"Reta no espaço",formula:"r(t) = (1−t, 3t, 2t)",min:-1,max:2,
     r:t=>[1-t,3*t,2*t],d:t=>[-1,3,2],dd:t=>[0,0,0],
     description:"A reta passa por (1,0,0) e tem vetor diretor (−1,3,2). A reta tangente coincide com a trajetória.",
     question:"Compare r(t) e r′(t) ao variar t."},
    {id:"horizontalCircle",dim:3,title:"Círculo em um plano horizontal",formula:"r(t) = (2 cos t, 2 sen t, 2)",min:0,max:T,
     r:t=>[2*c(t),2*s(t),2],d:t=>[-2*s(t),2*c(t),0],dd:t=>[-2*c(t),-2*s(t),0],
     description:"A curva está em z=2. O vetor posição em ℝ³ já não precisa ser perpendicular ao tangente apenas porque a curva é circular fora do plano z=0, embora r·r′=0 neste caso particular.",
     question:"Por que a derivada não tem componente z?"},
    {id:"helix",dim:3,title:"Hélice circular e sua reta tangente",formula:"r(t) = (2 cos t, 2 sen t, 0,45t)",min:0,max:4*pi,
     r:t=>[2*c(t),2*s(t),.45*t],d:t=>[-2*s(t),2*c(t),.45],dd:t=>[-2*c(t),-2*s(t),0],
     description:"Movimento circular combinado com avanço axial. A rapidez e a curvatura são constantes. A componente vertical da velocidade é 0,45.",
     question:"Observe o vetor tangente em t=π e descreva a reta tangente no ponto."},
    {id:"ellipticHelix",dim:3,title:"Hélice elíptica",formula:"r(t) = (3 cos t, sen t, 0,35t)",min:0,max:4*pi,
     r:t=>[3*c(t),s(t),.35*t],d:t=>[-3*s(t),c(t),.35],dd:t=>[-3*c(t),-s(t),0],
     description:"A projeção no plano xy é elíptica. Diferentemente da hélice circular, a rapidez e a curvatura variam.",
     question:"Compare os comprimentos dos vetores velocidade em t=0 e t=π/2."},
    {id:"twistedCubic",dim:3,title:"Cúbica torcida: interseção de superfícies",formula:"r(t) = (t, t², t³); y=x², z=x³",min:-1.6,max:1.6,
     r:t=>[t,t*t,t*t*t],d:t=>[1,2*t,3*t*t],dd:t=>[0,2,6*t],
     description:"A curva é a interseção das superfícies y=x² e z=x³. Suas coordenadas seguem a parametrização por x=t.",
     question:"Elimine o parâmetro e verifique as duas equações das superfícies."},
    {id:"intersection",dim:3,title:"Interseção: paraboloide com plano",formula:"r(t) = (t, t, 2t²); z=x²+y² e y=x",min:-1.6,max:1.6,
     r:t=>[t,t,2*t*t],d:t=>[1,1,4*t],dd:t=>[0,0,4],
     description:"A mesma curva pode ser obtida impondo o plano y=x sobre o paraboloide z=x²+y².",
     question:"Por que a reta tangente está contida no plano y=x?"},
    {id:"cone",dim:3,title:"Espiral sobre um cone",formula:"r(t) = (0,25t cos t, 0,25t sen t, 0,25t)",min:0,max:4*pi,
     r:t=>[.25*t*c(t),.25*t*s(t),.25*t],
     d:t=>[.25*(c(t)-t*s(t)),.25*(s(t)+t*c(t)),.25],
     dd:t=>[.25*(-2*s(t)-t*c(t)),.25*(2*c(t)-t*s(t)),0],
     description:"Toda a curva está no cone z²=x²+y², com z≥0. A projeção em xy é uma espiral.",
     question:"Substitua x(t), y(t), z(t) em z²=x²+y²."},
    {id:"torusKnot",dim:3,title:"Nó tórico: curva fechada no espaço",formula:"r(t) = ((2+0,62 cos 3t)cos 2t, (2+0,62 cos 3t)sen 2t, 0,62 sen 3t)",min:0,max:T,
     r:t=>knot(t,0),d:t=>knot(t,1),dd:t=>knot(t,2),
     description:"O nó tórico (2,3) tem várias sobreposições aparentes no gráfico. Girar a visão permite distinguir cruzamentos projetados de interseções reais.",
     question:"O ponto retorna à posição inicial após uma volta do parâmetro? Que curvas vê na projeção xy?"}
  ];
  const list=$("example");
  for (const dim of [2,3]) {
    const group=document.createElement("optgroup");
    group.label=dim===2?"Curvas no plano (2D)":"Curvas no espaço (3D)";
    curves.filter(e=>e.dim===dim).forEach(e=>{
      const o=document.createElement("option");o.value=e.id;o.textContent=e.title;group.appendChild(o);
    }); list.appendChild(group);
  }
  let current=curves[0], timer=null, currentCamera=null, plotReady=false;
  let bounds=null;
  const norm=v=>Math.hypot(...v);
  const dot=(a,b)=>a.reduce((u,x,i)=>u+x*b[i],0);
  const cross=(a,b)=>[a[1]*b[2]-a[2]*b[1],a[2]*b[0]-a[0]*b[2],a[0]*b[1]-a[1]*b[0]];
  const vecfmt=v=>"("+v.map(x=>Math.abs(x)<0.0005?"0":x.toLocaleString("pt-BR",{maximumFractionDigits:3})).join("; ")+")";
  const fmt=x=>Number.isFinite(x)?x.toLocaleString("pt-BR",{maximumFractionDigits:4}):"não definida";
  function arrow(start,end,color,name,dim) {
    let v=end.map((x,i)=>x-start[i]), m=norm(v);
    if(m<1e-8)return null;
    const u=v.map(x=>x/m), base=end.map((x,i)=>x-.16*m*u[i]);
    let p;
    if(dim===2)p=[-u[1],u[0]];
    else { p=cross(u,Math.abs(u[2])<.85?[0,0,1]:[0,1,0]); const pn=norm(p);p=p.map(x=>x/pn); }
    const left=base.map((x,i)=>x+.085*m*p[i]),right=base.map((x,i)=>x-.085*m*p[i]);
    const pts=[start,end,null,left,end,right];
    const traces={x:pts.map(p=>p?p[0]:null),y:pts.map(p=>p?p[1]:null),
      mode:"lines",line:{color,width:4},name,showlegend:false,hoverinfo:"skip"};
    if(dim===3){traces.type="scatter3d";traces.z=pts.map(p=>p?p[2]:null);traces.line.width=6;}
    else traces.type="scatter";
    return traces;
  }
  function extent(e) {
    const n=950, pts=[];
    for(let i=0;i<=n;i++)pts.push(e.r(e.min+(e.max-e.min)*i/n));
    const lo=[],hi=[];
    for(let j=0;j<e.dim;j++){
      let a=Math.min(...pts.map(p=>p[j])),b=Math.max(...pts.map(p=>p[j]));
      const pad=Math.max(.65,(b-a)*.14);lo.push(a-pad);hi.push(b+pad);
    }
    for(let j=0;j<e.dim;j++){lo[j]=Math.min(lo[j],-0.2);hi[j]=Math.max(hi[j],0.2);}
    const avgSpeed=pts.reduce((s,p,i)=>s+norm(e.d(e.min+(e.max-e.min)*i/n)),0)/pts.length;
    const avgAccel=pts.reduce((s,p,i)=>s+norm(e.dd(e.min+(e.max-e.min)*i/n)),0)/pts.length;
    return {pts,lo,hi,avgSpeed,avgAccel};
  }
  function stop(){if(timer!==null){clearInterval(timer);timer=null;} $("play").textContent="▶ Animar";}
  function choose(){
    stop();
    current=curves.find(c=>c.id===list.value)||curves[0];currentCamera=null;
    bounds=extent(current);
    $("surfaceControl").hidden=!["horizontalCircle","helix","ellipticHelix","twistedCubic","intersection","cone","torusKnot"].includes(current.id);
    $("time").min=current.min;$("time").max=current.max;$("time").step=(current.max-current.min)/2000;
    $("time").value=current.min+(current.max-current.min)*.22;
    $("title").textContent=current.title;$("formula").textContent=current.formula;
    $("domain").textContent="Intervalo representado: "+fmt(current.min)+" ≤ t ≤ "+fmt(current.max);
    $("description").textContent=current.description;$("question").textContent="Investigue: "+current.question;
    render();
  }
  function curvature(v,a) {
    const speed=norm(v);if(speed<1e-7)return NaN;
    if(v.length===2)return Math.abs(v[0]*a[1]-v[1]*a[0])/speed**3;
    return norm(cross(v,a))/speed**3;
  }
  function surfaceTraces(e){
  const mesh=(f,u0,u1,v0,v1,nu=40,nv=30,color="#94a3b8",alpha=.19)=>{
    const x=[],y=[],z=[];
    for(let j=0;j<nv;j++){
      const xr=[],yr=[],zr=[],v=v0+(v1-v0)*j/(nv-1);
      for(let i=0;i<nu;i++){
        const u=u0+(u1-u0)*i/(nu-1),p=f(u,v);
        xr.push(p[0]);yr.push(p[1]);zr.push(p[2]);
      }
      x.push(xr);y.push(yr);z.push(zr);
    }
    return {type:"surface",x,y,z,opacity:alpha,showscale:false,showlegend:false,
      colorscale:[[0,color],[1,color]],hoverinfo:"skip",name:"Superfície de referência"};
  };
  const full=2*Math.PI;
  switch(e.id){
    case "horizontalCircle":
      return [mesh((x,y)=>[x,y,2],-2.5,2.5,-2.5,2.5)];
    case "helix":
      return [mesh((u,z)=>[2*Math.cos(u),2*Math.sin(u),z],0,full,0,.45*4*Math.PI,55,20)];
    case "ellipticHelix":
      return [mesh((u,z)=>[3*Math.cos(u),Math.sin(u),z],0,full,0,.35*4*Math.PI,55,20)];
    case "twistedCubic":
      return [mesh((x,z)=>[x,x*x,z],-1.6,1.6,-4.2,4.2,32,32,"#94a3b8",.14),
              mesh((x,y)=>[x,y,x*x*x],-1.6,1.6,0,2.65,32,32,"#fca5a5",.14)];
    case "intersection":
      return [mesh((x,y)=>[x,y,x*x+y*y],-1.6,1.6,-1.6,1.6,34,34,"#94a3b8",.20),
              mesh((x,z)=>[x,x,z],-1.6,1.6,0,5.12,32,32,"#fca5a5",.19)];
    case "cone":
      return [mesh((u,h)=>[h*Math.cos(u),h*Math.sin(u),h],0,full,0,.25*4*Math.PI,52,30)];
    case "torusKnot":
      return [mesh((u,v)=>[(2+.62*Math.cos(v))*Math.cos(u),
        (2+.62*Math.cos(v))*Math.sin(u),.62*Math.sin(v)],0,full,0,full,55,33,"#cbd5e1",.14)];
    default:return [];
  }
}
  function lengthUntil(e,t){
    if(t<=e.min)return 0;
    const n=320,h=(t-e.min)/n;
    let total=norm(e.d(e.min))+norm(e.d(t));
    for(let i=1;i<n;i++)total+=(i%2?4:2)*norm(e.d(e.min+i*h));
    return total*h/3;
  }
  function render() {
    const t=Number($("time").value), e=current, dim=e.dim, p=e.r(t),v=e.d(t),a=e.dd(t);
    const speed=norm(v),sc=Number($("vectorScale").value);
    $("timeValue").textContent=fmt(t);$("scaleValue").textContent=fmt(sc);
    $("outPosition").textContent=vecfmt(p);$("outVelocity").textContent=vecfmt(v);
    $("outAcceleration").textContent=vecfmt(a);$("outSpeed").textContent=fmt(speed);
    $("outCurvature").textContent=fmt(curvature(v,a));
    $("outArc").textContent=fmt(lengthUntil(e,t));
    $("outDisplacement").textContent=fmt(norm(p.map((x,i)=>x-e.r(e.min)[i])));
    $("warning").textContent=speed<1e-7?"Ponto singular: r′(t)=0. A reta tangente não é determinada pelo vetor derivada neste instante.":"";
    const xs=bounds.pts.map(x=>x[0]),ys=bounds.pts.map(x=>x[1]),zs=dim===3?bounds.pts.map(x=>x[2]):null;
    const line={x:xs,y:ys,type:dim===3?"scatter3d":"scatter",mode:"lines",
      line:{color:"#2563eb",width:dim===3?7:3},name:"Trajetória",hoverinfo:"skip",showlegend:false};
    if(dim===3)line.z=zs;
    const tr=[line];
    if(dim===3 && $("surfaces").checked)tr.unshift(...surfaceTraces(e));
    const point={x:[p[0]],y:[p[1]],type:line.type,mode:"markers",
      marker:{color:"#111827",size:dim===3?6:11},name:"Ponto",showlegend:false,hoverinfo:"skip"};
    if(dim===3)point.z=[p[2]];
    tr.push(point);
    const span=Math.max(...bounds.hi.map((x,i)=>x-bounds.lo[i]));
    const rel=.17*span*sc*Math.min(2.6,Math.max(.08,speed/Math.max(1e-6,bounds.avgSpeed)));
    const relAcc=.17*span*sc*Math.min(2.6,Math.max(.08,norm(a)/Math.max(1e-6,bounds.avgAccel)));
    if($("orient").checked){
      for(let i=1;i<=5;i++){
        const u=e.min+(e.max-e.min)*i/7, pp=e.r(u),vv=e.d(u),length=norm(vv);
        if(length>1e-7){const finish=pp.map((x,j)=>x+vv[j]/length*span*.07);
          const ar=arrow(pp,finish,"#2563eb","Orientação",dim);if(ar)tr.push(ar);}
      }
    }
    if($("position").checked){
      const ar=arrow(Array(dim).fill(0),p,"#64748b","Posição",dim);if(ar)tr.push(ar);
    }
    if($("velocity").checked && speed>1e-7){
      const finish=p.map((x,i)=>x+v[i]/speed*rel);
      const ar=arrow(p,finish,"#e11d48","r′(t)",dim);if(ar)tr.push(ar);
    }
    if($("acceleration").checked && norm(a)>1e-7){
      const finish=p.map((x,i)=>x+a[i]/norm(a)*relAcc);
      const ar=arrow(p,finish,"#0891b2","r″(t)",dim);if(ar)tr.push(ar);
    }
    if($("tangent").checked && speed>1e-7){
      const ends=[-1,1].map(sign=>p.map((x,i)=>x+sign*v[i]/speed*span*.26));
      const trace={x:ends.map(x=>x[0]),y:ends.map(x=>x[1]),type:line.type,
        mode:"lines",line:{color:"#d97706",width:3,dash:"dash"},name:"Reta tangente",showlegend:false,hoverinfo:"skip"};
      if(dim===3)trace.z=ends.map(x=>x[2]);tr.push(trace);
    }
    const layout={
      margin:{l:38,r:18,t:15,b:45},showlegend:false,paper_bgcolor:"#fff",plot_bgcolor:"#fff",
      uirevision:"curve-"+e.id,hovermode:false,
      font:{family:"system-ui, sans-serif",color:"#334155",size:12}
    };
    if(dim===2){
      layout.xaxis={title:"x",range:[bounds.lo[0],bounds.hi[0]],zeroline:true,gridcolor:"#e2e8f0"};
      layout.yaxis={title:"y",range:[bounds.lo[1],bounds.hi[1]],scaleanchor:"x",scaleratio:1,gridcolor:"#e2e8f0"};
    }else{
      layout.margin={l:0,r:0,t:0,b:0};
      layout.scene={uirevision:"curve-"+e.id,camera:currentCamera||{eye:{x:1.5,y:1.55,z:1.12}},
        aspectmode:"data",xaxis:{title:"x",range:[bounds.lo[0],bounds.hi[0]]},
        yaxis:{title:"y",range:[bounds.lo[1],bounds.hi[1]]},
        zaxis:{title:"z",range:[bounds.lo[2],bounds.hi[2]]}};
    }
    if(typeof Plotly==="undefined"){$("warning").textContent="Biblioteca Plotly indisponível. Verifique a conexão.";return;}
    const plot=$("plot");
    if(plotReady && dim===3 && plot._fullLayout?.scene?.camera)
      currentCamera=plot._fullLayout.scene.camera;
    if(dim===3 && currentCamera)layout.scene.camera=currentCamera;
    const draw=plotReady?Plotly.react(plot,tr,layout,{responsive:true,displaylogo:false}):
      Plotly.newPlot(plot,tr,layout,{responsive:true,displaylogo:false});
    if(!plotReady){
      plotReady=true;
      plot.on("plotly_relayout",ev=>{if(ev["scene.camera"])currentCamera=ev["scene.camera"];});
    }
    if(draw?.catch)draw.catch(err=>{$("warning").textContent="Falha ao desenhar a curva: "+err.message;});
  }
  list.addEventListener("change",choose);
  $("time").addEventListener("input",render);
  ["position","velocity","acceleration","tangent","orient","surfaces","vectorScale"].forEach(id=>$(id).addEventListener("input",render));
  $("restart").addEventListener("click",()=>{$("time").value=current.min;render();});
  $("play").addEventListener("click",()=>{
    if(timer!==null){stop();return;}
    $("play").textContent="Ⅱ Pausar";
    const step=(current.max-current.min)/320;
    timer=setInterval(()=>{
      let next=Number($("time").value)+step;
      if(next>current.max)next=current.min;
      $("time").value=next;render();
    },70);
  });
  window.addEventListener("pagehide",stop);
  choose();
})();
