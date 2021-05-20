import isString from 'lodash/isString';
import EmptyArray from '@dbux/common/src/util/EmptyArray';
import { getPresentableString } from '../helpers/pathHelpers';
import ParseRegistry from './ParseRegistry';
import { getChildPaths, getNodeOfPath } from './parseUtil';
import ParsePhase from './ParsePhase';
import { Logger } from '@dbux/common/src/log/logger';

/** @typedef { import("@babel/traverse").NodePath } NodePath */
/** @typedef { import("./ParseStack").default } ParseStack */
/** @typedef { import("@dbux/common/src/log/logger").Logger } Logger */

const PhaseMethodNames = ParsePhase.names.map(name => name.toLowerCase());

export default class ParseNode {
  /**
   * @type {number}
   */
  phase = ParsePhase.Init;

  /**
   * @type {NodePath}
   */
  enterPath;
  state;

  /**
   * @type {ParseStack}
   */
  stack;

  /**
   * @type {{ [string]: object }}
   */
  plugins = {};
  pluginPhases = {};

  /**
   * 
   * @param {NodePath} path 
   * @param {ParseStack} stack 
   */
  constructor(path, state, stack, initialData) {
    this.enterPath = path;
    this.state = state;
    this.stack = stack;
    this.data = initialData === true ? {} : initialData;

    this.recordedDepth = stack.recordedDepth;
    this.nodeId = ++stack.lastId;
  }

  // ###########################################################################
  // getters
  // ###########################################################################

  get name() {
    return this.constructor.name;
  }

  /**
   * @type {NodePath}
   */
  get path() {
    return this.enterPath;
  }

  get nodeTypeName() {
    return this.constructor.name;
  }

  // static get prop() {
  //   return 
  // }

  getPlugin(pluginNameOrClazz) {
    const pluginName = isString(pluginNameOrClazz) ? pluginNameOrClazz : pluginNameOrClazz.name;
    return this.plugins[pluginName] || null;
  }

  toString() {
    return `[${this.nodeTypeName}] ${getPresentableString(this.enterPath)}`;
  }

  // ###########################################################################
  // children utilities
  // ###########################################################################

  getChildPaths(addEmpty = false) {
    const { children } = this.constructor;
    if (!children) {
      throw new Error(`Could not getChildPaths - missing \`static children\` in ${this}.`);
    }
    // NOTE: cache _childPaths
    this._childPaths = this._childPaths || getChildPaths(this.path, children, addEmpty);
    return this._childPaths;
  }

  getNodeOfPath = path => {
    return getNodeOfPath(path);
  }

  getChildNodes() {
    // if (this.phase < ParsePhase.Exit) {
    //   throw new Error(`Cannot getChildNodes before Exit or Instrument phases - ${this} (${ParsePhase.nameFromForce(this.phase)})`);
    // }
    // NOTE: cache _childNodes
    this._childNodes = this._childNodes || this.getChildPaths().map(this.getNodeOfPath);
    return this._childNodes;
  }

  // ###########################################################################
  // debugging
  // ###########################################################################

  get Verbose() {
    return this.stack.Verbose;
  }

  debug(...args) {
    return this.stack.debug(' >', ...args);
  }

  warn(...args) {
    return this.stack.warn(' >', ...args);
  }

  get debugTag() {
    return this.toString();
  }

  // ###########################################################################
  // lifecycle methods
  // ###########################################################################

  hasPhase(...phases) {
    return phases.some(p => this[p] || this.pluginPhases[p]);
  }

  init() { }

  enterPlugins() {
    this.pluginPhases.enter?.();
  }

  exitPlugins() {
    this.pluginPhases.exit?.();
  }

  instrumentPlugins() {
    this.pluginPhases.instrument?.();
  }

  instrument2Plugins() {
    this.pluginPhases.instrument2?.();
  }

  // enter() {
  // }

  // exit() {
  // }

  // instrument() {

  // }

  // instrument2() {

  // }

  // ###########################################################################
  // plugins
  // ###########################################################################

  makePluginPhase(phase) {
    this.pluginPhases[phase] = () => {
      for (const name in this.plugins) {
        const plugin = this.plugins[name];
        const f = plugin[phase];
        // this.debug(` [P] ${name}`, !!f);
        if (f) {
          this.debug(`[P] ${name}`);
          f.call(plugin);
        }
      }
    };
  }

  addPlugin(Clazz) {
    const plugin = new Clazz();
    plugin.node = this;
    plugin.init?.();
    this.plugins[Clazz.name] = plugin;
    return plugin;
  }

  initPlugins() {
    // get all plugin names
    const allPluginConfigs = ParseRegistry.getAllPluginConfigsOfNodeClass(this.constructor);

    // add plugins (possibly conditionally)
    for (const pluginCfg of allPluginConfigs.values()) {
      let predicate, name;
      if (Array.isArray(pluginCfg)) {
        [predicate, name] = pluginCfg;
      }
      else {
        name = pluginCfg;
      }

      // this.debug(this.nodeTypeName, `[initPlugins] add`, name, !predicate || predicate());

      if (!predicate || predicate()) {
        // add plugin
        this.addPlugin(ParseRegistry.getPluginClassByName(name));
      }
    }

    // add plugin phases conditionally
    const pluginArray = Object.values(this.plugins);
    for (const phase of PhaseMethodNames) {
      if (pluginArray.some(p => p[phase])) {
        this.makePluginPhase(phase);
      }
    }
    return this.plugins;
  }

  // ###########################################################################
  // static members
  // ###########################################################################

  get children() {
    return this.constructor.children;
  }
  get pluginConfigs() {
    return this.constructor.plugin;
  }

  /**
   * @type {Logger}
   */
  get logger() {
    return this.constructor.logger;
  }

  static children = [];

  /**
   * @returns `false`, `true` or some initial state (which will be stored in `data`)
   */
  static prospectOnEnter(/* path, state */) {
    return true;
  }
}