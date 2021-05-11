import React from "react";
import MenuPage from './Menu.js';
import Lobby from "./Lobby.js";
import firebase from "./firebase.js";
import GameCanvas from "./Canvas.js";
import ReactDOM from 'react-dom';

class GamePage extends React.Component {

    constructor(){
        super()
        this.state = {
            inLobby: false,
            Game_Key: "",
            name: "",
            players : []
        }
        this.updatecounter = 0;
        this.turnnum = 0;
        this.setInLobby = this.setInLobby.bind(this)
        this.onBackClick = this.onBackClick.bind(this)
        this.updatePlayers = this.updatePlayers.bind(this)
        this.setInGame = this.setInGame.bind(this)
        this.unsubscribe_listener = this.unsubscribe_listener.bind(this)
    }

    onBackClick(){
        this.setState(
            {
                inLobby : false,
                Game_Key : this.state.Game_Key,
                name : this.state.name,
                players: []
            })
    }

    updatePlayers(){
        console.log("penano");
        console.log("gamekey:", "Game " + this.state.Game_Key);
        this.unsubscribe = firebase.firestore().collection("Games").doc("Game " + this.state.Game_Key).onSnapshot(snapshot => {
            console.log(snapshot.data())
            if (snapshot.data()){
                this.setState({
                    inLobby : this.state.inLobby,
                    Game_Key : this.state.Game_Key,
                    name : this.state.name,
                    players: snapshot.data().players
                }, () => {
                    if(this.updatecounter === 0){
                        this.updatecounter += 1;
                        this.turnnum = this.state.players.length
                    }
                })
            }
        })
    }

    unsubscribe_listener(){
        console.log("Hello How Are You Pee poo time");
        this.unsubscribe();
    }

    setInLobby(status, gamekey, playername) {
        this.setState({
            inLobby : status,
            Game_Key : gamekey,
            name : playername,
            players: this.state.players
        }, () => {
        this.updatePlayers();
        });
    }

    setInGame(){
        this.setState({
            inLobby : "In Game",
            Game_Key : this.state.Game_Key,
            name : this.state.name,
            players: this.state.players
        }, () => {
            this.unsubscribe_listener();
        })
    }

    render(){
        return (
            <div>
             {this.state.inLobby === true && 
             (
                <Lobby Lobbycode = {this.state.Game_Key} playerlist={this.state.players} setInGame = {this.setInGame} name= {this.state.name} setInLobby = {this.setInLobby}/>
             )}
             {this.state.inLobby === false && (<MenuPage setInLobby = {this.setInLobby}/>)}
             {this.state.inLobby === "In Game" && (<GameCanvas playernum = {this.state.players.length} turnnumber ={this.turnnum} Game_Key={this.state.Game_Key}/>) }
             </div>
        )
    }
}
export default GamePage;