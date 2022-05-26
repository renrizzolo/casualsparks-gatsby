import React from "react";

function encode(data) {
  return Object.keys(data)
    .map((key) => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
    .join("&");
}

export default class Contact extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      name: "",
      email: "",
      message: "",
      success: false,
      error: false,
    };
  }

  handleChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  handleSubmit = (e) => {
    this.setState({
      success: false,
      error: false,
    });
    const { name, email, message } = this.state;
    e.preventDefault();
    const form = e.target;

    if (!name || !email || !message) {
      this.setState({
        error: true,
      });
      return;
    }
    fetch("/", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: encode({
        "form-name": form.getAttribute("name"),
        ...this.state,
      }),
    })
      .then(() => {
        this.setState({
          email: "",
          name: "",
          message: "",
          success: true,
        });
      })
      .catch((error) => alert(error));
  };

  render() {
    const { name, email, message, error, success } = this.state;
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
              Name:
              <br />
              <input
                id="name"
                type="text"
                name="name"
                value={name}
                onChange={this.handleChange}
              />
            </label>
            <label for="email" className="flex-1">
              Email:
              <input
                id="email"
                type="email"
                name="email"
                value={email}
                onChange={this.handleChange}
              />
            </label>
          </p>
          <p>
            <label for="message">
              Message:
              <br />
              <textarea
                id="message"
                name="message"
                value={message}
                onChange={this.handleChange}
              />
            </label>
          </p>
          <p>
            <button type="submit" className="button light-blue">
              Send
            </button>
          </p>
          {error && (
            <div className="error notice">Please fill in all the fields.</div>
          )}
          {success && <div className="notice">Message sent successfully!</div>}
        </form>
      </div>
    );
  }
}
