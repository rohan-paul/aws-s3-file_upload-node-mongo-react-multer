import React, { Component } from "react";
import "./App.css";
import FileUpload from "./Components/FileUpload";

class App extends Component {
	render() {
		return (
			<div className="App">
				<FileUpload />
			</div>
		);
	}
}

export default App;
