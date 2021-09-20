import {Auth, Hub} from 'aws-amplify';
import {Component} from "react";

// Amplify.configure({ ...config, ssr: true });

class App extends Component {
  state = {user: null, customState: null};

  componentDidMount() {
    Hub.listen("auth", ({payload: {event, data}}) => {
      switch (event) {
        case "signIn":
          this.setState({user: data});
          break;
        case "signOut":
          this.setState({user: null});
          break;
        case "customOAuthState":
          this.setState({customState: data});
      }
    });

    Auth.currentAuthenticatedUser()
        .then(user => this.setState({user}))
        .catch(() => console.log("Not signed in"));
  }

  render() {
    const {user} = this.state;

    return (
        <div className="App">
          <button onClick={() => Auth.federatedSignIn()}>Open Hosted UI</button>
          <SignOutButton user={user}/>
        </div>
    );
  }
}

const SignOutButton = (props) => {
  if (props.user) {
    return (<button onClick={() => Auth.signOut()}>Sign Out {props.user.getUsername()}</button>);
  } else {
    return (<div>Not logged in</div>);
  }
}

export default App;