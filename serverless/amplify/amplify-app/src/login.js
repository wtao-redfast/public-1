import React from "react";
import { withAuthenticator, AmplifySignOut } from "@aws-amplify/ui-react";
import { Hub } from "aws-amplify";
import { useHistory } from "react-router-dom";

const PreBuilt = withAuthenticator(() => (
  <div>
    <AmplifySignOut />
  </div>
));

const Login = () => {
  const history = useHistory();

  React.useEffect(() => {
    Hub.listen("auth", (data) => {
      switch (data.payload.event) {
        case "signIn":
          console.log("user signed in");
          history.goBack();
          break;
        case "signUp":
          console.log("user signed up");
          break;
        case "signOut":
          console.log("user signed out");
          history.goBack();
          break;
        case "signIn_failure":
          console.error("user sign in failed");
          break;
        case "tokenRefresh":
          console.log("token refresh succeeded");
          break;
        case "tokenRefresh_failure":
          console.error("token refresh failed");
          break;
        case "configured":
          console.log("the Auth module is configured");
          break;
        default:
          console.log(data);
          break;
      }
    });
  }, [history]);

  return <PreBuilt />;
};

export default Login;
