import { DUM10122_SUBTOPICS } from './syllabusSubtopics';
import { MISCONCEPTIONS } from './misconceptions';
import { TVET_FIELDS } from './tvetFields';
import { findActiveBlueprint } from './activeBlueprints';
import { getResearchEvidence } from './researchEvidence';
import type { BloomLevel, Difficulty, QuestionLanguage, SubjectiveQuestion, VisualSpec } from '../types/question';

export const QUESTIONS_PER_COMBINATION = 50;
export const ACTIVE_COMBINATIONS = DUM10122_SUBTOPICS.length * 4 * 3;
export const TOTAL_SUBJECTIVE_BANK_SIZE = ACTIVE_COMBINATIONS * QUESTIONS_PER_COMBINATION;

const BLOOM_ACTION: Record<BloomLevel, SubjectiveQuestion['bloom_action']> = {
  C1: 'Remember', C2: 'Understand', C3: 'Apply', C4: 'Analyze'
};
const TIME: Record<Difficulty, number> = { Easy: 2, Medium: 4, Hard: 7 };

const integer = (seed: number, min: number, span: number) => min + ((seed * 7 + 11) % span);
const fixed = (value: number, dp = 2) => Number(value.toFixed(dp));
const gcd = (a: number, b: number): number => (b ? gcd(b, a % b) : Math.abs(a));


function topicCue(code: string, index: number) {
  const a = 2 + (index % 11), b = 3 + ((index * 3) % 13), c = 2 + ((index * 5) % 9);
  if (code === '1.1') return `${a}x + ${b}y - ${c}`;
  if (code === '1.2a') return `${a}x + ${b} = ${a*c + b}`;
  if (code === '1.2b') return `(${a}x + ${b})(${c}x - ${1 + index % 5})`;
  if (code === '1.3') return `P = ${a}Q + ${b}`;
  if (code === '1.4') return `x + y = ${a+b}, 2x - y = ${2*a-b}`;
  if (code === '1.5') return `${a}x^3 + ${b}x^2 + ${c}x + ${1+index%7}`;
  if (code === '1.6') return `(${a}x + ${b})/[(x+${1+index%4})(x+${2+index%5})]`;
  if (code === '2.1') return `right triangle: legs ${a+2} cm and ${b+2} cm`;
  if (code === '2.2') return `rectangle: ${a+4} cm × ${b+3} cm`;
  if (code === '2.3') return `cuboid: ${a+4} cm × ${b+3} cm × ${c+2} cm`;
  if (code === '2.4') return `sector: r=${a+2} cm, θ=${15+index*3}°`;
  if (code === '3.1') return `${10+index*5}°`;
  if (code === '3.2') return `tan θ = ${a+1}/${b+2}`;
  if (code === '3.3') return `y = ${(1+index/10).toFixed(1)} sin θ`;
  if (code === '3.4') return `sin θ = sin(${8+index*3}°)`;
  if (code.startsWith('3.5')) return `triangle data set ${a+4}, ${b+5}, ${25+index%50}°`;
  if (code === '4.1') return `x^${2+index} × x^${1+index%7}`;
  if (code === '4.2') return `log(${a+2}) + log(${b+2})`;
  if (code === '4.3') return `${2+index%8}^${2+Math.floor((index-1)/8)}`;
  if (code === '4.4') return `${2+index%8}^x = ${(2+index%8) ** (2+Math.floor((index-1)/8))}`;
  if (code === '4.5') return `log_${2+index%8}(x) = ${2+Math.floor((index-1)/8)}`;
  if (code === '5.1') return `i^${4+index}`;
  if (code === '5.2') return `z=${a}+${b}i`;
  if (code === '5.3') return `z=${a}+${b}i`;
  if (code === '5.4') return `[${2+index%5} cis(${10+2*index}°)]^${2+index%3}`;
  return `variant ${index}`;
}

const TRADE_OBJECTS: Record<string, { en: string[]; bm: string[] }> = {
  'seni-rekabentuk': { en:['design panel','scaled pattern','material layout'], bm:['panel reka bentuk','corak berskala','susun atur bahan'] },
  automotif: { en:['service component','inspection panel','workshop measurement'], bm:['komponen servis','panel pemeriksaan','ukuran bengkel'] },
  bioperubatan: { en:['device calibration sheet','sensor housing','equipment measurement'], bm:['helaian penentukuran peranti','perumah sensor','ukuran peralatan'] },
  bioteknologi: { en:['laboratory batch','sample tray','processing measurement'], bm:['kelompok makmal','dulang sampel','ukuran pemprosesan'] },
  'alam-bina': { en:['building panel','floor-plan element','roof component'], bm:['panel bangunan','elemen pelan lantai','komponen bumbung'] },
  awam: { en:['site element','survey layout','concrete form'], bm:['elemen tapak','susun atur ukur','acuan konkrit'] },
  elektrik: { en:['control-panel layout','cable installation','circuit worksheet'], bm:['susun atur panel kawalan','pemasangan kabel','lembaran kerja litar'] },
  elektronik: { en:['circuit-board layout','sensor module','component worksheet'], bm:['susun atur papan litar','modul sensor','lembaran komponen'] },
  'pemprosesan-bahan': { en:['material batch','cutting layout','quality sample'], bm:['kelompok bahan','susun atur pemotongan','sampel kualiti'] },
  pembuatan: { en:['fabrication component','production jig','machine-part drawing'], bm:['komponen fabrikasi','jig pengeluaran','lukisan bahagian mesin'] },
  'mekanikal-servis': { en:['service component','maintenance layout','mechanical assembly'], bm:['komponen servis','susun atur penyelenggaraan','pemasangan mekanikal'] },
  'minyak-gas': { en:['pipeline inspection section','storage layout','measurement worksheet'], bm:['seksyen pemeriksaan saluran paip','susun atur simpanan','lembaran ukuran'] },
  ict: { en:['network configuration task','software testing log','device diagnostic worksheet'], bm:['tugasan konfigurasi rangkaian','log pengujian perisian','lembaran diagnostik peranti'] },
  'hospitaliti-kulinari': { en:['recipe scaling task','event-service layout','inventory planning sheet'], bm:['tugasan penskalaan resipi','susun atur perkhidmatan acara','helaian perancangan inventori'] }
};

