import React, { Component } from "react";
import { Row, Col, Card, CardHeader, CardText, CardBody } from "reactstrap";
import { Link } from "react-router-dom";
import axios from "axios";
import "antd/dist/antd.css";
import { Button, Modal, Form, Input, Radio } from "antd";
import CollectionCreateForm from "../modals/CollectionCreateForm";

// to use history.push I need the 'history' library
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

class FileUpload extends Component {
  state = {
    documents: [],
    visible: false
  };

  showModal = () => {
    this.setState({ visible: true });
  };

  handleCancel = () => {
    this.setState({ visible: false });
  };

  saveFormRef = formRef => {
    this.formRef = formRef;
  };

  showFile = () => {
    const form = this.formRef.props.form;
    form.validateFields((err, values) => {
      if (err) {
        return;
      }
      form.resetFields();
      this.setState({
        visible: false
      });
      //   history.push(`${file}`);
      //   window.location.reload();
    });
  };

  deleteDocument = id => {
    axios.delete("/api/document/" + id).then(() => {
      this.setState({
        documents: this.state.documents.filter(document => document._id !== id)
      });
    });
  };

  componentDidMount() {
    axios.get("/api/document").then(res => {
      this.setState({ documents: res.data });
    });
  }

  // importAll() is to leverage webpack's require.context so I can dynamically import all the files in a directory
  // https://webpack.js.org/guides/dependency-management/#require-context
  // The syntax is as follows:
  // require.context(directory, useSubdirectories = false, regExp = /^\.\//);
  // so importAll() takes an object as its argument and returns an object where each key is the full-name of the file (and the "./" part taken-off from it). Like 1541668392919-file.pdf
  importAll = result => {
    let images = {};
    result.keys().map((item, index) => {
      return (images[item.replace("./", "")] = result(item));
    });
    return images;
  };

  render() {
    const webpackContext = require.context(
      "../../uploads",
      false,
      /\.(png|jpe?g|svg|pdf|doc|odt)$/
    );

    /*
    A> In above, I am requiring a context with files from the 'documents' directory that can be required with a request endings with .png .jpeg .svg etc .

    B> And the final returned object ( after searching the directory ) from the require.context is passed as the argument to importAll()

    C> So,console.log(webpackContext.keys()); will print the below

     ["./1541656477973-file.pdf", "./1541671735212-file.jpeg"]

     And all importAll() is doing is replacing the "./" with empty space and returing the 'images' array.
 */

    const images = this.importAll(webpackContext);

    // console.log(images);

    return (
      <div className="bg-success">
        <Col xs="8">
          <Card>
            <CardHeader className="p-2 mb-2 bg-primary text-white" />
            <CardBody>
              <CardText>
                <table className="table table-stripe">
                  <thead>
                    <tr>
                      <th>Document Id</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.documents.map((document, idx) => (
                      <tr>
                        <td>{document.document_id}</td>
                        <td>{document.description}</td>
                        <td>{images[document.path]}</td>
                        <td>
                          <Button type="primary" onClick={this.showModal}>
                            View File
                          </Button>

                          <CollectionCreateForm
                            key={idx}
                            wrappedComponentRef={this.saveFormRef}
                            visible={this.state.visible}
                            onCancel={this.handleCancel}
                            letUserViewFile={this.showFile}
                            documentLink={images[document.path]}
                          />
                        </td>
                        <td>
                          <Link
                            to={`/api/document/edit/${document._id}`}
                            class="btn btn-success"
                          >
                            Edit Description
                          </Link>
                        </td>
                        <td>
                          <button
                            onClick={this.deleteDocument.bind(
                              this,
                              document._id
                            )}
                            className="btn btn-danger"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </CardText>
            </CardBody>
          </Card>
        </Col>

        <Row>
          <Col>
            <div class="float-sm-right m-b-sm">
              <h4>
                <Link
                  to={"/api/document/upload"}
                  className="btn btn-secondary btn-sm active"
                  role="button"
                  aria-pressed="true"
                >
                  Add a New Document
                </Link>
              </h4>
            </div>
          </Col>
        </Row>
      </div>
    );
  }
}

export default FileUpload;

/* Problem is the below withing the map function is printing both the paths and the latest is being passed down to the CollectionCreateForm.js

{console.log(images[document.path])}

*/
