import React, { Component } from "react";
import axios from "axios";
// import history from "../../../history";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { ValidatorForm } from "react-material-ui-form-validator";
import validate from "./validate";

const theme = createMuiTheme({
  typography: {
    useNextVariants: true
  }
});

// This VisitorModal is NOT done with Redux (just like Login.js, its completely done with plain React instead of getting the states from Reducers)
class VisitorModal extends Component {
  state = {
    open: false,
    company_email: "",
    open2: false,
    otpReceivedByVisitor: ""
  };

  handleToggle = () => {
    this.setState({
      open: !this.state.open
    });
  };

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  // this function will both close the modal on clicking the "View or Download" button and also post Visitor data to backend API and update mongodb record for that document model
  // In the below handleViewSubmit function - within setState, if I put < open: false >  then the OTPModal.js modal in not opening
  handleViewSubmit = event => {
    event.preventDefault();
    const { company_email } = this.state;
    this.setState({
      clicked: true,
      open: false,
      open2: true
    });

    axios
      .post("/api/document/sendotptovisitor", {
        company_email
      })
      .then(() => {
        if (!this.state.company_email) {
          alert("Please fill-in the email field");
        } else if (
          this.state.company_email &&
          !validate(this.state.company_email)
        ) {
        }
      })
      .catch(error => {
        alert("Something went went wrong in updating visitor data");
      });
  };

  handleCancel = () => {
    this.setState({ open: false });
  };

  // ****** functions for the second modal ****

  handleToggle2 = () => {
    this.setState({
      open2: !this.state.open2
    });
  };

  handleClickOpen2 = () => {
    this.setState({ open2: true });
  };

  // this function will both close the modal on clicking the "View or Download" button and also post Visitor data to backend API and update mongodb record for that document model
  handleOTPSubmit = (filelink, event) => {
    event.preventDefault();
    const { company_email, otpReceivedByVisitor } = this.state;
    this.setState({
      open2: false
    });
    axios
      .put(`/api/document/visitor/${this.props.documentURL_Id}`, {
        company_email,
        otpReceivedByVisitor
      })
      .then(response => {
        // console.log("Full Backend response is ", response);
        if (!this.state.otpReceivedByVisitor) {
          alert("Please input the unique code sent to your email");
        } else {
          window.open(`${filelink}`, "_blank");
        }
      })
      .catch(error => {
        // console.log("Backend full error response is ", error.response);
        if (error.response.data.msg === "Incorrect Code was input") {
          alert(
            "The unique code you submitted was incorrect, please check your email again and input the correct code"
          );
        } else {
          alert("Something went went wrong in updating visitor data");
        }
      });
  };

  handleCancel2 = () => {
    this.setState({ open2: false });
  };

  // BELOW COMMENTED OUT CODE IS FOR THE CASE WHEN I SHALL UPLOAD TO DISK-STORAGE RATHER THAN TO AWS-S3
  //   importAll = result => {
  //     let images = {};
  //     result.keys().map((item, index) => {
  //       return (images[item.replace("./", "")] = result(item));
  //     });
  //     return images;
  //   };

  // Because I did not render this modal with a React-Router <Link> hence I will NOT have direct access to this.props.match.params. Thats why I have passed current document's object_id as a prop.
  //   componentDidMount() {
  //     axios.get(`/api/document/${this.props.documentURL_Id}`).then(res => {
  //       this.setState({ document: res.data });
  //     });
  //   }

  render() {
    const { company_email } = this.state;
    const { linkForRender, required } = this.props;

    // BELOW COMMENTED OUT CODE IS FOR THE CASE WHEN I SHALL UPLOAD TO DISK-STORAGE RATHER THAN TO AWS-S3
    // const webpackContext = require.context(
    //     "../../../../uploads/uploadedDocx",
    //     false,
    //     /\.(png|jpe?g|svg|pdf|doc|odt)$/
    //   );
    //   const images = this.importAll(webpackContext);

    return (
      <div>
        <MuiThemeProvider theme={theme}>
          <Button onClick={this.handleClickOpen}>
            View file (will send OTP to email)
          </Button>
          <Dialog
            open={this.state.open}
            onClose={this.handleToggle}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Required Information
            </DialogTitle>
            <DialogContent required>
              <DialogContentText>
                Please enter these info to download the file
              </DialogContentText>
              <TextField
                required
                autoFocus
                margin="dense"
                value={company_email}
                onChange={e =>
                  this.setState({
                    company_email: e.target.value
                  })
                }
                error={company_email === ""}
                helperText={company_email === "" ? "Empty field!" : " "}
                label="Comapny Email"
                type="email"
                fullWidth
              />
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleCancel}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleViewSubmit}
                color="primary"
                variant="contained"
              >
                Send OTP to Email to view file
              </Button>
            </DialogActions>
          </Dialog>
          <Dialog
            open={this.state.open2}
            onClose={this.handleToggle2}
            aria-labelledby="form-dialog-title"
          >
            <DialogTitle id="form-dialog-title">
              Paste Code from Email
            </DialogTitle>
            <DialogContent required>
              <DialogContentText>
                A code was sent to your email, pleas put that back in the below
                box
              </DialogContentText>

              <ValidatorForm ref="form">
                <TextField
                  required
                  autoFocus
                  margin="dense"
                  value={this.state.otpReceivedByVisitor}
                  onChange={e =>
                    this.setState({
                      otpReceivedByVisitor: e.target.value
                    })
                  }
                  error={this.state.otpReceivedByVisitor === ""}
                  helperText={
                    this.state.otpReceivedByVisitor === ""
                      ? "Empty field!"
                      : " "
                  }
                  label="OTP Received in your Email"
                  type="text"
                  fullWidth
                />
              </ValidatorForm>
            </DialogContent>
            <DialogActions>
              <Button
                onClick={this.handleCancel2}
                color="secondary"
                variant="contained"
              >
                Cancel
              </Button>
              <Button
                onClick={this.handleOTPSubmit.bind(
                  this,
                  this.props.linkForRender
                )}
                color="primary"
                variant="contained"
              >
                Verify OTP to open File Link
              </Button>
            </DialogActions>
          </Dialog>
        </MuiThemeProvider>
      </div>
    );
  }
}

export default VisitorModal;
