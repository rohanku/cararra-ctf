import React, { Component, createContext } from "react";
import { db, round } from "../services/firebase";

export const GlobalContext = createContext({ data: null });

class GlobalProvider extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: null,
      challenges: {},
    };
  }
  componentDidMount() {
    db.collection(`rounds/${round}/globals`)
      .doc("data")
      .get()
      .then((doc) => {
        this.setState({ data: doc.data() });
      });
    db.collection(`rounds/${round}/globals/data/challenges`)
      .orderBy("order", "desc")
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          this.setState((state) => {
            state.challenges[doc.id] = doc.data();
            return state;
          });
        });
      });
  }

  render() {
    return (
      <GlobalContext.Provider value={this.state}>
        {this.props.children}
      </GlobalContext.Provider>
    );
  }
}

export default GlobalProvider;
