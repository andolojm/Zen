var Header = React.createClass({
  render: function(){
    return (<nav className="navbar navbar-default">
      <div className="container-fluid">
        <div className="navbar-header">
          <button type="button" className="navbar-toggle collapsed" data-toggle="collapse"
                  data-target="#bs-example-navbar-collapse-1" aria-expanded="false">
          <span className="sr-only">Toggle navigation</span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
            <span className="icon-bar"></span>
          </button>
          <a className="navbar-brand" href="#">
            Zen
          </a>
        </div>

        <div className="collapse navbar-collapse" id="bs-example-navbar-collapse-1">
          <ul className="nav navbar-nav navbar-right">
            <li><a href="#">Link</a></li>
          </ul>
        </div>
      </div>
    </nav>);
  }
});

var ChartItem = React.createClass({
  render: function(){
    return (
      <div className="chart-item">
        {`${this.props.data.name} (${this.props.data.trophies} trophies) has ` +
        `${this.props.data.donations} donations and ${this.props.data.donationsReceived} requests this season`}
      </div>
    );
  }
});

var SortButton = React.createClass({
  render: function(){
    var parent = this;
    var classes = "btn btn-default " + (this.props.active ? 'active' : '');
    return (
      <button onClick={function(){parent.props.callback(parent.props.dataField);}}
              className={classes}>{this.props.name}</button>
    );
  }
});

var SortButtons = React.createClass({
  getInitialState: function() {
    return {
      buttons: [
        {name: 'Trophies', dataField: 'trophies'},
        {name: 'Donations', dataField: 'donations'},
        {name: 'Requests', dataField: 'donationsReceived'}
      ]
    };
  },
  render: function(){
    var parent = this;
    var buttons = this.state.buttons.map(function(buttonData){
      var isActive = (parent.props.sortingBy == buttonData.dataField);
      return (
        <SortButton active={isActive} name={buttonData.name} dataField={buttonData.dataField} callback={parent.props.callback} />
      );
    });
    return (
      <div>
        <div>Click a button to sort by that field. Clicking the active field will invert the results.</div>
        {buttons}
      </div>
    );
  }
});

var Chart = React.createClass({
  handleSort: function(sortMetric){
    this.props.handleSort(sortMetric);
  },
  render: function(){
    var elements = this.props.items.map(function(player){
      return (
        <ChartItem key={player.tag} data={player} />
      );
    });

    return (
      <div>
        <SortButtons sortingBy={this.props.sortingBy} callback={this.handleSort} />
        <div id="items">
          {elements}
        </div>
      </div>
    );
  }
});

var Page = React.createClass({
  getInitialState: function() {
    return {
      items: [],
      sortingBy: 'trophies',
      inverted: false
    };
  },
  handleSort: function(sortMetric) {
    var lastSortedBy = this.state.sortingBy;
    this.setState({sortingBy: sortMetric});

    // If we're sorting by the same thing as last time, and we aren't already inverted, invert results
    var doInvert = (lastSortedBy == sortMetric) && !this.state.inverted;

    // If we're inverting this time, don't invert next time
    if(doInvert) {
      this.setState({inverted: true});
    } else {
      this.setState({inverted: false});
    }

    // Sort by requested metric, inverting if requested to do so
    this.setState({
      items: this.state.items.sort(function(a,b){
        var keyA = a[sortMetric];
        var keyB = b[sortMetric];
        if(keyA < keyB) return (doInvert ? -1 : 1);
        if(keyA > keyB) return (doInvert ? 1 : -1);
        return 0;
      })
    });

  },
  componentDidMount: function() {
    $.ajax({
      url: this.props.url,
      dataType: 'json',
      cache: false,
      success: function(data) {
        this.setState({items: data.items});
      }.bind(this),
      error: function(xhr, status, err) {
        console.error(this.props.url, status, err.toString());
      }.bind(this)
    });
  },
  render: function(){
    return (
      <div>
        <Header />
        <Chart items={this.state.items} sortingBy={this.state.sortingBy} handleSort={this.handleSort} />
      </div>
    );
  }
});

ReactDOM.render(
  <Page url="/current" />,
  document.getElementById('container')
);