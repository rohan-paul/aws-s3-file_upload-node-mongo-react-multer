import React, { Component } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

class RenderFile extends Component {
  state = {
    open: false
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = file => {
    // file = this.file;
    this.setState({
      open: false
    });
    window.open(`${file}`, "_blank");
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

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

    const images = this.importAll(webpackContext);
    const { linkForRender } = this.props;

    return (
      <div>
        <Button onClick={this.handleClickOpen}>Click to View File</Button>
        <Dialog
          open={this.state.open}
          onClose={this.handleToggle}
          aria-labelledby="form-dialog-title"
        >
          <DialogTitle id="form-dialog-title">Required Information</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Update these info to download the file
            </DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              id="name"
              label="Email Address"
              type="email"
              fullWidth
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleCancel} color="primary">
              Cancel
            </Button>
            <Button
              onClick={this.handleClose.bind(this, images[`${linkForRender}`])}
              color="primary"
            >
              View or Download File
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

export default RenderFile;

// <Button onClick={this.handleClickOpen}>Click to View File</Button>
