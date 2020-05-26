import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';

function Routes() {

    <Router>
      <Switch>
          <Route exact path='/' component={Home} />
          <Route path='/contact' component={Contact} />
          <Route path='/about' component={About} />
      </Switch>
  </Router>
}


export default Routes;