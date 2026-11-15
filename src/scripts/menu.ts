// スマホのハンバーガーメニュー（<dialog> を使うので、フォーカスの閉じ込めと Esc は標準動作）
const dialog = document.getElementById('sp-menu') as HTMLDialogElement | null;
const openBtn = document.querySelector<HTMLButtonElement>('[data-menu-open]');
const closeBtn = document.querySelector<HTMLButtonElement>('[data-menu-close]');

if (dialog && openBtn) {
  const setOpen = (open: boolean) => {
    openBtn.setAttribute('aria-expanded', String(open));
    document.documentElement.classList.toggle('is-menu-open', open);
  };
  openBtn.addEventListener('click', () => {
    dialog.showModal();
    setOpen(true);
  });
  closeBtn?.addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    setOpen(false);
    openBtn.focus();
  });
  // 背景（ダイアログの外側）をタップしたら閉じる
  dialog.addEventListener('click', (e) => {
    if (e.target === dialog) dialog.close();
  });
  // メニュー内のリンクを押したら閉じる（同じページ内リンク対策）
  dialog.querySelectorAll('a').forEach((a) => a.addEventListener('click', () => dialog.close()));
  // PC幅に広げたら閉じる
  matchMedia('(min-width: 1024px)').addEventListener('change', (e) => {
    if (e.matches && dialog.open) dialog.close();
  });
}
