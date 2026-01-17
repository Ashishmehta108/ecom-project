export let isTransitioning = false;

export function startTransition(cb: () => void) {
  if (isTransitioning) return;
  isTransitioning = true;

  cb();

  setTimeout(() => {
    isTransitioning = false;
  }, 500);
}
