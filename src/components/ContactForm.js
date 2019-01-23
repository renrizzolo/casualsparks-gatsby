import React from 'react';
import { Link } from 'gatsby';

function encode(data) {
  return Object.keys(data)
    .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
    };
  }

  handleChange = e => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = e => {
    e.preventDefault();
    const form = e.target;
    if (!this.state.name || !this.state.email || !this.state.message) {
      return;
    }
    fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        "form-name": form.getAttribute('name'),
        ...this.state
      })
    })
      .then(() => {
        this.setState({
          email: "",
          name: "",
          message: "",
        }) 
      })
      .catch(error => alert(error));
  };

  render() {
    return (
      <div>
        <form
          name="contact"
          method="post"
          data-netlify="true"
          data-netlify-honeypot="wtp"
          onSubmit={this.handleSubmit}
        >
          {/* The `form-name` hidden field is required to support form submissions without JavaScript */}
          <input type="hidden" name="form-name" value="contact" />
          <p hidden>
            <label>
              Don’t fill this out:{" "}
              <input name="wtp" onChange={this.handleChange} />
            </label>
          </p>
          <p className="flex-container flex-container__row">
            <label for="name" style={{ marginRight: 10 }} className="flex-1">
              Name:<br />
              <input id="name" type="text" name="name" value={this.state.name} onChange={this.handleChange} />
            </label>
            <label for="email" className="flex-1">
              Email:  
              <input id="email" type="email" name="email" value={this.state.email} onChange={this.handleChange} />
            </label>
          </p>
          <p>
            <label for="message">
              Message:<br />
              <textarea id="message" name="message" value={this.state.message} onChange={this.handleChange} />
            </label>
          </p>
          <p>
            <button type="submit">Send</button>
          </p>
        </form>
      </div>
    );
  }
}