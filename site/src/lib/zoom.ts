let dialog: HTMLDialogElement | null = null;
let dialogImg: HTMLImageElement | null = null;
let initialized = false;

function ensureDialog(): HTMLDialogElement {
  if (dialog) return dialog;
  dialog = document.createElement("dialog");
  dialog.className = "sqlt-zoom-dialog";
  dialog.setAttribute("role", "dialog");
  dialog.setAttribute("aria-modal", "true");
  dialog.innerHTML = `
    <button type="button" class="sqlt-zoom-close" aria-label="Close enlarged image" data-zoom-close>×</button>
    <img alt="" />
    <span class="sqlt-zoom-hint" aria-hidden="true">Click the image to zoom to full width</span>
  `;
  dialogImg = dialog.querySelector("img");
  const hint = dialog.querySelector<HTMLSpanElement>(".sqlt-zoom-hint");
  dialogImg?.addEventListener("click", () => {
    const zoomed = dialog!.classList.toggle("is-zoomed");
    if (hint) hint.textContent = zoomed ? "Click the image to fit the screen" : "Click the image to zoom to full width";
    dialog!.scrollTop = 0;
  });
  dialog.querySelector<HTMLButtonElement>("[data-zoom-close]")?.addEventListener("click", () => {
    dialog?.close();
  });
  dialog.addEventListener("click", (e) => {
    // Click on the backdrop (the dialog itself, outside the img) → close
    if (e.target === dialog) dialog?.close();
  });
  dialog.addEventListener("keydown", (e) => {
    if (e.key === "Escape") dialog?.close();
  });
  document.body.appendChild(dialog);
  return dialog;
}

export function initZoomImages(): void {
  if (initialized) return;
  initialized = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", scan, { once: true });
  } else {
    scan();
  }
}

function scan() {
  document
    .querySelectorAll<HTMLButtonElement>(".zoom-image:not([data-zoom-hydrated])")
    .forEach((btn) => {
      btn.dataset.zoomHydrated = "1";
      const img = btn.querySelector("img");
      if (!img) return;
      btn.addEventListener("click", () => {
        const d = ensureDialog();
        const altText = img.alt || "image";
        if (dialogImg) {
          dialogImg.src = img.src;
          dialogImg.alt = altText;
        }
        d.classList.remove("is-zoomed");
        const hint = d.querySelector(".sqlt-zoom-hint");
        if (hint) hint.textContent = "Click the image to zoom to full width";
        d.setAttribute("aria-label", `Enlarged: ${altText}`);
        d.showModal();
      });
    });
}
