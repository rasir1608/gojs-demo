import 'static/lib/go-debug';

const go = window.go;
const $ = go.GraphObject.make;
const stateColors = {
  INIT: '#2FC7CA',
  WAIT: '#eab537',
  READY: '#7266ba',
  QUEUE: '#ff7e00',
  EXEC: '#25beb1',
  SUCCESS: '#27c24c',
  FAILED: '#f05050',
  KILLED: '#ead737',
  DEFAULT: '#dcdcdc',
};
function getJobTypeImage(taskType) {
  return taskType ? `static/image/icon-${taskType.toLowerCase()}.png` : '';
}
function getBgColor(state) {
  return stateColors[state] || stateColors.DEFAULT;
}
const diagram = [go.Diagram, 'my-diagram', {
  initialContentAlignment: go.Spot.Center, // center the content
  'undoManager.isEnabled': true, // enable undo & redo
  //  mouseOver: doMouseOver,  // this event handler is defined below
  //  click: doMouseOver  // this event handler is defined below
}];
const overview = [go.Overview, 'my-overview'];
const nodeTemplate = {
  name: 'nodeTemplate',
  style: { cursor: 'pointer', type: go.Panel.Auto },
  part2: {
    name: 'panel',
    style: { type: go.Panel.Horizontal },
    part1: {
      name: 'picture',
      style: {
        name: 'Picture',
        desiredSize: new go.Size(20, 20),
        margin: new go.Margin(5),
      },
      date: new go.Binding('source', 'taskType', getJobTypeImage),
    },
    part2: {
      name: 'textBlock',
      style: { margin: new go.Margin(5, 10, 0, 0), stroke: '#fff', font: '16px bold', textAlign: 'start' },
      date: new go.Binding('text', 'id'),
    },
  },
  part1: {
    name: 'shape',
    style: { name: 'SHAPE', figure: 'RoundedRectangle', stroke: null },
    date: new go.Binding('fill', 'state', getBgColor),
  },
};
const layout = [go.LayeredDigraphLayout, {
  direction: 90,
  layeringOption: go.LayeredDigraphLayout.LayerLongestPathSource,
  layerSpacing: 80,
}];

export default {
  config: {},
  diagram: '',
  nodeTemplate: '',
  layout: '',
  model: '',
  overview: '',
  lastStroked: null,
  startGojs(nodeDate, linkDate) {
    const self = this;
    const pluginsObj = this.config || {};
    if (pluginsObj.nodeMouseOverCb) {
      nodeTemplate.style.mouseOver = (e) => {
        if (e === undefined) e = self.diagram.lastInput;
          const doc = e.documentPoint;
          // find all Nodes that are within 100 units
          const part = self.diagram.findObjectAt(doc, x => x.part, null);
          const mousePos = {
            x: e.event.clientX,
            y: e.event.clientY,
          };
        self.showJobDetail(part, mousePos, pluginsObj.nodeMouseOverCb);
      };
    }
    if (pluginsObj.nodeMouseLeave) {
      nodeTemplate.style.mouseLeave = () => {
        if (self.lastStroked !== null) self.lastStroked.stroke = null;
          self.lastStroked = null;
          pluginsObj.nodeMouseLeave();
        };
      }
    if (pluginsObj.nodeContextMenu) {
      nodeTemplate.style.contextMenu = $(go.HTMLInfo, {
        mainElement: pluginsObj.nodeContextMenu,
        show: (obj, mydiagram) => {
          pluginsObj.nodeContextMenu.style.display = 'block';
          const e = mydiagram.lastInput;
          const event = e.event;
          pluginsObj.nodeContextMenu.style.left = `${event.clientX + 10}px`;
          pluginsObj.nodeContextMenu.style.top = `${event.clientY + 10}px`;
        },
        hide: () => {
          pluginsObj.nodeContextMenu.style.display = 'none';
        },
      });
    }
    this.diagram = $(...diagram);
    if (pluginsObj.modified) {
      this.diagram.addDiagramListener('Modified', () => {
        pluginsObj.modified(self.diagram);
      });
    }
    this.layout = $(...layout);
    this.nodeTemplate = this.getNodeTemplate();
    this.model = new go.GraphLinksModel(nodeDate, linkDate);
    this.diagram.layout = this.layout;
    this.diagram.nodeTemplate = this.nodeTemplate;
    this.diagram.model = this.model;
    if (pluginsObj.overview) this.overview = this.getOverview();
    return this.diagram;
  },
  showJobDetail(part, mousePos, cb) {
    if (part !== null) {
        const job = part.data;
        const shape = part.findObject('SHAPE');
        shape.stroke = '#000';
        if (this.lastStroked !== null && this.lastStroked !== shape) this.lastStroked.stroke = null;
        this.lastStroked = shape;
        cb(mousePos, job);
    }
  },
  getOverview() {
    return $(...overview, { observed: this.diagram, contentAlignment: go.Spot.Center });
  },
  getNodeTemplate() {
    return this.getGraphObject(nodeTemplate);
  },
  getGraphObject(date) {
    const params = [];
    switch (date.name) {
      case 'nodeTemplate':
        params.push(go.Node);
        if (date.style) params.push(date.style);
        if (date.part1) params.push(this.getGraphObject(date.part1));
        if (date.part2) params.push(this.getGraphObject(date.part2));
        break;
      case 'panel':
        params.push(go.Panel);
        if (date.style) params.push(date.style);
        if (date.part1) params.push(this.getGraphObject(date.part1));
        if (date.part2) params.push(this.getGraphObject(date.part2));
        break;
      case 'shape':
        params.push(go.Shape);
        if (date.style) params.push(date.style);
        if (date.date) params.push(date.date);
        break;
      case 'picture':
        params.push(go.Picture);
        if (date.style) params.push(date.style);
        if (date.date) params.push(date.date);
        break;
      case 'textBlock':
        params.push(go.TextBlock);
        if (date.style) params.push(date.style);
        if (date.date) params.push(date.date);
        break;
      default :
        break;
    }
    return $(...params);
  },
};
