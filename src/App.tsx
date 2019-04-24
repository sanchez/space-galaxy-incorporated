import React, { FunctionComponent } from "react";
import Three from "./three/Three";

export interface IAppProps {
}

const App: FunctionComponent<IAppProps> = props => {
    return <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",
        alignContent: "flex-start",
        justifyContent: "flex-start",
        height: "100vh",
        width: "100vw",
        overflow: "hidden",
    }}>
        <Three />
    </div>
}

export default App;