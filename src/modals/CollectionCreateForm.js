import React, { Component } from "react";
import "antd/dist/antd.css";
import { Button, Modal, Form, Input, Radio } from "antd";
import { withRouter, Route, BrowserRouter, Router } from "react-router-dom";
import history from "../history";
import axios from "axios";

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    state = {
      documents: []
    };
    onClick = e => {
      e.preventDefault();
      console.log(this.props.documentLink);
      this.props.letUserViewFile();
    };

    componentDidMount() {
      axios.get("/api/document").then(res => {
        this.setState({ documents: res.data });
      });
    }

    importAll = result => {
      let images = {};
      result.keys().map((item, index) => {
        return (images[item.replace("./", "")] = result(item));
      });
      return images;
    };

    render() {
      const webpackContext = require.context(
        "../../uploads/",
        false,
        /\.(png|jpe?g|svg|pdf|doc|odt)$/
      );

      const images = this.importAll(webpackContext);

      const {
        visible,
        onCancel,
        letUserViewFile,
        form,
        documentLink
      } = this.props;

      const { getFieldDecorator } = form;

      return (
        <Modal
          visible={visible}
          title="Create a new collection"
          okText="Download Document / Submit for next action"
          onCancel={onCancel}
          onOk={this.onClick}
        >
          <Form layout="vertical">
            <FormItem label="Title">
              {getFieldDecorator("title", {
                rules: [
                  {
                    required: true,
                    message: "Please input the title of collection!"
                  }
                ]
              })(<Input />)}
            </FormItem>
            <FormItem label="Description">
              {getFieldDecorator("description")(<Input type="textarea" />)}
            </FormItem>
            <FormItem className="collection-create-form_last-form-item">
              {getFieldDecorator("modifier", {
                initialValue: "public"
              })(
                <Radio.Group>
                  <Radio value="public">Public</Radio>
                  <Radio value="private">Private</Radio>
                </Radio.Group>
              )}
            </FormItem>
            <a
              href={`http://localhost:3000${this.props.letUserViewFile}`}
              target="_blank"
              onClick={this.onClick}
            >
              Click me
            </a>
            />
          </Form>
        </Modal>
      );
    }
  }
);

// const ShowCollectionCreateForm = withRouter(CollectionCreateForm);

export default CollectionCreateForm;
