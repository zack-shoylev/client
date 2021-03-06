// Modified from Kitematic by Ash Wilson

import React from 'react/addons';
import Router from 'react-router';
import SetupStore from '../stores/SetupStore';
import RetinaImage from 'react-retina-image';
import Util from '../utils/Util';

var Setup = React.createClass({
  mixins: [ Router.Navigation ],
  getInitialState: function () {
    return {
      progress: 0,
      name: '',
    };
  },
  componentWillMount: function () {
    SetupStore.on(SetupStore.PROGRESS_EVENT, this.update);
    SetupStore.on(SetupStore.STEP_EVENT, this.update);
    SetupStore.on(SetupStore.ERROR_EVENT, this.update);
  },
  componentDidMount: function () {
    this.update();
  },
  componentDidUnmount: function () {
    SetupStore.removeListener(SetupStore.PROGRESS_EVENT, this.update);
    SetupStore.removeListener(SetupStore.STEP_EVENT, this.update);
    SetupStore.removeListener(SetupStore.ERROR_EVENT, this.update);
  },
  handleCancelRetry: function () {
    SetupStore.retry();
  },
  handleErrorRetry: function () {
    SetupStore.retry(false);
  },
  handleErrorRemoveRetry: function () {
    SetupStore.retry(true);
  },
  handleOpenWebsite: function () {
    Util.exec(['open', 'https://www.virtualbox.org/wiki/Downloads']);
  },
  update: function () {
    this.setState({
      progress: SetupStore.percent(),
      step: SetupStore.step(),
      error: SetupStore.error(),
      cancelled: SetupStore.cancelled()
    });
  },
  renderProgress: function () {
    let progressStyle = {
      width: this.state.progress + "%"
    };

    return (
      <div className="setup-progress">
        <div className="completed" style={progressStyle}/>
      </div>
    );
  },
  renderStep: function () {
    return (
      <div className="setup">
        <div className="setup-content container">
          <div className="desc">
            <div className="content">
              <h4>Step {SetupStore.number()} out of {SetupStore.stepCount()}</h4>
              <h1>{SetupStore.step().title}</h1>
              <p>{SetupStore.step().message}</p>
            </div>
          </div>
          {this.renderProgress()}
        </div>
      </div>
    );
  },
  renderCancelled: function () {
    return (
      <div className="setup">
        <div className="setup-content container">
          {this.renderProgress()}
          <div className="desc">
            <div className="content">
              <h4>Setup Cancelled</h4>
              <h1>Couldn&#39;t Install Requirements</h1>
              <p>Deconst didn&#39;t receive the administrative privileges required to install or upgrade VirtualBox &amp; Docker.</p>
              <p>Please click retry. If VirtualBox is not installed, you can download &amp; install it manually from the <a onClick={this.handleOpenWebsite}>official Oracle website</a>.</p>
              <p><button className="btn btn-action" onClick={this.handleCancelRetry}>Retry</button></p>
            </div>
          </div>
        </div>
      </div>
    );
  },
  renderError: function () {
    return (
      <div className="setup">
        <div className="setup-content container">
          <div className="desc">
            <div className="content">
              <h4>Setup Error</h4>
              <h1>We&#39;re Sorry!</h1>
              <p>There seems to have been an unexpected error with Deconst:</p>
              <p className="error">{this.state.error.message || this.state.error}</p>
              <p className="setup-actions">
                <button className="btn btn-action" onClick={this.handleErrorRetry}>Retry Setup</button>
                <button className="btn btn-action" onClick={this.handleErrorRemoveRetry}>Delete VM and Retry Setup</button>
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  },
  render: function () {
    if (this.state.cancelled) {
      return this.renderCancelled();
    } else if (this.state.error) {
      return this.renderError();
    } else if (SetupStore.step()) {
      return this.renderStep();
    } else {
      return false;
    }
  }
});

module.exports = Setup;
