var React = require('react'),
  config = require('../common/config');

var DataInstances = React.createClass({
  render: function() {
    var rows = [];

    if (this.props && this.props.instances) {
      var instances = this.props.instances;
      for (var key in instances) {
        if (instances.hasOwnProperty(key)) {
          var instance = instances[key];
          rows.push(<DataInstance key={key} uuid={this.props.uuid} name={instance.Base.Name} type={instance.Base.TypeName} versioned={instance.Base.Versioned}/>);
        }
      }
    }

    return (
      <table className="datainstances">
        <thead>
          <tr>
            <th>Data Instance</th>
            <th>Type</th>
            <th>Versioned</th>
            <th>Tile Source</th>
            <th>Label Source</th>
          </tr>
        </thead>
        <tbody>
          {rows}
        </tbody>
      </table>
    );
  }
});

var DataInstance = React.createClass({
  render: function () {
    var url = config.datatypeInfoUrl(this.props.uuid, this.props.name);

    var tile_input = '';
    var label_input = '';

    if (this.props.type === 'grayscale8' || this.props.type === 'multiscale2d' ) {
      tile_input = <TileInput/>;
    }

    if (this.props.type === 'labels64' ) {
      label_input = <LabelInput/>;
    }

    return (
      <tr>
        <td><a href={url}>{this.props.name}</a></td>
        <td><span className="label label-danger">{this.props.type}</span></td>
        <td><span className="label label-success">{this.props.versioned ? 'versioned' : 'unversioned'}</span></td>
        <td>{tile_input}</td>
        <td>{label_input}</td>
      </tr>
    );
  }
});

var LabelInput = React.createClass({
  render: function () {
    return (
      <input type="radio" name="label_source"></input>
    );
  }
});

var TileInput = React.createClass({
  render: function () {
    return (
      <input type="radio" name="tile_source"></input>
    );
  }
});

module.exports = DataInstances;
