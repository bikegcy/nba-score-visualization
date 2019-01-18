import React, { Component } from 'react';
import moment from 'moment';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import './style.css';

class Chart extends Component {

  formatDate = (passedDays) => moment(this.props.startDay).add(passedDays, 'days').format('MM/DD/YYYY');

  render() {
    const colors = ["#fb8072","#8dd3c7","#fad744","#bebada","#80b1d3","#fdb462","#b3de69","#fccde5","#d9d9d9","#bc80bd"];
    return(
      <div className="chart">
        <LineChart width={900} height={450} data={this.props.scoresData} className="chart">
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="realDate" 
            type='number' 
            domain={['auto', 'dataMax']} 
            tickFormatter={timeStr => this.formatDate(timeStr)}
            padding={{left: 30, right: 40}}
          />
          <YAxis type="number" domain={['auto', 'auto']} padding={{top: 10}} />
          <Tooltip 
            labelFormatter={label => this.formatDate(label)}
            formatter={(value, name, props) => value + ' - ' + props.payload.type}  
          />
          <Legend />
          {
            this.props.selectedTeams.map((team, index) => {
              return <Line key={index} dataKey={team} stroke={colors[index]} />
            })
          }
        </LineChart>
      </div>
    );
  }
}

export default Chart;