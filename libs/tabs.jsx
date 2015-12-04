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
    return { activeTab: this.props.activeTab};
  },
  componentDidMount(){
    if(this.props.onMount){
      this.props.onMount.apply(null, this._getCallbackParameter());
    }
  },
  componentWillReceiveProps(newProps){
    if(newProps.activeTab && newProps.activeTab !== this.props.activeTab){
      this.setState({activeTab: newProps.activeTab});
    }
  },
  render(){
    var tabContainerClass = classNames('tabsSessionStorageHandler.container',this.props.className)
    return(
      <div className={tabContainerClass}>
        {this._getMenu()}
        {this._getSelectedPanel()}
      </div>
    );
  },
  setActive(index, e){
    e.preventDefault();

    var callbackParams = this._getCallbackParameter(index);
    if (this.props.onBeforeChange) {
      var cancel = this.props.onBeforeChange.apply(null,callbackParams)
      if(cancel === false){ return }
    }

    this.setState({ activeTab: index }, () => {
      if (this.props.onAfterChange) {
       this.props.onAfterChange.apply(null,callbackParams)
      }
    });
  },
  _getCallbackParameter(index){
    //index, selected panel, selected menu
    var activeTab = typeof index === "undefined" ? this.state.activeTab : index
    return [ activeTab, this.tabPanel, this['tab_menu_${activeTab}']];
  },
  _getMenu(){
    if (!this.props.children) {
      throw new Error('children not found, please add Tabs.Panel');
    }

    if (!Array.isArray(this.props.children)) {
      this.props.children = [this.props.children];
    }

    var $items = this.props.children
      .map($panel => typeof $panel === 'function' ? $panel() : $panel)
      .filter($panel => $panel)
      .map(($panel, index) => {
        var menuClasses = classNames(
          'tabs_menu_item',
          this.state.activeTab === (index + 1) && 'is_active'
        );
        return (
          <li ref={(ref) => this['tab_menu_${index + 1}'] = ref} key={index} className={menuClasses}>
            <a onClick={this.setActive.bind(this, index + 1)}>
              {$panel.props.title}
            </a>
          </li>
        );
    });
    return (
      <ul className="tab_menu">{$items}</ul>
    );
  },
  _getSelectedPanel () {
    var panelIndex = this.state.activeTab - 1;
    return (
      <div ref={(ref)=>this.tabPanel = ref} className='tab_panel'>
        {this.props.children[panelIndex]}
      </div>
    );
  }
});

// tab panel
Tabs.Panel = React.createClass({
  propTypes: {
    title: React.PropTypes.string.isRequired,
    children: React.PropTypes.oneOfType([
      React.PropTypes.array,
      React.PropTypes.element
    ]).isRequired,
    onPanelMount: React.PropTypes.func
  },
  componentDidMount(){
    if(this.props.onPanelMount){
      this.props.onPanelMount()
    }
  },
  componentWillReceiveProps(newProps){
    if(newProps.onPanelMount){
      newProps.onPanelMount()
    }
  },
  render () {
    return <div>{this.props.children}</div>;
  }
});
module.exports = Tabs;