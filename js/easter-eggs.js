/* ============================================================
   EASTER EGGS — palavras secretas do terminal
   ------------------------------------------------------------
   Cada entrada liga o HASH de uma palavra a uma página.
   A palavra nunca fica escrita aqui (só o hash), por isso quem
   abrir o código-fonte não a consegue ler.

   Para criar um novo easter egg:
     1. Abre tools/hash.html no browser e escreve a palavra.
     2. Copia a linha gerada e cola-a na lista abaixo.
     3. Cria a página em secret/ (copia secret/exemplo.html).
        Usa um nome de ficheiro que NÃO revele a palavra
        (o hash.html sugere um nome aleatório).

   A comparação ignora maiúsculas, acentos e espaços a mais:
   "Coração", "coracao" e "  CORACAO " são a mesma palavra.
   ============================================================ */
window.EASTER_EGGS = [
  // DEMO — a palavra é "exemplo". Apaga esta linha quando criares os teus.
  { hash: 'f6ae215827627c14ecfe4aafe877ef705567f6ff7dbcde4abd262cecf267a3a7', page: 'secret/exemplo.html' }
];
