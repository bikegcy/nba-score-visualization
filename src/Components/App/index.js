import React, { Component } from 'react';
import moment from 'moment';
import LocalData from '../../data/nba.json';
import Chart from '../Chart';
import CustomInput from '../CustomInput';
import { Select, Radio } from 'antd';
import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    let nbaData = LocalData, teamData = {}, teams = [], startDay = moment([2016, 1, 1]);
    teams = this.processScoresData(nbaData, teamData, teams, startDay);
    this.state = {
      teams: teams,
      scoresData: teamData,
      selectedTeams: ["Golden State Warriors", "Houston Rockets"],
      filter: "both",
      startDay: startDay
    }
  }

  processScoresData = (nbaData=[], teamData={}, teams=[], startDay=moment([2016,1,1])) => {
    for (let obj of nbaData) {
      let visitorTeam = obj['Visitor/Neutral'], homeTeam = obj['Home/Neutral'];
      if (!teamData[visitorTeam]) teamData[visitorTeam] = [];
      if (!teamData[homeTeam]) teamData[homeTeam] = [];
      teamData[visitorTeam].push({
        realDate: moment(obj.Date, "MM-DD-YYYY").diff(startDay, 'days'),
        Date: obj.Date,
        type: 'visitor', 
        [visitorTeam]: obj.PTS, 
        score: obj.PTS}
      );
      teamData[homeTeam].push({
        realDate: moment(obj.Date, "MM-DD-YYYY").diff(startDay, 'days'),
        Date: obj.Date, 
        type: 'home', 
        [homeTeam]: obj.HPTS, 
        score: obj.HPTS}
      );
    }
    return [...Object.keys(teamData)];
  }

  handleFilterChange = (e) => {
    this.setState({filter: e.target.value})
  }

  handleSelectedTeamsChange = (value) => {
    this.setState({
      selectedTeams: value
    })
  }

  handleCustomInputSubmit = (data) => {
    let nbaData = data, teamData = {}, teams = [], startDay = moment([2016, 1, 1]);
    teams = this.processScoresData(nbaData, teamData, teams, startDay);
    this.setState({
      teams: teams,
      scoresData: teamData,
      selectedTeams: []
    });
  }

  render() {

    let chartScoreData = [];
    for (let team of Object.keys(this.state.scoresData)) {
      if (this.state.selectedTeams.includes(team)) {
        chartScoreData = chartScoreData.concat(this.state.scoresData[team].filter((singleGameData) => {
          return this.state.filter === "both" || singleGameData.type === this.state.filter;
        }))
      } 
    }
    const filter = this.state.filter;
    const allTeams = this.state.teams.map((team, index) => <Select.Option key={team}>{team}</Select.Option>);
    return (

      <div className="App">
        <h1>
          NBA Score Data Visualization
        </h1>
        <br></br>
        <div className="wrapBox">
          <Select
            className="multiSelect"
            mode="multiple"
            style={{ width: '50%' }}
            placeholder="Please select"
            defaultValue={['Golden State Warriors', 'Houston Rockets']}
            value={this.state.selectedTeams}
            onChange={this.handleSelectedTeamsChange}
          >
            {allTeams}
          </Select>
          <Radio.Group value={filter} onChange={this.handleFilterChange}>
            <Radio.Button value="home">Home</Radio.Button>
            <Radio.Button value="visitor">Visitor</Radio.Button>
            <Radio.Button value="both">Both</Radio.Button>
          </Radio.Group>
        </div>
        <Chart 
          scoresData = {chartScoreData}
          selectedTeams = {this.state.selectedTeams}
          startDay = {this.state.startDay}
        />
        <div className="customInputBox">
          <CustomInput handleCustomInputSubmit={this.handleCustomInputSubmit} />
        </div>

      </div>
    );
  }
}

export default App;
