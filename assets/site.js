
const p = window.PROFILE;
const page = document.body.dataset.page;
const base = page === 'home' ? './' : '../';
const text = (selector, value) => document.querySelectorAll(selector).forEach(e => e.textContent = value);
text('[data-name]', p.name); text('[data-role]', p.role); text('[data-tagline]', p.tagline); text('[data-intro]', p.intro);
document.title = `${page === 'home' ? 'Home' : page === 'about' ? 'About me' : 'Publications'} | ${p.name}`;
document.querySelector('meta[name="description"]').content = `${p.name} — ${p.role}. Research, publications and biography.`;
const safeURL = value => { try {const u = new URL(value, location.href); return ['http:','https:'].includes(u.protocol) ? u.href : null;} catch {return null;} };
const decorateLink = (a, label) => {
 const emojis = {Paper:'📄', Code:'💻'};
 const services = {Email:'email', GitHub:'github', 'Google Scholar':'scholar', LinkedIn:'linkedin', ORCID:'orcid', ResearchGate:'researchgate'};
 if (!emojis[label] && !services[label]) return;
 const icon = document.createElement('span');
 icon.setAttribute('aria-hidden','true');
 if (emojis[label]) {icon.className='link-emoji';icon.textContent=emojis[label];}
 else {icon.className='service-icon icon-'+services[label];}
 a.prepend(icon);
};
const link = (label, href, parent) => { const url = safeURL(href); if (!url) return; const a = document.createElement('a'); a.textContent = label; a.href = url; decorateLink(a,label); parent.append(a); };
document.querySelectorAll('[data-interests]').forEach(el => {el.replaceChildren(); p.interests.forEach(v => {const li=document.createElement('li');li.textContent=v;el.append(li);});});
const bio = document.querySelector('[data-bio]'); if (bio) {bio.replaceChildren(); p.bio.forEach(v => {const para=document.createElement('p');para.textContent=v;bio.append(para);});}
const contacts = document.querySelector('[data-contacts]');
if (contacts) {contacts.replaceChildren();if (p.email && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) {const a=document.createElement('a');a.href='mailto:'+p.email;a.textContent='Email';decorateLink(a,'Email');contacts.append(a);} if(p.github)link('GitHub',p.github,contacts);if(p.scholar)link('Google Scholar',p.scholar,contacts);if(p.linkedin)link('LinkedIn',p.linkedin,contacts);if(p.orcid)link('ORCID',p.orcid,contacts);if(p.researchgate)link('ResearchGate',p.researchgate,contacts);if(p.cv)link('Curriculum vitae',base+p.cv,contacts);}
const papers = document.querySelector('[data-papers]');
if (papers && p.publications.length) {
 papers.replaceChildren();
 const sorted = [...p.publications].sort((a,b)=>b.year-a.year);
 (page==='home'?sorted.slice(0,3):sorted).forEach(pub=>{
  const article=document.createElement('article');article.className='publication';
  const add=(tag,cls,value)=>{const e=document.createElement(tag);e.className=cls;e.textContent=value;article.append(e);return e;};
  add('div','metadata',[pub.type,pub.venue,pub.year].filter(Boolean).join(' · '));
  add('h3','',pub.title);const authors=add('p','authors','');pub.authors.split(p.name).forEach((part,i)=>{if(i){const strong=document.createElement('strong');strong.textContent=p.name;authors.append(strong);}authors.append(document.createTextNode(part));});if(pub.abstract)add('p','abstract',pub.abstract);
  const links=add('div','pub-links','');if(pub.paper)link('Paper',pub.paper,links);if(pub.code)link('Code',pub.code,links); papers.append(article);
 });
}
const theme = document.querySelector('.theme');
let dark = matchMedia('(prefers-color-scheme: dark)').matches;
try {const saved=localStorage.getItem('personal-site-theme');if(saved)dark=saved==='dark';} catch {}
const apply=()=>{document.documentElement.classList.toggle('dark',dark);theme.textContent=dark?'☀':'☾';theme.setAttribute('aria-label',dark?'Switch to light theme':'Switch to dark theme');};apply();
theme.addEventListener('click',()=>{dark=!dark;apply();try{localStorage.setItem('personal-site-theme',dark?'dark':'light');}catch{}});
