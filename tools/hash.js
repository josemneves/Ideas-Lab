/* Generates the easter-egg line for js/easter-eggs.js. */
var word = document.getElementById('word');
var norm = document.getElementById('norm');
var line = document.getElementById('line');
var file = document.getElementById('file');
function update() {
  var w = word.value;
  if (!PLTR_SECRET.normalize(w)) { norm.textContent = ''; line.textContent = ''; file.textContent = 'secret/…html'; return; }
  var h = PLTR_SECRET.hash(w);
  var page = 'secret/' + PLTR_SECRET.sha256(h + Math.random()).slice(0, 10) + '.html';
  norm.textContent = PLTR_SECRET.normalize(w);
  line.textContent = "{ hash: '" + h + "', page: '" + page + "' },";
  file.textContent = page;
}
word.addEventListener('input', update);
document.getElementById('copy').addEventListener('click', function () {
  if (!line.textContent) return;
  var b = this;
  navigator.clipboard.writeText(line.textContent).then(function () {
    b.textContent = 'Copiado';
    setTimeout(function () { b.textContent = 'Copiar linha'; }, 1200);
  });
});
