var React = require('react');

var RepoHeader = React.createClass({
  render: function() {
    return (
      <div className="row info-header">
        <div className="col-sm-6">
          <h1>{this.props.repo.Alias}</h1>
          <p>{this.props.repo.Description}</p>
        </div>
        <div className="col-sm-6 text-right">
          <p><b>UUID:</b> <Link to="dataselection" params={{uuid: this.props.uuid}}>{this.props.uuid}</Link></p>
          <p><b>Created:</b> {dateString(this.props.repo.Created)}</p>
          <p><b>Updated:</b> {dateString(this.props.repo.Updated)}</p>
        </div>
      </div>
    );
  }
});

module.exports = RepoHeader;

var dateString = function (unformatted) {
  var date = new Date(unformatted);
  return date.toString();
}
