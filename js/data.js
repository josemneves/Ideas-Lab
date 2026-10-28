/* =============================================================
   O ÚNICO FICHEIRO QUE PRECISAS DE EDITAR PARA ADICIONAR SITES.
   -------------------------------------------------------------
   Para adicionar um projeto: copia um objeto de PROJECTS e cola-o
   no FIM da lista. A numeração (01, 02...) segue esta ordem.
   O último projeto da lista aparece em destaque no topo da página
   (ou escolhe outro em SITE.featured).

   - handle:  nome curto para o URL (#/projects/<handle>), só letras, números e "-"
   - status:  "live" | "building" | "prototype" | "paused"
   - live:    URL público do site (deixa "" se ainda não estiver online)
   - repo:    URL do código (deixa "" se for privado)
   - image:   screenshots em images/ (16:10 fica melhor, ex. 1440×900)
              { light: '...', dark: '...' }  muda com o modo claro/escuro do visitante
              { dark: '...' }                se o projeto só tem um modo

   Os espaços vazios da grelha são preenchidos com "CLASSIFIED"
   até completar a linha, por isso não precisas de mais nada.
   ============================================================= */
window.SITE = {
  name: 'José Maria',
  tagline: 'Index of shipped ideas',
  intro:
    'I build small tools around problems I run into, put them online, ' +
    'and write down what I learn. This is the index of everything I have shipped so far.',
  featured: '', // handle do projeto em destaque; vazio = o último da lista
  principles: [
    ['Start from a real problem', 'Every project begins with something I ran into myself, not with a technology I wanted to try.'],
    ['Private by default', 'No accounts and no tracking. Where possible, your data never leaves your device.'],
    ['Show the sources', 'Claims are tied to the evidence behind them, and I write down what I learn along the way.']
  ],
  links: {
    x: 'https://x.com/josemneves_',
    github: 'https://github.com/josemneves',
    linkedin: '', // ex. "https://linkedin.com/in/oteuhandle"
    email: ''     // ex. "mailto:tu@dominio.com"
  }
};

window.PROJECTS = [
  {
    handle: 'recovery-lens',
    name: 'Recovery Lens',
    pitch: 'Turns a WHOOP data export into a clear dashboard, without the data leaving your browser.',
    problem:
      'WHOOP lets you export all your data, but it arrives as raw CSV files that are hard to read. ' +
      'Recovery Lens turns them into a daily dashboard with recovery, vitals, trends and plain-language insights, ' +
      'including which habits change your next-day recovery. There is no account and no upload; everything runs on your device.',
    learnt: '',
    status: 'live',
    date: '2026-10-11',
    live: 'https://recoverylens.vercel.app',
    repo: '',
    image: { light: 'images/recovery-lens-light.jpg', dark: 'images/recovery-lens-dark.jpg' },
    imageAlt: 'Recovery Lens home screen with demo data: a recovery score ring with heart rate, skin temperature and breathing, above HRV, sleep, strain and sleep performance cards',
    tags: ['Health', 'Data viz', 'Privacy']
  },
  {
    handle: 'peptide-atlas',
    name: 'Peptide Atlas',
    pitch: 'An anatomical index of peptides and related compounds, mapped to where in the body they act.',
    problem:
      'Information about peptides is scattered across papers, forums and vendor pages, and it is hard to tell an authorised ' +
      'medicine from an unlicensed product. Peptide Atlas places 155 catalogued compounds on a 3D anatomical model, ' +
      'organised by body system, and ties every material claim to the source that supports it. ' +
      'It is an information product: no dosing, no vendors and no recommendations.',
    learnt: '',
    status: 'building',
    date: '2026-10-28',
    // Quando desligares a Deployment Protection no Vercel, põe aqui: 'https://peptideatlas-jmn9.vercel.app'
    live: '',
    repo: '',
    image: { dark: 'images/peptide-atlas.jpg' },
    imageAlt: 'Peptide Atlas brain and sleep view: a 3D brain in the centre, body systems listed on the left and the compounds that act on the brain listed on the right',
    tags: ['Health', '3D', 'Research']
  }
];
