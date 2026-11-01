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
P=PT;nx=lambda i:P[i+1] if i+1<len(P) else END
add(.3,pop(600,250,110),.3)
for i in (1,2,3,5,6,7,8): add(P[i]+.15,paper(),.35)
for t in (P[1]-1.2,P[4],P[6],P[9]): add(t,whoosh(1.1),.35)
add(P[1]+(nx(1)-P[1])*.84,stamp(),.9)
add(P[2]-.3,stamp(),.6)
counter(P[2]+3.2,P[2]+6.8)
for j in range(27): add(P[2]+8.6+j*.07,pop(1200 if j<26 else 400,500 if j<26 else 120,50 if j<26 else 140),.12 if j<26 else .5)
add(P[2]+10.6,stamp(),.9)
counter(P[3]+.6,P[3]+3.0,.06,1800)
for k,rt in enumerate([7.8,9.3,11.8,13.1,14.5]): add(P[3]+rt,pop(900 if k in (2,3) else 300,400 if k in (2,3) else 100,90),.4)
add(P[4]+1.5,pop(500,200,120),.35)
h=P[5]+(nx(5)-P[5])*.44
for j in range(40): add(P[5]+1+j*.04,tick(3000),.05)
counter(h,h+1.5,.06)
for j in range(5): add(P[6]+7.4+j*.15,paper(.18),.15)
add(P[6]+8.3,stamp(),.9)
add(P[7]+2.5,stamp(),.6); add(P[7]+2.6,stamp(),.9)
counter(P[8]+.8,P[8]+3.6,.05,2200)
add(P[8]+5.7,pop(300,80,200),.6)
add(P[9]+3.2,pop(600,250,110),.35)
buf=buf/np.max(np.abs(buf))*.85
w=wave.open(sys.argv[2],'wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes());w.close();print('ok')
