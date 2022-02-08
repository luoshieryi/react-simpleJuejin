import React, {Component, createContext} from 'react';
import {Routes, Route, Link} from "react-router-dom";

import List, {tabsType} from "../List";
import WithParams from "../Atricle";

interface Props {

}

interface State {
    articleListTab: tabsType
}

class App extends Component<Props, State> {

    render() {
        return (
            <div>
                <Routes>
                    <Route path="/" element={<List/>}/>
                    <Route path="/article/:id" element={<WithParams/>}/>
                </Routes>
            </div>
        );
    }
}

export default App;
