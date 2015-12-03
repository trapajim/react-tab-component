'use strict';

var React = require('react');
var classNames = require('classnames');

var Tabs = React.createClass({
	propTypes: {
		className: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.string,
    ]),
		activeTab: React.PropTypes.number,
		onMount: React.PropTypes.func,
		onBeforeChange: React.PropTypes.func,
    onAfterChange: React.PropTypes.func,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]).isRequired
	},
	getDefaultProps(){
    return {activeTab: 1};
  },
  getInitialState(){
  	return { activeTab: this.state.activeTab};
  },
  componentDidMount(){
  	if(this.props.onMount){
  		this.onMount().apply(null, this.getCallBackParameter());
  	}
  },
  componentWillReceiveProps(newProps){
  	if(newProps.activeTab && newProps.activeTab !== this.props.activeTab){
      this.setState({activeTab: newProps.activeTab});
    }
  },
  render(){
  	var tabContainerClass = classNames('tabs-container',this.props.className)
  	return(
  		<div className={tabContainerClass}>
  		</div>
  	)
  },
  getCallBackParameter(){
  	//index, selected panel, selected menu
  	return [ this.state.activeTab, this.refs.tab-panel, this.refs.tab-menu-${this.state.activeTab];
  }
});