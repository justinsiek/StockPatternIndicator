import React, { Component } from 'react';
import Chart from 'react-apexcharts';

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            options: {
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
        if (this.props.stockInfo !== prevProps.stockInfo) {
            this.setState({
                series: [{
                    data: this.props.stockInfo
                }]
            });
        }
    }

    render() {
        return (
            <Chart options={this.state.options} series={this.state.series} type="candlestick" height={350} />
        );
    }
}

export default App;