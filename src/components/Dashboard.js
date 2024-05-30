import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";

const data = [
  {
    id: 1,
    label: "Total Photos",
    value: 10
  },
  {
    id: 2,
    label: "Total Topics",
    value: 4
  },
  {
    id: 3,
    label: "User with the most uploads",
    value: "Allison Saeng"
  },
  {
    id: 4,
    label: "User with the least uploads",
    value: "Lukas Souza"
  }
];

class Dashboard extends Component {
  //set inital loading state to false 
  state = {
    loading: false,
    focused: null
  };

  //check if there is a svaved focus state when rendering app initally
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));
    
    if (focused) {
      this.setState({ focused });
    }
  }
  
  //method to listen for changes to state
  componentDidUpdate(previousProps, previousState) {
    if (previousState.focused !== this.state.focused) {
      localStorage.setItem("focused", JSON.stringify(this.state.focused));
    }
  }
  
  //function to set state of focused. If previous state is not null, return state to null, else expand panel for selected id
  selectPanel(id) {
    this.setState(previousState => ({
      focused: previousState.focused !== null ? null : id
    }));
  }

  render() {
    //redner dashboard focused css element when focused is truthy
    const dashboardClasses = classnames("dashboard", {
      "dashboard--focused": this.state.focused
     });
    //display loading state when loading
    if (this.state.loading) {
      return <Loading />;
    }
    //display panels from panel compenent, redner lardger version of single panel when focus state changed
    const panels =
      //if the state of focused is truth, render the focused panel id
      (this.state.focused ? data.filter(panel => this.state.focused === panel.id) : data)
        .map(panel => (
          <Panel
            key={panel.id}
            label={panel.label}
            value={panel.value}
            onSelect={(event) => this.selectPanel(panel.id)}
          />
        ));


    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
