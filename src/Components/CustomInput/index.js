import React, { Component } from 'react';
import { Input, Popover, Button, message } from 'antd';
import Papa from 'papaparse';
import '../App/App.css';

class CustomInput extends Component {

  constructor(props) {
    super(props);
    console.log(this.props);
    this.state = {
      textCSV: ''
    }
  }

  handleTextareaChange = (e) => {
    this.setState({
      textCSV: e.target.value
    })
  }

  handleSubmit = () => {
    let inputData, loadedSuccess=false;
    let handleCustomInputSubmit = this.props.handleCustomInputSubmit;
    Papa.parse(this.state.textCSV, {
      header: true,
      complete: function(results) {
        inputData = [...results.data];
        if (results.errors[0]) {
          message.error(results.errors[0].message);
        } else {
          message.success('Data loaded successfully! Please select your teams.');
          handleCustomInputSubmit(inputData);
          loadedSuccess = true;
        }
      }
    })
    if (loadedSuccess) {
      this.setState({textCSV: ''});
    }
  }

  render() {
    const content = (
      <div>
        <p>Your data should be copied directly from the original CSV file</p>
        <p>Your data must have the following property: </p>
        <p>Date, Visitor/Neutral, PTS, Home/Neutral, HPTS </p>
        <p>Leave certain property blank if it doesn't have any value. </p>
      </div>
    );
    return(
      <div>
        <Popover content={content} title="Score Data Format Requirement">
          <Button className="description" >
            Customized Score Data
          </Button>
        </Popover>
        <Input.TextArea 
          onChange={this.handleTextareaChange}
          value={this.state.textCSV}
          className="customInputArea"
          rows={4} 
          placeholder={"Paste your score data here"}
        />
        <br></br>
        <Button type="primary" className="customSubmitButton" onClick={this.handleSubmit}>
          submit
        </Button>
      </div>
      
    );
  }
}

export default CustomInput;