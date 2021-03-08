import React, { Component } from 'react';
import { View, Text, ActivityIndicator } from "react-native";

import { ApolloProvider, Query } from "react-apollo";
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";
import Pokemon from "./src/components/Pokemon";
import getRandomInt from "./src/helpers/getRandomInt";
const client = new ApolloClient({ uri: 'http://192.168.20.103:4000/graphql' })

export const AppContext = React.createContext({ data: { pokemon: null } });
export default class App extends Component {

  state = {
    query: null
  }
  componentDidMount() {
    const query = this.getQuery();
    this.setState({
      query
    });
  }
  getQuery = () => {
    const randomID = getRandomInt(1, 807);
    console.log(randomID)
    return `
      query GetPokemonById {
        pokemon(id: ${randomID}) {
          id,
          name,
          desc,
          pic,
          types {
            id,
            name
          }
        }
      }
    `
  }
  onGetNewPokemon = () => {
    const query = this.getQuery();
    this.setState({
      query
    });
  }
  render() {
    const { query } = this.state;
    if (!query) return null;

    return (
      <ApolloProvider client={client}>
        <Query query={gql`${query}`} >
          {({ loading, error, data }) => {
            if (loading || error) return <ActivityIndicator size="large" color="#0000ff" />
            return (
              <AppContext.Provider value={{ ...data.pokemon, onPress: this.onGetNewPokemon }} style={styles.container}>
                <Pokemon />
              </AppContext.Provider>
            )
          }}
        </Query>
      </ApolloProvider>
    );
  }
}