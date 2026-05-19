export async function enableMocking() {
  if (import.meta.env.PROD) return;
  // MSW worker setup placeholder — implement handlers under src/mocks/handlers/
  // const { worker } = await import('./browser');
  // await worker.start({ onUnhandledRequest: 'bypass' });
}
