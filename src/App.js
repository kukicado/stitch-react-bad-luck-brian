import React, { useState, useEffect } from "react";

import {client, mongodb} from './Stitch';
import { getAllMemes, insertMeme} from './MongoDB';
import {
  AnonymousCredential,
  GoogleRedirectCredential,
} from "mongodb-stitch-browser-sdk";

import blb from './blb.jpg';

import "./App.css";

const App = () => {
  let [user, setUser] = useState({});
  let [memes, setMemes] = useState([]);
  let [topCaption, setTopCaption ] = useState("");
  let [bottomCaption, setBottomCaption] = useState("");


  useEffect(()=>{
    if(client.auth.user){
      getAllMemes().then(data => {
        setMemes(data);
      })
    }
  }, [])


  if (client.auth.hasRedirectResult()) {
    client.auth.handleRedirectResult().then(user => {
        console.log(user);
    });
  }
  const login = () => {
    client.auth.loginWithCredential(new AnonymousCredential())
    .then((user)=>{
      getAllMemes().then(data => {
        setMemes(data);
      }
    )})
    .catch(err => console.log(err))
  }

  const logout = () => {
    console.log('called');
    client.auth.logout();
    setUser();
  }

  const handleTopChange = (event) => {
    setTopCaption(event.target.value);
  }

  const handleBottomChange = (event) => {
    setBottomCaption(event.target.value);
  }

  const handleInsertMeme = (e) => {
    console.log('called');
    e.preventDefault();
    console.log(topCaption);
    console.log(bottomCaption);
    console.log(client.auth.user);
    
    insertMeme(client.auth.user, topCaption, bottomCaption).then(()=>{
      setTopCaption("");
      setBottomCaption("");
      getAllMemes().then(data => {
        setMemes(data);
      })
    })
    
  }

  return (
    <div>
      <div className="flex bg-black text-white">
        <div className="w-1/2">Superstitions</div>
        <div className="w-1/2">
          {client.auth.user &&
            <div onClick={()=>logout()}>Logout</div>
          }
          {!client.auth.user &&
            <div onClick={()=>login()}>Login</div>
            
          }
        </div>
      </div>
      <div className="bg-gray-500">
        <div className="container mx-auto text-center">
          <div className="flex flex-wrap">
            <div className="w-1/3 p-5 relative">

              <form onSubmit={handleInsertMeme}>
              <div className="absolute caption top">
                <input className="rounded-lg" type="text" onChange={(e)=>handleTopChange(e)} />
              </div>

              <img className="image my-5" src={blb} alt="Bad Luck Brian" />

              <div className="absolute caption bottom">
                <input className="rounded-lg" type="text" onChange={(e) => handleBottomChange(e)} />
                </div>
              <input type="submit" value="Submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" />
              </form>
            </div>
            {memes.map(meme => (
              <div className="w-1/3 p-5 text-white relative" key={meme._id}>
                <div className="absolute caption top">{meme.top_caption}</div>
                <img className="image my-5" src={blb} alt="Bad Luck Brian" />
                <div className="absolute caption bottom">{meme.bottom_caption}</div>
                <div>
                  <div className="text-black">{meme.votes}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
        </div>
    </div>
  )
};

export default App;

/*
class App extends Component {
  constructor() {
    super();
    this.state = {
      todos: [],
      value: ""
    };

    console.log(client.auth.isLoggedIn);

    this.handleChange = this.handleChange.bind(this);
    this.displayTodos = this.displayTodos.bind(this);
    this.addTodo = this.addTodo.bind(this);
  }

  componentDidMount() {
    // Initialize the App Client
    this.client = client;
    // Get a MongoDB Service Client, used for logging in and communicating with Stitch
    const mongodb = this.client.getServiceClient(
      RemoteMongoClient.factory,
      "main"
    );
    // Get a reference to the todo database
    this.db = mongodb.db("friday");

    this.displayTodosOnLoad();
  }

  displayTodos() {
    this.db
      .collection("superstitions")
      .find({}, { limit: 1000 })
      .asArray()
      .then(todos => {
        this.setState({
          todos
        });
      });
  }

  displayTodosOnLoad() {
    
    this.client.auth
      .loginWithCredential(new AnonymousCredential())
      .then(this.displayTodos)
      .catch(console.error);
    
  }

  addTodo(event) {
    event.preventDefault();
    const { value } = this.state;

    this.db
      .collection("superstitions")
      .insertOne({
        owner_id: this.client.auth.user.id,
        item: value
      })
      .then(this.displayTodos);
  }

  handleChange(event) {
    this.setState({ value: event.target.value });
  }

  render() {
    return (
      <div className="App">
        <h3>This is a todo app</h3>
        <hr />
        <p>Add a Todo Item:</p>
        <form onSubmit={this.addTodo}>
          <label>
            <input
              type="text"
              value={this.state.value}
              onChange={this.handleChange}
            />
          </label>
          <input type="submit" value="Submit" />
        </form>
        <ul>
          {this.state.todos.map(todo => {
            return <li>{todo.item}</li>;
          })}
        </ul>
      </div>
    );
  }
}
*/
