import React from 'react';
import { Redirect, Route } from 'react-router-dom';
import { IonApp, IonRouterOutlet } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';


/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import { UserPage, UserEdit, VisitUser } from './profile';
import { AuthProvider, Login, PrivateRoute, Confirm } from './auth';
import SignUp from './auth/SignUp';
import FileUpload from './profile/FileUpload';
import AddPost from './profile/AddPost';
import { PostProvider } from './profile/PostProvider';
import { NewsFeedProvider } from './newsfeed/NewsFeedProvider';
import NewsFeed from './newsfeed/NewsFeed';
import Mission from "./Mission/Mission";
import Help from "./Mission/Help";
import Contact from "./Mission/Contact";
import Matcher from './matcher/Matcher';

const App: React.FC = () => (
  <IonApp>
    <IonReactRouter>
      <IonRouterOutlet>
        <Route path="/match" component={Matcher} exact={true}/>
        <AuthProvider>
          <Route path="/login" component={Login} exact={true}/>
          <Route path="/mission" component={Mission} exact={true}/>
          <Route path="/help" component={Help} exact={true}/>
          <Route path="/contact" component={Contact} exact={true}/>
          <PostProvider>
            <PrivateRoute path="/user" component={UserPage}/>
            <PrivateRoute path="/user/edit/:username" component={UserEdit}/>
            <PrivateRoute path="/user/post" component={AddPost}/>
          </PostProvider>
          <Route path="/signup" component={SignUp}/>
          {/* <Route path="/public/user" component={UserPage}/>
          <Route path="/public/edit" component={UserEdit}/> */}
          <NewsFeedProvider>
            <Route path="/home" component={NewsFeed}/>
          </NewsFeedProvider>
          <PostProvider>
            {/*<Route path="/visit" component={VisitUser}/>*/}
            <Route path="/visit/:username" component={VisitUser}/>
          </PostProvider>
          <Route path="/confirm" component={Confirm}/>
          <Route exact path="/" render={() => <Redirect to="/user"/>}/>
        </AuthProvider>
      </IonRouterOutlet>
    </IonReactRouter>
  </IonApp>
);

export default App;