function tradeLead(fieldId: string, index: number) {
  const pack = TRADE_OBJECTS[fieldId] || TRADE_OBJECTS.elektrik;
  return { en: pack.en[index % pack.en.length], bm: pack.bm[index % pack.bm.length] };
}

function bilingual(en: string, bm: string, language: QuestionLanguage) {
  if (language === 'English') return en;
  if (language === 'Bahasa Melayu') return bm;
  return `EN: ${en}\n\nBM: ${bm}`;
}

function visualFor(code: string, expression: string, values: number[], note = ''): VisualSpec {
  const text = `${expression} ${note}`.toLowerCase();
  const safeVals = values.length ? values : [0, 1, 2];

  if (/argand|real and imaginary|re\(z\)|im\(z\)|complex plane|z\s*=\s*.*i/i.test(text)) {
    return { type: 'argand', title: 'Argand diagram', expression, values: [safeVals[0] ?? 2, safeVals[1] ?? 3], note: 'The plotted point represents the complex number and its real/imaginary parts.' };
  }

  if (/polar|modulus|argument|cis|de moivre|complex form|complex.*form/i.test(text)) {
    return { type: 'polar', title: 'Polar-form visual', expression, values: [safeVals[0] ?? 2, safeVals[1] ?? 30, safeVals[2] ?? 45], note: 'The diagram shows the modulus and direction of the complex number.' };
  }

  if (/sin\s*θ|cos\s*θ|tan\s*θ|sine|cosine|tangent|trigonometric|radian|degree|θ/i.test(text)) {
    return { type: 'trig', title: 'Trigonometric visual', expression, values: safeVals, note: 'The graph/angle representation supports the trigonometric reasoning without revealing the full answer.' };
  }

  if (/triangle|hypotenuse|adjacent|opposite|sine rule|cosine rule|area of triangle|right-angled|right triangle/i.test(text)) {
    return { type: 'triangle', title: 'Triangle visual', expression, values: safeVals, note: 'The triangle diagram links the given measurements to the required geometric relationship.' };
  }

  if (/rectangle|cuboid|perimeter|area|surface area|length|width|height|depth|dimension/i.test(text)) {
    return { type: 'rectangle', title: 'Dimension visual', expression, values: safeVals, note: 'The rectangle/cuboid sketch matches the measured dimensions in the question.' };
  }

  if (/circle|sector|arc length|radius|central angle|circumference|angle.*circle/i.test(text)) {
    return { type: 'circle', title: 'Circular measure visual', expression, values: safeVals, note: 'The circular diagram matches the sector or radius information in the question.' };
  }

  if (/number line|radian|degree.*radian|convert.*degree|π|2π/i.test(text)) {
    return { type: 'numberline', title: 'Angle/radian visual', expression, values: safeVals, note: 'The number line shows the angle position or conversion relationship.' };
  }

  if (code === '1.1') return { type:'algebraTiles', title:'Algebra tiles / term grouping', expression, values:safeVals, note:'Groups visually separate coefficients, variables and constants for like-term reasoning.' };
  if (code === '1.3') return { type:'formulaMap', title:'Formula rearrangement map', expression, values:safeVals, note:'The map highlights the subject of the formula and inverse-operation pathway.' };
  if (code === '1.4') return { type:'equationBalance', title:'Simultaneous-equation balance', expression, values:safeVals, note:'Two equation rows support elimination/substitution reasoning.' };
  if (code === '1.2a') return { type:'equationBalance', title:'Equation balance visual', expression, values:safeVals, note:'The balance visual supports inverse operations and equality reasoning.' };
  if (code === '1.2b' || code === '1.5' || code === '1.6' || code.startsWith('4.')) return { type:'processFlow', title:'Procedure / structure visual', expression, values:safeVals, note:'The flow visual separates the mathematical structure into ordered reasoning stages.' };
  if (/logarithm|log_|log\(|partial fraction|quadratic|coefficient|like term|expand|simplify|factor|equation|solve .*x|x\^/i.test(text)) {
    return { type: 'algebra', title: 'Algebraic representation', expression, values: safeVals, note: 'The algebra panel displays the mathematical form directly tied to the equation or expression.' };
  }

  if (code === '2.1' || code.startsWith('3.2') || code.startsWith('3.5')) return { type: 'triangle', title: 'Triangle visual', expression, values, note };
  if (code === '2.2' || code === '2.3') return { type: 'rectangle', title: 'Dimension visual', expression, values, note };
  if (code === '2.4') return { type: 'circle', title: 'Circular measure visual', expression, values, note };
  if (code === '3.3' || code === '3.4') return { type: 'trig', title: 'Trigonometric visual', expression, values, note };
  if (code === '3.1') return { type: 'numberline', title: 'Degree–radian visual', expression, values, note };
  if (code === '5.2') return { type: 'argand', title: 'Argand diagram', expression, values, note };
  if (code === '5.3' || code === '5.4') return { type: 'polar', title: 'Polar-form visual', expression, values, note };
  if (code.startsWith('1.') || code.startsWith('4.') || code === '5.1') return { type: 'algebra', title: 'Mathematical representation', expression, values, note };
  return { type: 'concept', title: 'Concept visual', expression, values, note };
}

type Core = { en: string; bm: string; answerEn: string; answerBm: string; visual: VisualSpec };

function recallOrUnderstand(code: string, seed: number, bloom: BloomLevel, index: number): Core {
  const subtopic = DUM10122_SUBTOPICS.find((s) => s.code === code)!;
  const scopeA = subtopic.scope[seed % subtopic.scope.length];
  const scopeB = subtopic.scope[(seed + 1) % subtopic.scope.length];
  const cue = topicCue(code, index);
  if (bloom === 'C1') {
    return {
      en: `State the mathematical rule, definition, formula, or meaning associated with “${scopeA}” in ${subtopic.title}. Use the cue “${cue}” to identify the relevant symbols or quantities without carrying out a full solution.`,
      bm: `Nyatakan hukum, definisi, rumus atau maksud matematik yang berkaitan dengan “${scopeA}” dalam ${subtopic.title}. Gunakan petunjuk “${cue}” untuk mengenal pasti simbol atau kuantiti yang berkaitan tanpa menyelesaikan soalan sepenuhnya.`,
      answerEn: `A correct syllabus-aligned statement for ${scopeA}, using appropriate mathematical notation where relevant.`,
      answerBm: `Pernyataan yang betul dan selaras silibus bagi ${scopeA}, menggunakan notasi matematik yang sesuai jika berkaitan.`,
      visual: visualFor(code, cue, [index, seed], 'Recall cue only; the visual does not reveal the complete answer.')
    };
  }
  return {
    en: `Explain the relationship between “${scopeA}” and “${scopeB}” in your own words. Use “${cue}” as the required example or representation and explain what it shows.`,
    bm: `Terangkan hubungan antara “${scopeA}” dengan “${scopeB}” menggunakan ayat anda sendiri. Gunakan “${cue}” sebagai contoh atau representasi yang diwajibkan dan terangkan perkara yang ditunjukkan.`,
    answerEn: `The response should accurately connect or distinguish ${scopeA} and ${scopeB}, then provide a valid example consistent with the syllabus scope.`,
    answerBm: `Jawapan hendaklah menghubungkan atau membezakan ${scopeA} dan ${scopeB} dengan tepat, kemudian memberikan contoh yang sah dan selaras dengan skop silibus.`,
    visual: visualFor(code, cue, [index, seed], 'Use the representation to support explanation, not to replace reasoning.')
  };
}

function applied(code: string, seed: number, index: number, difficulty: Difficulty = 'Easy'): Core {
  const a = 2 + ((seed + index * 3) % 17);
  const b = 3 + ((seed * 2 + index * 5) % 19);
  const c = 2 + ((seed * 3 + index * 7) % 13);
  switch (code) {
    case '1.1': return { en: `Simplify ${a}x + ${b} + ${c}x − ${a}. Show your working.`, bm: `Ringkaskan ${a}x + ${b} + ${c}x − ${a}. Tunjukkan jalan kerja.`, answerEn: `${a + c}x + ${b - a}`, answerBm: `${a + c}x + ${b - a}`, visual: visualFor(code, `${a}x + ${b} + ${c}x − ${a}`, [a,b,c]) };
    case '1.2a': {
      if (difficulty === 'Easy') {
        return {
          en: `Solve the linear equation ${a}x + ${b} = ${a*c + b}. Show the inverse operation used.`,
          bm: `Selesaikan persamaan linear ${a}x + ${b} = ${a*c + b}. Tunjukkan operasi songsang yang digunakan.`,
          answerEn: `${a}x = ${a*c}; x = ${c}`,
          answerBm: `${a}x = ${a*c}; x = ${c}`,
          visual: visualFor(code, `${a}x + ${b} = ${a*c + b}`, [a,b,c], 'Linear equation solving with inverse operations.')
        };
      }
      if (difficulty === 'Medium') {
        const p = 1 + (index % 8);
        const q = 2 + ((index * 3) % 9);
        return {
          en: `Factorize x² + ${p + q}x + ${p*q}, then solve x² + ${p + q}x + ${p*q} = 0 using the zero-product property.`,
          bm: `Faktorkan x² + ${p + q}x + ${p*q}, kemudian selesaikan x² + ${p + q}x + ${p*q} = 0 menggunakan sifat hasil darab sifar.`,
          answerEn: `x² + ${p + q}x + ${p*q} = (x + ${p})(x + ${q}); x = -${p} or x = -${q}`,
          answerBm: `x² + ${p + q}x + ${p*q} = (x + ${p})(x + ${q}); x = -${p} atau x = -${q}`,
          visual: visualFor(code, `x² + ${p + q}x + ${p*q} = 0`, [p,q,p*q], 'Factorization connects directly to equation roots.')
        };
      }
      const p = 1 + (index % 6);
      const q = 2 + ((index * 5) % 7);
      const mid = p + q;
      const constant = p * q;
      return {
        en: `A quadratic equation is formed as x² - ${mid}x + ${constant} = 0. Solve it by factorization and verify both roots by substitution.`,
        bm: `Satu persamaan kuadratik dibentuk sebagai x² - ${mid}x + ${constant} = 0. Selesaikan melalui pemfaktoran dan sahkan kedua-dua punca melalui penggantian.`,
        answerEn: `x² - ${mid}x + ${constant} = (x - ${p})(x - ${q}); x = ${p} or x = ${q}. Substitution of each root gives 0.`,
        answerBm: `x² - ${mid}x + ${constant} = (x - ${p})(x - ${q}); x = ${p} atau x = ${q}. Penggantian setiap punca memberikan 0.`,
        visual: visualFor(code, `x² - ${mid}x + ${constant} = 0`, [p,q,constant], 'Hard item: solve and verify roots, not only factorize.')
      };
    }
    case '1.2b': {
      if (difficulty === 'Easy') {
        return {
          en: `Expand and simplify (${a}x + ${b})(${c}x + 2).`,
          bm: `Kembangkan dan ringkaskan (${a}x + ${b})(${c}x + 2).`,
          answerEn: `${a*c}x² + ${2*a+b*c}x + ${2*b}`,
          answerBm: `${a*c}x² + ${2*a+b*c}x + ${2*b}`,
          visual: visualFor(code, `(${a}x+${b})(${c}x+2)`, [a,b,c], 'Expansion item: distribute every term systematically.')
        };
      }
      if (difficulty === 'Medium') {
        const p = 1 + (index % 8);
        const q = 2 + ((index * 3) % 9);
        return {
          en: `Factorize x² + ${p + q}x + ${p*q}. State the two binomial factors and show how the middle coefficient is formed.`,
          bm: `Faktorkan x² + ${p + q}x + ${p*q}. Nyatakan dua faktor binomial dan tunjukkan bagaimana pekali tengah dibentuk.`,
          answerEn: `x² + ${p + q}x + ${p*q} = (x + ${p})(x + ${q}); ${p}+${q}=${p+q} and ${p}×${q}=${p*q}.`,
          answerBm: `x² + ${p + q}x + ${p*q} = (x + ${p})(x + ${q}); ${p}+${q}=${p+q} dan ${p}×${q}=${p*q}.`,
          visual: visualFor(code, `x² + ${p + q}x + ${p*q}`, [p,q,p*q], 'Factorization item: connect factor pairs to the quadratic structure.')
        };
      }
      const p = 1 + (index % 6);
      const q = 2 + ((index * 5) % 7);
      const mid = p + q;
      const constant = p * q;
      return {
        en: `Compare the expanded form of (x - ${p})(x - ${q}) with x² - ${mid}x + ${constant}. Explain why the signs and constant term are consistent.`,
        bm: `Bandingkan bentuk kembangan (x - ${p})(x - ${q}) dengan x² - ${mid}x + ${constant}. Terangkan mengapa tanda dan sebutan pemalar adalah konsisten.`,
        answerEn: `(x - ${p})(x - ${q}) = x² - ${p}x - ${q}x + ${constant} = x² - ${mid}x + ${constant}; both negative linear terms combine to -${mid}x and the product is positive.`,
        answerBm: `(x - ${p})(x - ${q}) = x² - ${p}x - ${q}x + ${constant} = x² - ${mid}x + ${constant}; kedua-dua sebutan linear negatif bergabung menjadi -${mid}x dan hasil darab ialah positif.`,
        visual: visualFor(code, `(x-${p})(x-${q})`, [p,q,constant], 'Hard item: analyze structure, signs and product terms.')
      };
    }
    case '1.3': return { en: `Given V = IR, make R the subject and calculate R when V = ${a*b} V and I = ${a} A.`, bm: `Diberi V = IR, jadikan R sebagai perkara rumus dan hitung R apabila V = ${a*b} V dan I = ${a} A.`, answerEn: `R = V/I = ${b} Ω`, answerBm: `R = V/I = ${b} Ω`, visual: visualFor(code, 'V = IR', [a*b,a]) };
    case '1.4': { const x=a, y=b; const s=x+y, d=2*x-y; return { en:`Solve simultaneously: x + y = ${s} and 2x − y = ${d}.`, bm:`Selesaikan serentak: x + y = ${s} dan 2x − y = ${d}.`, answerEn:`x = ${x}, y = ${y}`, answerBm:`x = ${x}, y = ${y}`, visual:visualFor(code,`x+y=${s}; 2x−y=${d}`,[s,d])}; }
    case '1.5': return { en:`Divide ${a}x² + ${a+b}x + ${b} by x + 1.`, bm:`Bahagikan ${a}x² + ${a+b}x + ${b} dengan x + 1.`, answerEn:`${a}x + ${b}`, answerBm:`${a}x + ${b}`, visual:visualFor(code,`(${a}x²+${a+b}x+${b}) ÷ (x+1)`,[a,b])};
    case '1.6': { const A=a, B=b; return { en:`Express [${A+B}x + ${2*A+B}] / [(x+1)(x+2)] as partial fractions.`, bm:`Ungkapkan [${A+B}x + ${2*A+B}] / [(x+1)(x+2)] sebagai pecahan separa.`, answerEn:`${A}/(x+1) + ${B}/(x+2)`, answerBm:`${A}/(x+1) + ${B}/(x+2)`, visual:visualFor(code,`[${A+B}x+${2*A+B}]/[(x+1)(x+2)]`,[A,B])}; }
    case '2.1': { const p=3+(index%13), q=4+((index*3)%17), h=fixed(Math.sqrt(p*p+q*q)); return { en:`A right-angled triangle has perpendicular sides ${p} cm and ${q} cm. Find the hypotenuse.`, bm:`Sebuah segi tiga bersudut tegak mempunyai sisi serenjang ${p} cm dan ${q} cm. Cari hipotenus.`, answerEn:`h = √(${p}² + ${q}²) ≈ ${h} cm`, answerBm:`h = √(${p}² + ${q}²) ≈ ${h} cm`, visual:visualFor(code,'right triangle',[p,q,h])}; }
    case '2.2': { const w=a+3, h=b+2; return { en:`A rectangular panel measures ${w} cm by ${h} cm. Calculate its perimeter and area.`, bm:`Sebuah panel segi empat tepat berukuran ${w} cm × ${h} cm. Hitung perimeter dan luasnya.`, answerEn:`Perimeter = ${2*(w+h)} cm; Area = ${w*h} cm²`, answerBm:`Perimeter = ${2*(w+h)} cm; Luas = ${w*h} cm²`, visual:visualFor(code,'rectangle',[w,h])}; }
    case '2.3': { const l=a+3,w=b+2,h=c+1; return { en:`A cuboid measures ${l} cm × ${w} cm × ${h} cm. Calculate its total surface area and volume.`, bm:`Sebuah kuboid berukuran ${l} cm × ${w} cm × ${h} cm. Hitung jumlah luas permukaan dan isipadu.`, answerEn:`TSA = ${2*(l*w+l*h+w*h)} cm²; Volume = ${l*w*h} cm³`, answerBm:`JLP = ${2*(l*w+l*h+w*h)} cm²; Isipadu = ${l*w*h} cm³`, visual:visualFor(code,'cuboid',[l,w,h])}; }
    case '2.4': { const r=3+(index%12), angle=15+index*3, arc=fixed(Math.PI*r*angle/180); return { en:`A sector has radius ${r} cm and central angle ${angle}°. Find the arc length.`, bm:`Sebuah sektor mempunyai jejari ${r} cm dan sudut pusat ${angle}°. Cari panjang lengkok.`, answerEn:`s = rθ = ${r}(${angle}π/180) ≈ ${arc} cm`, answerBm:`s = rθ = ${r}(${angle}π/180) ≈ ${arc} cm`, visual:visualFor(code,'sector',[r,angle])}; }
    case '3.1': { const angle=10+index*5; const g=gcd(angle,180); return { en:`Convert ${angle}° to radians in exact form.`, bm:`Tukarkan ${angle}° kepada radian dalam bentuk tepat.`, answerEn:`${angle/g}π/${180/g} rad`, answerBm:`${angle/g}π/${180/g} rad`, visual:visualFor(code,`${angle}° ↔ radians`,[angle])}; }
    case '3.2': { const opp=a+2, adj=b+3, theta=fixed(Math.atan(opp/adj)*180/Math.PI,1); return { en:`In a right triangle, the opposite side is ${opp} cm and the adjacent side is ${adj} cm. Find θ using tan θ.`, bm:`Dalam segi tiga bersudut tegak, sisi bertentangan ialah ${opp} cm dan sisi bersebelahan ialah ${adj} cm. Cari θ menggunakan tan θ.`, answerEn:`θ = tan⁻¹(${opp}/${adj}) ≈ ${theta}°`, answerBm:`θ = tan⁻¹(${opp}/${adj}) ≈ ${theta}°`, visual:visualFor(code,'tan θ = opposite/adjacent',[opp,adj,theta])}; }
    case '3.3': { const k=fixed(1+index/10,1); return { en:`For y = ${k} sin θ, 0° ≤ θ ≤ 360°, state the amplitude and sketch one cycle with key intercepts and maximum/minimum points.`, bm:`Bagi y = ${k} sin θ, 0° ≤ θ ≤ 360°, nyatakan amplitud dan lakarkan satu kitaran dengan pintasan serta titik maksimum/minimum utama.`, answerEn:`Amplitude = ${k}; key points: (0,0), (90,${k}), (180,0), (270,−${k}), (360,0).`, answerBm:`Amplitud = ${k}; titik utama: (0,0), (90,${k}), (180,0), (270,−${k}), (360,0).`, visual:visualFor(code,`y=${k}sinθ`,[k])}; }
    case '3.4': { const angle=5+index*3; const val=fixed(Math.sin(angle*Math.PI/180),3); return { en:`Solve sin θ = ${val} for 0° ≤ θ ≤ 360°. Give all solutions.`, bm:`Selesaikan sin θ = ${val} bagi 0° ≤ θ ≤ 360°. Berikan semua penyelesaian.`, answerEn:`Use the sine graph/unit-circle symmetry to obtain all angles in the interval; one reference solution is approximately ${angle}°.`, answerBm:`Gunakan simetri graf sinus/bulatan unit untuk mendapatkan semua sudut dalam julat; satu penyelesaian rujukan ialah kira-kira ${angle}°.`, visual:visualFor(code,`sinθ=${val}`,[val,angle])}; }
    case '3.5.1': { const A=25+(index%10)*3, B=45+Math.floor((index-1)/10)*5, side=6+index, result=fixed(side*Math.sin(B*Math.PI/180)/Math.sin(A*Math.PI/180)); return { en:`In triangle ABC, A=${A}°, B=${B}° and side a=${side} cm. Use the Sine Rule to find side b.`, bm:`Dalam segi tiga ABC, A=${A}°, B=${B}° dan sisi a=${side} cm. Gunakan Hukum Sinus untuk mencari sisi b.`, answerEn:`b = a sinB/sinA ≈ ${result} cm`, answerBm:`b = a sinB/sinA ≈ ${result} cm`, visual:visualFor(code,'Sine Rule',[A,B,side,result])}; }
    case '3.5.2': { const s1=6+index,s2=9+((index*2)%31),A=30+(index%12)*4, result=fixed(Math.sqrt(s1*s1+s2*s2-2*s1*s2*Math.cos(A*Math.PI/180))); return { en:`Two sides of a triangle are ${s1} cm and ${s2} cm with included angle ${A}°. Use the Cosine Rule to find the third side.`, bm:`Dua sisi segi tiga ialah ${s1} cm dan ${s2} cm dengan sudut terkepung ${A}°. Gunakan Hukum Kosinus untuk mencari sisi ketiga.`, answerEn:`c = √(${s1}²+${s2}²−2(${s1})(${s2})cos${A}°) ≈ ${result} cm`, answerBm:`c = √(${s1}²+${s2}²−2(${s1})(${s2})kos${A}°) ≈ ${result} cm`, visual:visualFor(code,'Cosine Rule',[s1,s2,A,result])}; }
    case '3.5.3': { const s1=7+index,s2=10+((index*3)%29),A=25+(index%14)*5, area=fixed(.5*s1*s2*Math.sin(A*Math.PI/180)); return { en:`Find the area of a triangle with sides ${s1} cm and ${s2} cm enclosing an angle of ${A}°.`, bm:`Cari luas segi tiga dengan sisi ${s1} cm dan ${s2} cm yang mengapit sudut ${A}°.`, answerEn:`Area = ½ab sinC ≈ ${area} cm²`, answerBm:`Luas = ½ab sinC ≈ ${area} cm²`, visual:visualFor(code,'triangle area',[s1,s2,A,area])}; }
    case '4.1': { const p=2+index, q=1+(index%9); return { en:`Simplify x^${p} × x^${q} ÷ x².`, bm:`Ringkaskan x^${p} × x^${q} ÷ x².`, answerEn:`x^${p+q-2}`, answerBm:`x^${p+q-2}`, visual:visualFor(code,`x^${p} × x^${q} ÷ x²`,[p,q])}; }
    case '4.2': { const x=a+2,y=b+2; return { en:`Use logarithm laws to simplify log(${x}) + log(${y}) − log(2).`, bm:`Gunakan hukum logaritma untuk meringkaskan log(${x}) + log(${y}) − log(2).`, answerEn:`log(${x*y/2})`, answerBm:`log(${x*y/2})`, visual:visualFor(code,`log${x}+log${y}−log2`,[x,y])}; }
    case '4.3': { const base=2+(index%8), power=2+Math.floor((index-1)/8), value=base**power; return { en:`Convert ${base}^${power} = ${value} to logarithmic form.`, bm:`Tukarkan ${base}^${power} = ${value} kepada bentuk logaritma.`, answerEn:`log_${base}(${value}) = ${power}`, answerBm:`log_${base}(${value}) = ${power}`, visual:visualFor(code,`${base}^${power}=${value}`,[base,power,value])}; }
    case '4.4': { const base=2+(index%8), power=2+Math.floor((index-1)/8), value=base**power; return { en:`Solve ${base}^x = ${value}.`, bm:`Selesaikan ${base}^x = ${value}.`, answerEn:`x = ${power}`, answerBm:`x = ${power}`, visual:visualFor(code,`${base}^x=${value}`,[base,value,power])}; }
    case '4.5': { const base=2+(index%8), power=2+Math.floor((index-1)/8), value=base**power; return { en:`Solve log_${base}(x) = ${power}.`, bm:`Selesaikan log_${base}(x) = ${power}.`, answerEn:`x = ${value}`, answerBm:`x = ${value}`, visual:visualFor(code,`log_${base}x=${power}`,[base,power,value])}; }
    case '5.1': { const exponent=4+index, rem=exponent%4, vals=['1','i','−1','−i']; return { en:`Simplify i^${exponent}. Show the exponent cycle used.`, bm:`Ringkaskan i^${exponent}. Tunjukkan kitaran eksponen yang digunakan.`, answerEn:`i^${exponent} = ${vals[rem]}`, answerBm:`i^${exponent} = ${vals[rem]}`, visual:visualFor(code,`i^${exponent}`,[exponent])}; }
    case '5.2': { const x=a,y=b; return { en:`For z = ${x} + ${y}i, plot z on an Argand diagram and state its real and imaginary parts.`, bm:`Bagi z = ${x} + ${y}i, plot z pada rajah Argand dan nyatakan bahagian nyata serta khayal.`, answerEn:`Point (${x},${y}); Re(z)=${x}, Im(z)=${y}.`, answerBm:`Titik (${x},${y}); Re(z)=${x}, Im(z)=${y}.`, visual:visualFor(code,`z=${x}+${y}i`,[x,y])}; }
    case '5.3': { const x=a,y=b, r=fixed(Math.sqrt(x*x+y*y)), theta=fixed(Math.atan2(y,x)*180/Math.PI,1); return { en:`Convert z = ${x} + ${y}i to polar form, giving modulus and argument.`, bm:`Tukarkan z = ${x} + ${y}i kepada bentuk kutub dengan menyatakan modulus dan hujah.`, answerEn:`r ≈ ${r}, θ ≈ ${theta}°; z ≈ ${r}(cos ${theta}° + i sin ${theta}°).`, answerBm:`r ≈ ${r}, θ ≈ ${theta}°; z ≈ ${r}(kos ${theta}° + i sin ${theta}°).`, visual:visualFor(code,`z=${x}+${y}i`,[x,y,r,theta])}; }
    case '5.4': { const r=2+(index%5), angle=10+index*2, power=2+(index%3); return { en:`Use De Moivre’s theorem to express [${r}(cos ${angle}° + i sin ${angle}°)]^${power} in trigonometric form.`, bm:`Gunakan Teorem De Moivre untuk mengungkapkan [${r}(kos ${angle}° + i sin ${angle}°)]^${power} dalam bentuk trigonometri.`, answerEn:`${r**power}(cos ${angle*power}° + i sin ${angle*power}°)`, answerBm:`${r**power}(kos ${angle*power}° + i sin ${angle*power}°)`, visual:visualFor(code,`[${r}cis${angle}°]^${power}`,[r,angle,power])}; }
    default: return recallOrUnderstand(code, seed, 'C2', index);
  }
}

function adaptDifficulty(core: Core, difficulty: Difficulty, fieldId: string, fieldContext: string, code: string, index: number): Core {
  if (difficulty === 'Easy') return core;
  const obj = tradeLead(fieldId, index);
  if (difficulty === 'Medium') return {
    ...core,
    en: `In a ${obj.en} task (${fieldContext}), ${core.en.charAt(0).toLowerCase()}${core.en.slice(1)} Interpret the final value in this vocational context and show the main rule/formula used.`,
    bm: `Dalam tugasan ${obj.bm} (${fieldContext}), ${core.bm.charAt(0).toLowerCase()}${core.bm.slice(1)} Tafsirkan nilai akhir dalam konteks vokasional ini dan tunjukkan hukum/rumus utama yang digunakan.`
  };
  return {
    ...core,
    en: `During a ${obj.en} inspection/planning task (${fieldContext}), ${core.en.charAt(0).toLowerCase()}${core.en.slice(1)} Present complete working, state any required condition or assumption, then verify whether the result is reasonable for the stated data.`,
    bm: `Semasa tugasan pemeriksaan/perancangan ${obj.bm} (${fieldContext}), ${core.bm.charAt(0).toLowerCase()}${core.bm.slice(1)} Tunjukkan jalan kerja lengkap, nyatakan syarat atau andaian yang perlu, kemudian sahkan sama ada keputusan munasabah untuk data yang diberi.`
  };
}

function analyze(code: string, seed: number, index: number, difficulty: Difficulty, fieldId: string, fieldContext: string): Core {
  const base = adaptDifficulty(applied(code, seed, index, difficulty), difficulty, fieldId, fieldContext, code, index);
  const errorTypes = [
    { en:'a sign or operation is changed incorrectly', bm:'tanda atau operasi ditukar dengan tidak betul' },
    { en:'a required term or factor is omitted', bm:'sebutan atau faktor yang diperlukan ditinggalkan' },
    { en:'the wrong formula or relationship is selected', bm:'rumus atau hubungan yang salah dipilih' },
    { en:'a substitution is made into the wrong position', bm:'penggantian dibuat pada kedudukan yang salah' },
    { en:'the final interpretation does not match the calculated quantity', bm:'tafsiran akhir tidak sepadan dengan kuantiti yang dikira' }
  ];
  const error = errorTypes[index % errorTypes.length];
  return {
    en: `A student attempted this task: “${base.en}” The working contains an error where ${error.en}. Analyze the solution by (i) identifying the first incorrect step, (ii) explaining the mathematical reason, (iii) correcting the working, and (iv) giving a justified conclusion for the vocational context.`,
    bm: `Seorang pelajar cuba menyelesaikan tugasan ini: “${base.bm}” Jalan kerja mengandungi ralat apabila ${error.bm}. Analisis penyelesaian dengan (i) mengenal pasti langkah salah pertama, (ii) menerangkan sebab matematik, (iii) membetulkan jalan kerja, dan (iv) memberikan kesimpulan yang berjustifikasi untuk konteks vokasional.`,
    answerEn: `The response must identify the stated error type, explain the relevant rule, correct the working, and obtain the corrected result: ${base.answerEn}`,
    answerBm: `Jawapan mesti mengenal pasti jenis ralat yang dinyatakan, menerangkan hukum berkaitan, membetulkan jalan kerja, dan memperoleh keputusan yang betul: ${base.answerBm}`,
    visual: { ...base.visual, note: 'Error-analysis visual: use the representation to check the corrected reasoning.' }
  };
}

function markingScheme(bloom: BloomLevel): SubjectiveQuestion['marking_scheme'] {
  if (bloom === 'C1') return { steps: ['State the required fact/rule/formula accurately.', 'Use correct mathematical notation or terminology.', 'Give a complete response within the syllabus scope.'], points_per_step: [4,3,3], total_points: 10 };
  if (bloom === 'C2') return { steps: ['Identify the relevant concepts/representations.', 'Explain the relationship or meaning accurately.', 'Support the explanation with a valid example/representation.'], points_per_step: [3,4,3], total_points: 10 };
  if (bloom === 'C3') return { steps: ['Select/write the correct method or formula.', 'Substitute/transform quantities correctly.', 'Carry out the procedure accurately.', 'State and check the final answer.'], points_per_step: [2,3,3,2], total_points: 10 };
  return { steps: ['Locate the first relevant error/relationship.', 'Explain the mathematical reason using the correct rule.', 'Correct or compare the working/representation.', 'State a justified final conclusion.'], points_per_step: [2,3,3,2], total_points: 10 };
}

export function buildBankQuestion(params: {
  subtopicCode: string;
  bloomLevel: BloomLevel;
  difficulty: Difficulty;
  language: QuestionLanguage;
  tvetFieldId: string;
  index: number;
}): SubjectiveQuestion {
  const index = Math.max(1, Math.min(QUESTIONS_PER_COMBINATION, params.index));
  const subtopic = DUM10122_SUBTOPICS.find((s) => s.code === params.subtopicCode);
  if (!subtopic) throw new Error('Unknown mathematics subtopic.');
  const blueprint = findActiveBlueprint(params.subtopicCode, params.bloomLevel, params.difficulty);
  if (!blueprint) throw new Error('No active C1–C4 blueprint for this combination.');
  const field = TVET_FIELDS.find((f) => f.id === params.tvetFieldId) || TVET_FIELDS[0];
  const fieldContext = field.safeContexts[index % field.safeContexts.length];
  const codeHash = Array.from(subtopic.code).reduce((sum, char, pos) => sum + char.charCodeAt(0) * (17 + pos * 13), 0);
  const bloomHash = ({C1:11,C2:23,C3:37,C4:53} as const)[params.bloomLevel];
  const diffHash = ({Easy:7,Medium:19,Hard:41} as const)[params.difficulty];
  const seed = index * 997 + codeHash * 53 + bloomHash * 17 + diffHash;
  let core = params.bloomLevel === 'C1' || params.bloomLevel === 'C2'
    ? recallOrUnderstand(params.subtopicCode, seed, params.bloomLevel, index)
    : params.bloomLevel === 'C3'
      ? adaptDifficulty(applied(params.subtopicCode, seed, index, params.difficulty), params.difficulty, field.id, fieldContext, params.subtopicCode, index)
      : analyze(params.subtopicCode, seed, index, params.difficulty, field.id, fieldContext);

  const misconceptionIds = [blueprint.primaryMisconceptionId, ...blueprint.secondaryMisconceptionIds].filter(Boolean).slice(0, 3);
  const misconceptionTargets = misconceptionIds.map((id) => {
    const item = (MISCONCEPTIONS as Record<string, any>)[id];
    return {
      misconception_id: id,
      name: item?.name || id,
      diagnostic_note: item?.example || 'Use this record to diagnose the student response.'
    };
  });
  const evidence = getResearchEvidence(blueprint.primaryMisconceptionId);

  return {
    id: `${params.subtopicCode}-${params.bloomLevel}-${params.difficulty}-${String(index).padStart(2,'0')}`,
    question_text: bilingual(core.en, core.bm, params.language),
    topic: `${subtopic.code} ${subtopic.title}`,
    subtopic_code: subtopic.code,
    bloom_level: params.bloomLevel,
    bloom_action: BLOOM_ACTION[params.bloomLevel],
    difficulty: params.difficulty,
    time_minutes: TIME[params.difficulty],
    language: params.language,
    tvet_field: `${field.nameBM} / ${field.nameEN}`,
    context_type: params.difficulty === 'Easy' ? 'Pure Math' : params.difficulty === 'Medium' ? 'Trade Scenario' : 'Multi-concept',
    expected_answer: bilingual(core.answerEn, core.answerBm, params.language),
    marking_scheme: markingScheme(params.bloomLevel),
    misconception_targets: misconceptionTargets,
    research_evidence: evidence,
    cva_present: { concrete: params.difficulty !== 'Easy', visual: true, abstract: true },
    visual_spec: core.visual,
    source: 'bank',
    bank_index: index
  };
}

export function getQuestionBank(params: Omit<Parameters<typeof buildBankQuestion>[0], 'index'> & { count?: number; start?: number }) {
  const count = Math.max(1, Math.min(QUESTIONS_PER_COMBINATION, params.count ?? QUESTIONS_PER_COMBINATION));
  const start = Math.max(1, Math.min(QUESTIONS_PER_COMBINATION, params.start ?? 1));
  return Array.from({ length: count }, (_, offset) => buildBankQuestion({
    ...params,
    index: ((start + offset - 1) % QUESTIONS_PER_COMBINATION) + 1
  }));
}

export function auditQuestionBank() {
  const blooms: BloomLevel[] = ['C1','C2','C3','C4'];
  const diffs: Difficulty[] = ['Easy','Medium','Hard'];
  let checked = 0, subjective = 0, visual = 0, tenMarks = 0;
  const uniquenessFailures: string[] = [];
  for (const subtopic of DUM10122_SUBTOPICS) {
    for (const bloom of blooms) for (const difficulty of diffs) {
      const texts = new Set<string>();
      for (let index=1; index<=QUESTIONS_PER_COMBINATION; index++) {
        const q = buildBankQuestion({ subtopicCode: subtopic.code, bloomLevel: bloom, difficulty, language: 'English', tvetFieldId: 'elektrik', index });
        checked += 1;
        texts.add(q.question_text);
        if (!('answer_options' in (q as any)) && !/multiple[- ]choice|choose one|A\)|B\)/i.test(q.question_text)) subjective += 1;
        if (q.visual_spec?.type) visual += 1;
        if (q.marking_scheme.total_points === 10 && q.marking_scheme.points_per_step.reduce((a,b)=>a+b,0) === 10) tenMarks += 1;
      }
      if (texts.size !== QUESTIONS_PER_COMBINATION) uniquenessFailures.push(`${subtopic.code}-${bloom}-${difficulty}:${texts.size}`);
    }
  }
  return { expected: TOTAL_SUBJECTIVE_BANK_SIZE, checked, subjective, visual, tenMarks, uniquenessFailures };
}
