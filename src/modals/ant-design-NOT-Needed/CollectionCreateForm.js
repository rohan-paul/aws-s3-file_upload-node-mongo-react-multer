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
    renderFile = doxLink => {
      this.props.letUserViewFile();
      //   history.push(`/static/media/${this.props.documentLink}`);
      history.push(doxLink);
      window.location.reload();
    };

    render() {
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
          onOk={this.renderFile.bind(this, this.props.documentLink)}
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
