import { observable } from 'mobx';

import { IStore } from '@Interfaces/Store';

export function createState<T extends {[key: string]: IStore}>(stores: T): T & {
    ready: boolean,
} {
    if (process.env.NODE_ENV === 'development') {
        if ('ready' in stores) {
            throw new Error(`'ready' is a reserved key in State.`);
        }
    }

    const state = observable(Object.assign(stores, {
        ready: false,
    }));

    const keys = Object.keys(state).filter((key) => key !== 'ready');

    (async () => {
        await Promise.all(keys.map((key) => {
            const store = ((state as any)[key] as IStore);
            if (store.prestart) {
                return store.prestart();
            }
        }));

        await Promise.all(keys.map((key) => {
            const store = ((state as any)[key] as IStore);
            return store.start();
        }));

        await Promise.all(keys.map((key) => {
            const store = ((state as any)[key] as IStore);
            if (store.poststart) {
                return store.poststart();
            }
        }));

        state.ready = true;
    })();

    return state;
}
