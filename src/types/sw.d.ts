declare const self: ServiceWorkerGlobalScope;

interface CacheStorage {
  open(cacheName: string): Promise<Cache>;
  match(request: RequestInfo): Promise<Response | undefined>;
  keys(): Promise<string[]>;
  delete(cacheName: string): Promise<boolean>;
}

interface ServiceWorkerGlobalScope {
  caches: CacheStorage;
  registration: ServiceWorkerRegistration;
  addEventListener(
    type: "install" | "activate" | "fetch",
    listener: (event: InstallEvent | ActivateEvent | FetchEvent) => void
  ): void;
}

interface InstallEvent extends ExtendableEvent {}
interface ActivateEvent extends ExtendableEvent {}
interface FetchEvent extends ExtendableEvent {
  request: Request;
  respondWith(response: Promise<Response> | Response): void;
}
interface ExtendableEvent extends Event {
  waitUntil(promise: Promise<any>): void;
}
