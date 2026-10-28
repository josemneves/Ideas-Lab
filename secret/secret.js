/* Live clock in the header of the hidden pages (#clock). */
(function tick() {
  var d = new Date(), p = function (v) { return String(v).padStart(2, '0'); };
  var el = document.getElementById('clock');
  if (el) el.textContent = p(d.getHours()) + ':' + p(d.getMinutes()) + ':' + p(d.getSeconds());
  setTimeout(tick, 1000);
})();
