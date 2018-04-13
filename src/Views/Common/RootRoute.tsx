import { Route, RouteProps, RouterChildContext } from 'react-router-dom';

function getMatchUrl(props: any) {
    if (props && props.computedMatch) {
        return props.computedMatch.url;
    }
    return undefined;
}

export class RootRoute extends Route {
    public componentDidMount() {
        if (super.componentDidMount) {
            super.componentDidMount();
        }

        this.scrollOnNeed();
    }

    public componentDidUpdate(prevProps: Readonly<RouteProps>, prevState: Readonly<any>, snapshot?: never) {
        if (super.componentDidUpdate) {
            super.componentDidUpdate(prevProps, prevState, snapshot);
        }

        if (prevProps.component !== this.props.component ||
            getMatchUrl(prevProps) !== getMatchUrl(this.props)) {
            this.scrollOnNeed();
        }
    }

    private scrollOnNeed = () => {
        const context: RouterChildContext<any> | undefined = this.context;

        if (context && context.router && context.router.history.action !== 'POP') {
            window.scrollTo(0, 0);
        }
    }
}
