
var React = require('react')
var Router= require('react-router')
var Link = Router.Link

var Header = React.createClass({
  render: function() {
    return (
      <header>
        <h1 >{this.props.title}</h1>
        <div className=" ">
          <Link to="/" className="button button-transparent">Index</Link>
          <Link to="/about/" className="button button-transparent">About</Link>
        </div>
      </header>
    )
  }
})

module.exports = Header

