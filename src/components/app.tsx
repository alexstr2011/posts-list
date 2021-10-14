import React from 'react';
import Table from "./table";
import {Redirect, Route, Switch} from "react-router-dom";
import PostForm from "./post-form";
import PageNotFound from "../pages/page-not-found";

function App() {
    return (
        <Switch>
            <Route path='/' exact>
                <Redirect to='/posts'/>
            </Route>
            <Route path='/posts' exact>
                <Table/>
            </Route>
            <Route path='/posts/:id' exact>
                <PostForm/>
            </Route>
            <Route>
                <PageNotFound/>
            </Route>
        </Switch>
    );
}

export default App;
