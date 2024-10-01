import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
                annotations: {
                    xaxis: [
                        ...(props.bullflags ? props.bullflags.map(flag => ({
                            x: flag,
                            borderColor: "#00E396",
                            label: {
                                borderColor: "#00E396",
                                style: {
                                    color: "#fff",
                                    background: "#00E396"
                                },
                                text: "Bull Flag Conf",
                                orientation: "horizontal",
                            },
                        })) : []),
                        ...(props.bearflags ? props.bearflags.map(flag => ({
                            x: flag,
                            borderColor: "#FF4560",
                            label: {
                                borderColor: "#FF4560",
                                style: {
                                    color: "#fff",
                                    background: "#FF4560"
                                },
                                text: "Bear Flag Conf",
                                orientation: "horizontal",
                            },
                        })) : [])
                    ],
                },
                chart: {
                    type: 'candlestick',
                    id: 'candlestick-chart'
                },
                xaxis: {
                    type: 'datetime'
                },
            },
            series: [{
                data: props.stockInfo
            }]
            
        };
    }

    componentDidUpdate(prevProps) {
        if (this.props.stockInfo !== prevProps.stockInfo || this.props.bullflags !== prevProps.bullflags || this.props.bearflags !== prevProps.bearflags) {
            this.setState(prevState => ({
                series: [{
                    data: this.props.stockInfo
                }],
                options: {
                    ...prevState.options,
                    annotations: {
                        xaxis: [
                            ...(this.props.bullflags && this.props.bullflags.length > 0 ? this.props.bullflags.map(flag => ({
                                x: flag,
                                borderColor: "#00E396",
                                label: {
                                    borderColor: "#00E396",
                                    style: {
                                        color: "#fff",
                                        background: "#00E396"
                                    },
                                    text: "Bull Flag Conf",
                                    orientation: "horizontal",
                                }
                            })) : []),
                            ...(this.props.bearflags && this.props.bearflags.length > 0 ? this.props.bearflags.map(flag => ({
                                x: flag,
                                borderColor: "#FF4560",
                                label: {
                                    borderColor: "#FF4560",
                                    style: {
                                        color: "#fff",
                                        background: "#FF4560"
                                    },
                                    text: "Bear Flag Conf",
                                    orientation: "horizontal",
                                }
                            })) : [])
                        ],
                    }
                }
            }));
        }
    }

    render() {
        return (
            <Chart options={this.state.options} series={this.state.series} type="candlestick" height={350} />
            
        );
    }
}

export default App;