/* =============================================================
   O ÚNICO FICHEIRO QUE PRECISAS DE EDITAR PARA ADICIONAR SITES.
   -------------------------------------------------------------
   Para adicionar um projeto: copia um objeto de PROJECTS e cola-o
   no FIM da lista. A numeração (01, 02...) segue esta ordem.

   - handle:  nome curto para o URL (#/projects/<handle>), só letras, números e "-"
   - status:  "live" | "building" | "prototype" | "paused"
   - live:    URL do site (deixa "" se ainda não estiver online)
   - repo:    URL do código (deixa "" se for privado)
   - image:   screenshot em images/ (16:10 fica melhor, ex. 1280×800)

   Os espaços vazios da grelha são preenchidos com "CLASSIFIED"
   até completar a linha, por isso não precisas de mais nada.
   ============================================================= */
window.SITE = {
  name: 'José Maria',
  tagline: 'Index of shipped ideas',
  intro:
    'I build small tools around problems I run into, put them online, ' +
    'and write down what I learn. This is the index of everything I have shipped so far.',
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
    pitch: 'Turns a WHOOP data export into a visual dashboard, without the data leaving your browser.',
    problem:
      'WHOOP lets you export all your data, but it arrives as raw CSV files that are hard to read. ' +
      'Recovery Lens turns them into charts and plain-language takeaways, including which habits ' +
      'change your next-day recovery. There is no account and no upload; everything runs on your device.',
    learnt: '',
    status: 'live',
    date: '2026-10-11',
    live: 'https://recoverylens.vercel.app',
    repo: '',
    image: 'images/recovery-lens.jpg',
    imageAlt: 'Recovery Lens dashboard with demo data: recovery, HRV, resting heart rate and sleep tiles above a bar chart of daily recovery',
    tags: ['Health', 'Data viz', 'Privacy']
  },
  {
    handle: 'rejuice',
    name: 'ReJuice',
    pitch: 'Refill machines that fill your reusable bottle with your favourite drinks for less.',
    problem:
      'Students buy single-use bottles every day because refilling with anything other than water is not an option on campus. ' +
      'ReJuice puts refill stations at Utrecht University: bring your own bottle, pay contactless, ' +
      'and get your drink for less than the supermarket or the cafeteria.',
    learnt: '',
    status: 'live',
    date: '2026-10-11',
    live: '', // TODO: URL do site no Vercel
    repo: 'https://github.com/josemneves/rejuice',
    image: 'images/rejuice.jpg',
    imageAlt: 'ReJuice homepage: "Bring your own bottle." headline next to a photo of a blue and white refill machine on campus',
    tags: ['Hardware', 'Sustainability', 'Campus']
  }
];
