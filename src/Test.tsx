import React from 'react';
// import loadCsv from './utils/load-csv';

interface Test1Props {
  inputString?: string;
}

interface Test1State {
  counter: number;
}

class Test1 extends React.Component<Test1Props, Test1State> {
  state: Test1State = { counter: 0 };

  handleClick = () => {
    this.setState({ counter: this.state.counter + 1 });
  };

  render() {
    return (
      <>
        <p>test1</p>
        <br />
        {this.props.inputString}
        <br />
        counter: {this.state.counter}
        <p>test2</p>
        <button onClick={this.handleClick}>click me</button>
      </>
    );
  }
}

export default Test1;
