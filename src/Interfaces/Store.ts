export interface IStore {
    prestart?(): Promise<void>;
    start(): Promise<void>;
    poststart?(): Promise<void>;
}
