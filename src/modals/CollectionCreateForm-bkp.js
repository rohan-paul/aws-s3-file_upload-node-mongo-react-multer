import React, { Component } from "react";
import "antd/dist/antd.css";
import { Button, Modal, Form, Input, Radio } from "antd";
// import {
//   Link,
//   withRouter,
//   Route,
//   BrowserRouter,
//   Router
// } from "react-router-dom";

// to use history.push I need the 'history' library
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

const FormItem = Form.Item;

const CollectionCreateForm = Form.create()(
  class extends React.Component {
    state = {
      documents: []
    };

    // onClick = (doxlink, e) => {
    //   doxlink = this.props.documentLink;
    //   e.preventDefault();
    //   console.log(this.props.documentLink);
    //   this.props.letUserViewFile();
    //   history.push(doxlink);
    //   //   history.push(this.props.documentLink);
    //   window.location.reload();
    // };

    // onClick = e => {
    //   const doxlink = this.props.documentLink;
    //   e.preventDefault();
    //   console.log(this.props.documentLink);
    //   this.props.letUserViewFile();

    //   history.push(doxlink);
    //   //   history.push(this.props.documentLink);
    //   window.location.reload();
    // };

    onClick = e => {
      e.preventDefault();
      this.props.letUserViewFile();
      //   this.props.letUserViewFile(this.props.documentLink);
      history.push(this.props.documentLink);
      window.location.reload();
    };

    // importAll = result => {
    //   let images = {};
    //   result.keys().map((item, index) => {
    //     return (images[item.replace("./", "")] = result(item));
    //   });
    //   return images;
    // };

    render() {
      //   const webpackContext = require.context(
      //     "../../uploads/",
      //     false,
      //     /\.(png|jpe?g|svg|pdf|doc|odt)$/
      //   );

      //   const images = this.importAll(webpackContext);

      const doxlink = this.props.documentLink;

      console.log(this.props.documentLink);

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
          </Form>
        </Modal>
      );
    }
  }
);

export default CollectionCreateForm;
