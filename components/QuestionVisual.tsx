'use client';

import type { VisualSpec } from '@/src/types/question';

function Text({x,y,children,size=13}:{x:number;y:number;children:React.ReactNode;size?:number}) {
  return <text x={x} y={y} textAnchor="middle" fontSize={size} fill="currentColor">{children}</text>;
}

export function VisualSvg({ spec }: { spec: VisualSpec }) {
  const v = spec.values || [];
  const exp = spec.expression || '';
  const common = { width:'100%', height:'100%', viewBox:'0 0 520 280', role:'img', 'aria-label':spec.title } as const;


  if (spec.type === 'algebraTiles') {
    const coeff=Math.max(2,Math.min(8,Number(v[0]||4)));
    return <svg {...common}>
      <Text x={260} y={28} size={15}>{exp}</Text>
      {Array.from({length:coeff},(_,i)=><rect key={i} x={55+i*48} y="75" width="38" height="95" rx="5" fill="none" stroke="currentColor" strokeWidth="2"/>)}
      {Array.from({length:Math.max(1,Math.min(6,Number(v[1]||3)))},(_,i)=><rect key={`c${i}`} x={70+i*48} y="195" width="28" height="28" rx="4" fill="none" stroke="currentColor" strokeWidth="2"/>)}
      <Text x={260} y={188} size={12}>x-tiles and constant tiles</Text>
    </svg>;
  }
  if (spec.type === 'equationBalance') {
    return <svg {...common}>
      <Text x={260} y={30} size={15}>{exp}</Text>
      <line x1="85" y1="105" x2="435" y2="105" stroke="currentColor" strokeWidth="3"/>
      <line x1="85" y1="195" x2="435" y2="195" stroke="currentColor" strokeWidth="3"/>
      <circle cx="150" cy="105" r="30" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={150} y={110}>Eqn 1</Text>
      <circle cx="150" cy="195" r="30" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={150} y={200}>Eqn 2</Text>
      <path d="M250 105 C300 105 300 195 350 195" fill="none" stroke="currentColor" strokeDasharray="7 6" strokeWidth="2"/>
      <Text x={365} y={155} size={12}>eliminate / substitute</Text>
    </svg>;
  }
  if (spec.type === 'formulaMap') {
    return <svg {...common}>
      <Text x={260} y={28} size={16}>{exp}</Text>
      <rect x="60" y="95" width="125" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={122} y={130}>Original formula</Text>
      <path d="M190 125 L320 125" stroke="currentColor" strokeWidth="2" markerEnd="url(#arrow)"/>
      <defs><marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto"><path d="M0,0 L0,6 L9,3 z" fill="currentColor"/></marker></defs>
      <rect x="325" y="95" width="135" height="60" rx="12" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={392} y={120}>Inverse</Text><Text x={392} y={140}>operations</Text>
      <Text x={260} y={210} size={13}>isolate the required subject step by step</Text>
    </svg>;
  }
  if (spec.type === 'processFlow') {
    const labels=['Identify','Transform','Compute','Check'];
    return <svg {...common}>
      <Text x={260} y={28} size={15}>{exp}</Text>
      {labels.map((label,i)=><g key={label}><rect x={35+i*120} y="105" width="95" height="55" rx="12" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={82+i*120} y={138}>{label}</Text>{i<3&&<path d={`M${132+i*120} 132 L${150+i*120} 132`} stroke="currentColor" strokeWidth="2"/>}</g>)}
      <Text x={260} y={205} size={12}>structured reasoning path</Text>
    </svg>;
  }

  if (spec.type === 'triangle') {
    return <svg {...common}>
      <path d="M105 220 L105 55 L430 220 Z" fill="none" stroke="currentColor" strokeWidth="3"/>
      <path d="M105 198 L128 198 L128 220" fill="none" stroke="currentColor" strokeWidth="2"/>
      <Text x={72} y={140}>{v[0] ?? 'a'}</Text><Text x={268} y={245}>{v[1] ?? 'b'}</Text><Text x={302} y={128}>{v[2] ?? 'c'}</Text>
      <Text x={260} y={28} size={15}>{exp}</Text>
    </svg>;
  }
  if (spec.type === 'rectangle') {
    return <svg {...common}>
      <rect x="105" y="65" width="310" height="155" rx="7" fill="none" stroke="currentColor" strokeWidth="3"/>
      <Text x={260} y={248}>{v[0] ?? 'length'}</Text><Text x={72} y={145}>{v[1] ?? 'width'}</Text>
      <Text x={260} y={36} size={15}>{exp}</Text>
      {v[2] !== undefined && <Text x={260} y={150}>{`height/depth = ${v[2]}`}</Text>}
    </svg>;
  }
  if (spec.type === 'circle') {
    return <svg {...common}>
      <circle cx="260" cy="145" r="90" fill="none" stroke="currentColor" strokeWidth="3"/>
      <line x1="260" y1="145" x2="342" y2="108" stroke="currentColor" strokeWidth="2"/>
      <line x1="260" y1="145" x2="350" y2="145" stroke="currentColor" strokeWidth="2"/>
      <path d="M310 145 A50 50 0 0 0 306 124" fill="none" stroke="currentColor" strokeWidth="2"/>
      <Text x={303} y={131}>{v[1] !== undefined ? `${v[1]}°` : 'θ'}</Text><Text x={308} y={170}>{v[0] ?? 'r'}</Text>
      <Text x={260} y={28} size={15}>{exp}</Text>
    </svg>;
  }
  if (spec.type === 'trig') {
    const points = Array.from({length:73},(_,i)=>{
      const deg=i*5; const amp=Math.max(1,Number(v[0]||1));
      return `${35+(deg/360)*450},${140-Math.sin(deg*Math.PI/180)*amp*42}`;
    }).join(' ');
    return <svg {...common}>
      <line x1="35" y1="140" x2="490" y2="140" stroke="currentColor" opacity=".55"/>
      <line x1="35" y1="35" x2="35" y2="245" stroke="currentColor" opacity=".55"/>
      <polyline points={points} fill="none" stroke="currentColor" strokeWidth="3"/>
      {[0,90,180,270,360].map((d)=><g key={d}><line x1={35+(d/360)*450} y1="136" x2={35+(d/360)*450} y2="144" stroke="currentColor"/><Text x={35+(d/360)*450} y={163} size={11}>{d}°</Text></g>)}
      <Text x={260} y={25} size={15}>{exp}</Text>
    </svg>;
  }
  if (spec.type === 'numberline') {
    return <svg {...common}>
      <line x1="55" y1="145" x2="465" y2="145" stroke="currentColor" strokeWidth="3"/>
      {[0,90,180,270,360].map((d)=><g key={d}><line x1={55+(d/360)*410} y1="132" x2={55+(d/360)*410} y2="158" stroke="currentColor"/><Text x={55+(d/360)*410} y={182}>{d}°</Text></g>)}
      <Text x={260} y={65} size={18}>{exp}</Text><Text x={260} y={215}>0, π/2, π, 3π/2, 2π</Text>
    </svg>;
  }
  if (spec.type === 'argand') {
    const x=Number(v[0]||2), y=Number(v[1]||2), sx=260+x*28, sy=140-y*28;
    return <svg {...common}>
      <line x1="45" y1="140" x2="475" y2="140" stroke="currentColor" strokeWidth="2"/><line x1="260" y1="25" x2="260" y2="255" stroke="currentColor" strokeWidth="2"/>
      <Text x={468} y={130}>Re</Text><Text x={279} y={34}>Im</Text>
      <line x1="260" y1="140" x2={sx} y2={sy} stroke="currentColor" strokeDasharray="6 5"/>
      <circle cx={sx} cy={sy} r="7" fill="currentColor"/><Text x={sx+30} y={sy-10}>{`(${x}, ${y})`}</Text>
      <Text x={130} y={28} size={15}>{exp}</Text>
    </svg>;
  }
  if (spec.type === 'polar') {
    const angle=(Number(v[3]??v[1]??40))*Math.PI/180, radius=95, x=260+radius*Math.cos(angle), y=145-radius*Math.sin(angle);
    return <svg {...common}>
      <circle cx="260" cy="145" r="100" fill="none" stroke="currentColor" opacity=".35"/><line x1="65" y1="145" x2="455" y2="145" stroke="currentColor" opacity=".55"/><line x1="260" y1="30" x2="260" y2="255" stroke="currentColor" opacity=".55"/>
      <line x1="260" y1="145" x2={x} y2={y} stroke="currentColor" strokeWidth="3"/><circle cx={x} cy={y} r="6" fill="currentColor"/>
      <path d="M310 145 A50 50 0 0 0 298 112" fill="none" stroke="currentColor" strokeWidth="2"/><Text x={317} y={120}>θ</Text><Text x={302} y={154}>r</Text>
      <Text x={260} y={25} size={15}>{exp}</Text>
    </svg>;
  }
  return <svg {...common}>
    <rect x="45" y="55" width="430" height="170" rx="24" fill="none" stroke="currentColor" strokeWidth="2" opacity=".55"/>
    <circle cx="95" cy="140" r="22" fill="none" stroke="currentColor" strokeWidth="2"/><circle cx="425" cy="140" r="22" fill="none" stroke="currentColor" strokeWidth="2"/>
    <line x1="118" y1="140" x2="402" y2="140" stroke="currentColor" strokeWidth="2" strokeDasharray="8 7"/>
    <Text x={260} y={118} size={18}>{exp || spec.title}</Text>
    <Text x={260} y={170} size={12}>{spec.note || 'Structured mathematical representation'}</Text>
  </svg>;
}

export default function QuestionVisual({ spec }: { spec: VisualSpec }) {
  return <div className="visual-card">
    <div className="visual-card-head"><strong>{spec.title}</strong><span>{spec.type}</span></div>
    <div className="visual-svg-wrap"><VisualSvg spec={spec}/></div>
    {spec.note && <div className="visual-note">{spec.note}</div>}
  </div>;
}
