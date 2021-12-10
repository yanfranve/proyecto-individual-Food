// import React from "react";
// import { Route, Switch } from "react-router-dom";

// import NavBar from "./componets/NavBar/NavBar.js";
// import Home from "./componets/Home/Home.js";
// import Principal from "./componets/Principal/Principal.js";
// // import Detail from "./componets/Detail/Detail.js";
// // import Create from "./componets/Create/Create.js";
// import Favorites from "./componets/Favorites/Favorites.js";
// import "./App.css";

// function App() {
//   return (
//     <div className="App">
//       <NavBar />
//       <Switch>
//         <Route exact path="/favorites">
//           <Favorites />
//         </Route>
//         <Route exact path="/recipes">
//           <h3>HOLA YA ESTOY MACHANDO </h3>
//         </Route>
//         <Route path="/">
//           <h2>soy el componente</h2>
//         </Route>
//       </Switch>
//     </div>
//   );
// }

// export default App;

// /* <Route path="/" components={NavBar} />
// <Route exact path="/" components={Home} />
// <Route exact path="/recipes" components={Principal} />
// <Route exact path="/recipes/:id" components={Detail} />
// <Route exact path="/recipe" components={Create} />
// <Route exact path="/favorites"  /> */
import React from "react";
import { Route } from "react-router-dom";

import NavBar from "./componets/NavBar/NavBar.js";
import Home from "./componets/Home/Home.js";
import Principal from "./componets/Principal/Principal.js";
import Detail from "./componets/Detail/Detail.js";
import Create from "./componets/Create/Create.js";
import Favorites from "./componets/Favorites/Favorites.js";
import "./App.css";

function App() {
  return (
    <div>
      <Route path="/" component={NavBar} />
      <Route exact path="/" component={Home} />
      <Route exact path="/recipes" component={Principal} />
      <Route exact path="/recipes/:id" component={Detail} />
      <Route exact path="/recipe" component={Create} />
      <Route exact path="/favorites" component={Favorites} />
    </div>
  );
}

export default App;
