import React, { Component } from "react";

import classnames from "classnames";
import Loading from "./Loading";
import Panel from "./Panel";
import {
  getTotalPhotos,
  getTotalTopics,
  getUserWithMostUploads,
  getUserWithLeastUploads
} from "helpers/selectors";

const data = [
  {
    id: 1,
    label: "Total Photos",
    getValue: getTotalPhotos
  },
  {
    id: 2,
    label: "Total Topics",
    getValue: getTotalTopics
  },
  {
    id: 3,
    label: "User with the most uploads",
    getValue: getUserWithMostUploads
  },
  {
    id: 4,
    label: "User with the least uploads",
    getValue: getUserWithLeastUploads
  }

];

class Dashboard extends Component {
  //set inital loading state to false 
  state = {
    loading: true,
    focused: null,
    photos: [],
    topics: []
  };

  //check if there is a saved focus state when rendering app initally
  componentDidMount() {
    const focused = JSON.parse(localStorage.getItem("focused"));

    if (focused) {
      this.setState({ focused });
    }

    const urlsPromise = [
      "/api/photos",
      "/api/topics",
    ].map(url => fetch(url).then(response => response.json()));

    Promise.all(urlsPromise)
      .then(([photos, topics]) => {
        this.setState({
          loading: false,
          photos: photos,
          topics: topics
        });
      });

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

    console.log(this.state);
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
            value={panel.getValue(this.state)}
            onSelect={() => this.selectPanel(panel.id)}
          />
        ));


    return <main className={dashboardClasses}>{panels}</main>;
  }
}

export default Dashboard;
