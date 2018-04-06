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

    public componentWillReceiveProps(nextProps: RouteProps, nextContext: any) {
        if (super.componentWillReceiveProps) {
            super.componentWillReceiveProps(nextProps, nextContext);
        }

        if (this.props.component !== nextProps.component ||
            getMatchUrl(this.props) !== getMatchUrl(nextProps)) {
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
