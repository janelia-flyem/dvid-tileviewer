var React       = require('react'),
  Router        = require('react-router'),
  DataInstances = require('./DataInstances.react'),
  RepoHeader    = require('./RepoHeader.react'),
  Messages      = require('./Messages.react'),
  routes        = require('../common/routes');

var DataSelection = React.createClass({
  mixins: [Router.State, Router.Navigation ],

  getInitialState: function() {
    return {
      uuid: this.getParams().uuid,
      repo: {
        DataInstances: {}
      }
    };
  },

  componentDidMount: function () {
    var self = this;
    this.props.dvid.get(this.state.uuid, 'info', {}, function(result) {
      var repo = result;
      if (self.isMounted()) {
        self.setState({
          repo: repo
        });
      }
    }.bind(this));
  },

  showDataHandler: function(event) {
    var tile_source = null,
      label_source = null;
    // grab tile source selection
    tile_source = $("#data_selection input:radio[name=tile_source]:checked").val();
    // grab label source selection
    label_source = $("#data_selection input:radio[name=label_source]:checked").val();
    // display an error message if either one is missing.
    if(!tile_source || !label_source) {
      this.setState({
        message: {
          text: 'Please select a tile source and a label source from the table below.',
          type: 'danger'
        }
      });
      return;
    }
    // generate a new url with the choices made and ...
    // redirect the browser
    this.transitionTo('tilemap', {
      uuid : this.state.uuid,
      tileSource : tile_source,
      labelSource : label_source
    });
  },

  render: function () {
    return (
      <div>
        <RepoHeader repo={this.state.repo} uuid={this.state.uuid} />
        <Messages message={this.state.message}/>
        <button className="btn btn-default" onClick={this.showDataHandler}>Show Data</button>
        <form id="data_selection">
          <DataInstances instances={this.state.repo.DataInstances} uuid={this.state.uuid}/>
        </form>
      </div>
    );
  }

});



module.exports = DataSelection;
