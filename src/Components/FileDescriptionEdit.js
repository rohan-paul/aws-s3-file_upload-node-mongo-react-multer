import React, { Component } from "react";
import axios from "axios";

import { Card, CardHeader, CardText, CardBody, Row, Col } from "reactstrap";

class FileDescriptionEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      document: {}
    };
  }

  onChange = e => {
    const state = this.state.document;
    state[e.target.name] = e.target.value;
    this.setState({
      document: state
    });
  };

  onSubmit = event => {
    event.preventDefault();

    const description = this.state.document.description;

    axios
      .put("/api/document/edit/" + this.props.match.params.id, description)
      .then(() => {
        this.props.history.push("/");
      })
      .catch(error => {
        alert("Oops some error happened, please try again");
      });
  };

  // When this DocumentEdit component mounts I want the existing 'description' to be fetched.
  componentDidMount() {
    axios.get("/api/document/" + this.props.match.params.id).then(res => {
      this.setState({ document: res.data });
    });
  }

  render() {
    const { description } = this.state;

    return (
      <div>
        <Row>
          <Col xs="4">
            <Card>
              <CardHeader className="p-2 mb-2 bg-primary text-white">
                Edit the description field of this document
              </CardHeader>
              <CardBody>
                <CardText>
                  <form onSubmit={this.onSubmit}>
                    <div className="form-group">
                      <label htmlFor="description">Edit Description:</label>
                      <input
                        type="text"
                        value={description}
                        class="form-control"
                        name="description"
                        onChange={this.onChange}
                        placeholder=" Enter the new Description"
                      />
                    </div>
                    <button type="submit" class="btn btn-primary">
                      Submit the updated Description
                    </button>
                  </form>
                </CardText>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileDescriptionEdit;
