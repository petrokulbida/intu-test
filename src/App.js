import React, { Component } from 'react';
import moment from "moment";

export default class App extends Component {

    constructor( props ) {
        super( props );

        this.state = App.getInitialSate();
        this.handleTick         = this.handleTick.bind(this);
        this.handleStartAndStop = this.handleStartAndStop.bind(this);
        this.handleLap          = this.handleLap.bind(this);
        this.handleReset        = this.handleReset.bind(this);
    }

    static getInitialSate() {
        return {
            start: 0,
            lap: 0,
            mSecElapsed: 0,
            isRunning: false,
            results: []
        }
    }

    handleTick() {
        this.setState({
            mSecElapsed: new Date().getTime() - this.state.start
        })
    }

    handleStartAndStop() {
        if ( this.state.isRunning ) {
            this.handleStop();
            return;
        }

        let startValue = this.state.start;
        if ( this.state.start === 0 ) {
            startValue = new Date().getTime();
        }

        this.setState({
            start: startValue,
            isRunning: true,
            lap: new Date().getTime()
        });

        this.interval = setInterval(this.handleTick.bind(this), 10);
    }

    handleLap() {
        if ( this.state.isRunning ) {
            let oldResults = this.state.results,
                results    = oldResults.concat([{
                    key: new Date().getTime(),
                    total: this.state.mSecElapsed,
                }]);

            this.setState({
                lap: new Date().getTime(),
                results: results
            });
        }
    }

    handleStop() {
        this.handleLap();
        this.setState({ isRunning : false });
        clearInterval( this.interval );
    }

    handleReset() {
        this.setState( App.getInitialSate() );
    }

    static secondsToString(ms) {
        return moment().hour(0).minute(0).second(0).millisecond(ms).format('HH:mm:ss.SSS');
    }

    render() {
        let results = this.state.results;

        return (
            <div className="container">
                <div className="stop-watch">
                    <div className="stop-watch-value">{App.secondsToString(this.state.mSecElapsed)}</div>
                </div>
                <div className="row">
                    <button className="button-start-stop"
                            type="button"
                            onClick={this.handleStartAndStop}>
                        {this.state.isRunning ? 'Stop' : 'Start'}
                    </button>
                    <button className="button-lap"
                            type="button"
                            onClick={this.handleLap}
                            disabled={this.state.isRunning ? '' : 'disabled'}>
                        Lap
                    </button>
                    <button className="button-reset"
                            type="button"
                            onClick={this.handleReset}
                            disabled={this.state.isRunning ? 'disabled' : ''}>
                        Reset
                    </button>
                </div>
                <div className="block">
                    <table className="lap-list">
                        <thead>
                        <tr>
                            <th>#</th>
                            <th>Snapshot</th>
                        </tr>
                        </thead>
                        <tbody>
                        {results.map((result, index) =>
                            <tr key={index}>
                                <td>{index}</td>
                                <td>{App.secondsToString(result.total)}</td>
                            </tr>
                        )}
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }
}
