// Scroll-driven diagram driver.
//
// Each `.scrolly` block pairs a sticky SVG stage with a column of scroll steps.
// A step carries `data-show="a,b,c"`: the ids of the SVG layers to reveal while
// that step is centered in the viewport. Layers are tagged `data-el="<id>"` and
// hidden until their id is listed. An entry `drop-<id>` fades the source row
// `<id>` (the "this row is dropped" state); `scan` toggles every `.scan` layer.
//
// This mirrors the join-diagram prototype's behavior but supports many blocks on
// one page. Scrolling alone drives it: unlike the standalone prototype we do not
// hijack the arrow keys, since this runs on a tutorial page with a code editor
// and normal page scroll.

// Put a stage into the state a step describes. Exported so the gallery page
// (src/pages/scrollytelling) can render a finished diagram as a still preview.
export function applyShow(stage: Element, show: string[]): void {
  const reveal = (id: string) => {
    const el = stage.querySelector(`[data-el="${CSS.escape(id)}"]`);
    if (el) el.classList.add("on");
  };
  stage.querySelectorAll(".lyr,.arrow,.arrowhead,.scan,.drop").forEach((el) => el.classList.remove("on"));
  show.forEach((token) => {
    if (token === "scan") stage.querySelectorAll(".scan").forEach((s) => s.classList.add("on"));
    else if (token.startsWith("drop-")) reveal(token.slice(5));
    else reveal(token);
  });
}

let initialized = false;

export function initScrolly(): void {
  if (initialized) return;
  initialized = true;
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", setup, { once: true });
  } else {
    setup();
  }
}

function setup(): void {
  const blocks = Array.from(document.querySelectorAll<HTMLElement>(".scrolly"));
  if (blocks.length === 0) return;

  blocks.forEach((block) => {
    const stage = block.querySelector<HTMLElement>(".scrolly-stage");
    const steps = Array.from(block.querySelectorAll<HTMLElement>(".scrolly-step"));
    if (!stage || steps.length === 0) return;

    const apply = (i: number) => {
      applyShow(stage, (steps[i].getAttribute("data-show") || "").split(",").filter(Boolean));
      steps.forEach((s, k) => s.classList.toggle("is-active", k === i));
    };

    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) apply(steps.indexOf(entry.target as HTMLElement));
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 }
    );

    steps.forEach((s) => io.observe(s));
    apply(0);
  });
}
