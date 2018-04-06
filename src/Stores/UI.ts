import * as bowser from 'bowser';
import { Location } from 'history';
import { action, computed, observable } from 'mobx';

import { IStore } from '@Interfaces/Store';

type Viewport =
    'small' |
    'medium' |
    'large'
;

const ViewportSetting: Array<[Viewport, number | null]> = [
    [ 'small', 420 ],
    [ 'medium', 800 ],
    [ 'large', null ],
];

export default class UIStore implements IStore {
    @observable public lastLocation?: Location;

    public readonly isMobile = bowser.mobile || bowser.tablet;
    public readonly isRetina =
        (window.matchMedia
            ? window.matchMedia('-webkit-min-device-pixel-ratio: 2), (min-resolution: 192dpi').matches
            : false)
        || (window.devicePixelRatio ? window.devicePixelRatio >= 2 : false);

    @observable private _viewport: Viewport = 'large';
    @computed public get viewport() { return this._viewport; }

    @observable private _windowWidth: number = 0;
    @computed public get windowWidth() { return this._windowWidth; }

    private windowScrollTop?: number;

    public setBodyScroll(enable: boolean) {
        if (!this.isMobile) {
            document.body.style.overflow = enable ? '' : 'hidden';
        }
        else {
            if (enable) {
                document.body.style.overflow = '';
                document.body.style.position = '';
                document.body.style.height = '';

                document.documentElement.style.overflow = '';
                document.documentElement.style.position = '';
                document.documentElement.style.height = '';

                if (this.windowScrollTop !== undefined) {
                    window.scrollTo(undefined, this.windowScrollTop);
                    this.windowScrollTop = undefined;
                }
            }
            else {
                this.windowScrollTop = window.scrollY;

                document.body.style.overflow = 'hidden';
                document.body.style.position = 'relative';
                document.body.style.height = '100%';

                document.documentElement.style.overflow = 'hidden';
                document.documentElement.style.position = 'relative';
                document.documentElement.style.height = '100%';
            }
        }
    }

    @action
    public async start() {
        this.applyAndroidFix();

        window.addEventListener('resize', this.handleWindowResize);
        this.handleWindowResize();
    }

    private applyAndroidFix() {
        if (navigator.userAgent.toLowerCase().indexOf('android') === -1) {
            return;
        }

        window.addEventListener('resize', () => {
            if (document.activeElement.tagName === 'INPUT' || document.activeElement.tagName === 'TEXTAREA') {
                window.setTimeout(() => document.activeElement.scrollIntoView());
            }
        });
    }

    @action
    private handleWindowResize = () => {
        if (this._windowWidth !== window.innerWidth) {
            this._windowWidth = window.innerWidth;
        }

        let viewport: Viewport | undefined;

        for (const setting of ViewportSetting) {
            if (setting[1] !== null && this._windowWidth > setting[1]!) {
                continue;
            }
            else {
                viewport = setting[0];
                break;
            }
        }

        if (viewport && viewport !== this._viewport) {
            this._viewport = viewport;
        }
    }
}
