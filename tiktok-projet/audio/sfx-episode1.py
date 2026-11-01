import numpy as np, wave
SR=44100; DUR=84.6
T=dict(A=0,B=9.0,C=15.0,E=20.0,F=30.3,G=38.6,H=47.6,I=54.3,J=61.8,K=67.3,L=74.1,END=84.6)
buf=np.zeros(int(SR*DUR)); rng=np.random.default_rng(7)
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
def whoosh(sec,up=True):
    n=int(SR*sec); tt=np.linspace(0,1,n); x=rng.standard_normal(n)
    lo=lp(x,.03); hi=lp(x,.2); m=tt if up else 1-tt; y=(lo*(1-m)+hi*m)*np.sin(np.pi*tt)**2; return y/np.max(np.abs(y))
def boom():
    n=int(SR*.6); tt=np.arange(n)/SR; return np.sin(2*np.pi*(55+40*np.exp(-tt*8))*tt)*np.exp(-tt*6)
def rustle(sec=.6):
    n=int(SR*sec); tt=np.linspace(0,1,n); x=rng.standard_normal(n); y=lp(x-lp(x,.15),.5)*np.sin(np.pi*tt); return y/np.max(np.abs(y))
def hum(sec,a=.04,f=15):
    n=int(SR*sec); tt=np.arange(n)/SR; x=lp(rng.standard_normal(n),a); x/=np.max(np.abs(x))
    return x*(.8+.2*np.sin(2*np.pi*f*tt))*np.clip(tt/.4,0,1)*np.clip((sec-tt)/.4,0,1)
def crickets(t0,t1,g=.05):
    t=t0
    while t<t1:
        for k in range(3):
            m=int(SR*.045); tt=np.arange(m)/SR
            add(t+k*.07,np.sin(2*np.pi*4300*tt)*np.sin(np.pi*tt/.045)*(.6+.4*np.sin(2*np.pi*60*tt)),g)
        t+=.75+rng.random()*.3
def chirp():
    out=[]
    for k in range(rng.integers(2,5)):
        n=int(SR*.07); tt=np.arange(n)/SR; f=2600+1800*(tt/.07)+rng.random()*400
        out.append(np.sin(2*np.pi*np.cumsum(f)/SR)*np.sin(np.pi*tt/.07)); out.append(np.zeros(int(SR*.04)))
    return np.concatenate(out)
# --- B
add(T['B']-.3,whoosh(1.8,True),.25); add(T['B']+.6,pop(900,400,70),.25)
# --- C
t=T['C']+.4
while t<T['C']+4.6: add(t,tick(),.16); t+=.12
add(T['C']+3.0,pop(900,400,70),.22); add(T['E']-1.1,whoosh(1.1,True),.4)
crickets(T['C']+2.5,T['G'],.11)
# --- E/F
add(T['E'],hum(T['F']-T['E'],.04),.2)
add(T['E']+3.3,pop(500,150,140),.45)
for a in (6.0,7.0,8.0): add(T['E']+a,rustle(.6),.25)
add(T['E']+8.0,pop(900,400,70),.22)
add(T['F']+5.8,pop(700,250,110),.35)
# --- G..L transitions
for k in 'GHIJKL': add(T[k]-.3,whoosh(.8,True),.3)
add(T['G']+1.4,pop(800,300,80),.3);add(T['G']+2.0,pop(1000,400,80),.3);add(T['G']+2.9,boom(),.6)
add(T['H']+.3,pop(900,400,70),.3);add(T['H']+.7,pop(900,400,70),.2)
for i in range(14): add(T['H']+1+i*.45+rng.random()*.2,tick(3200+rng.random()*800),.12)
add(T['I']+.3,pop(700,300,80),.3);add(T['I']+.7,pop(900,400,70),.2);crickets(T['I'],T['J'],.11)
add(T['J']+.3,pop(700,300,80),.3);add(T['J']+.7,pop(900,400,70),.2);add(T['J']+1.8,hum(T['K']-T['J']-2.0,.08,30),.16)
add(T['K']+.3,pop(900,500,70),.3);add(T['K']+.7,pop(900,400,70),.2)
t=T['K']+.8
while t<T['L']-.5: add(t,chirp(),.15); t+=.9+rng.random()*1.2
crickets(T['L'],T['END'],.1);add(T['L']+.4,pop(900,400,70),.2);add(T['L']+4.8,pop(600,250,90),.3);add(T['L']+5.6,boom(),.6)
buf=buf/np.max(np.abs(buf))*.8
w=wave.open('/tmp/voice/sfx_v.wav','wb');w.setnchannels(1);w.setsampwidth(2);w.setframerate(SR);w.writeframes((buf*32767).astype(np.int16).tobytes());w.close();print('ok')
