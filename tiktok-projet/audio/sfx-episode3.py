import numpy as np, wave, json, sys
PT,END=json.load(open(sys.argv[1]))
SR=44100; buf=np.zeros(int(SR*(END+1))); rng=np.random.default_rng(11)
def add(t,sig,g=1.0):
    i=int(t*SR); n=min(len(sig),len(buf)-i)
    if n>0 and i>=0: buf[i:i+n]+=sig[:n]*g
def lp(x,a):
    k=int(4/a)+1; w=a*(1-a)**np.arange(k); return np.convolve(x,w)[:len(x)]
def pop(f0=700,f1=180,ms=90):
    n=int(SR*ms/1000); tt=np.arange(n)/SR; f=f1+(f0-f1)*np.exp(-tt*40)
    return np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*38)*(1-np.exp(-tt*2000))
def tick(f=2600):
    n=int(SR*.025); tt=np.arange(n)/SR; return np.sin(2*np.pi*f*tt)*np.exp(-tt*300)
def whoosh(sec):
    n=int(SR*sec); tt=np.linspace(0,1,n); x=rng.standard_normal(n); y=(lp(x,.03)*(1-tt)+lp(x,.2)*tt)*np.sin(np.pi*tt)**2; return y/np.max(np.abs(y))
def stamp():
    n=int(SR*.35); tt=np.arange(n)/SR; x=rng.standard_normal(n)
    thump=np.sin(2*np.pi*(70+60*np.exp(-tt*30))*tt)*np.exp(-tt*14); click=lp(x,.4)*np.exp(-tt*60)
    y=thump*1.0+click*.6; return y/np.max(np.abs(y))
def paper(sec=.45):
    n=int(SR*sec); tt=np.linspace(0,1,n); x=rng.standard_normal(n); y=lp(x-lp(x,.1),.6)*np.sin(np.pi*tt)**1.5; return y/np.max(np.abs(y))
def counter(a,b,step=.07,f=2400,g=.1):
    t=a
    while t<b: add(t,tick(f),g); t+=step
def boom2():
    n=int(SR*.45);tt=np.arange(n)/SR;return np.sin(2*np.pi*(48+60*np.exp(-tt*12))*tt)*np.exp(-tt*8)
P=PT;nx=lambda i:P[i+1] if i+1<len(P) else END;d=lambda i:nx(i)-P[i]
for b in (.58,2.45): add(b,pop(700,300,90),.3)
def coo():
    n=int(SR*.5);tt=np.arange(n)/SR;f=380+60*np.sin(2*np.pi*9*tt);return np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/.5)*.8
add(2.8,coo(),.5);add(3.1,coo(),.35)
add(3.1,whoosh(.6),.35)
for tn in (1.0,2.1,3.2,4.1,4.6,5.1): add(P[0]+tn,pop(1200,700,60),.35)
for i in range(1,9): add(P[i]-.3,whoosh(.7),.3)
counter(P[1]+.35*d(1),P[1]+.7*d(1),.06,2200,.08); add(P[1]+.83*d(1),pop(600,250,110),.4)
for a in (.05,.65,.78): add(P[2]+a*d(2),pop(400,120,150),.5)
add(P[3]+.35*d(3),pop(700,300,120),.4)
for j in range(12): add(P[3]+(.62+j*.015)*d(3),tick(2600),.12)
counter(P[4]+.62*d(4),P[4]+.82*d(4),.06,2000,.1)
add(P[5]+.45*d(5),stamp(),.4); add(P[5]+.5*d(5),pop(1300,700,120),.3)
add(P[6]+.7*d(6),pop(300,80,200),.5)
for j in range(20): add(P[7]+(.6+j*.012)*d(7),pop(1000+j*20,500,40),.06)
add(P[8]+.35*d(8),pop(500,900,150),.4)
BEATS=[[.14,.3,.46,.59,.66,.73],[.83],[.05,.65,.78],[.35,.62],[.3,.75],[.45],[.08,.72],[.3,.86],[.05,.35]]
for i,bs in enumerate(BEATS):
    pass
buf=buf/np.max(np.abs(buf))*.85
w=wave.open(sys.argv[2],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes());w.close();print('ok')
