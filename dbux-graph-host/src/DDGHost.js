import DDGDocument from './ddg/DDGDocument';
import DDGComponents from './ddg/_hostRegistry';
import HostWrapper from './HostWrapper';

export default class DDGHost extends HostWrapper {
  constructor() {
    super('Data Dependency Graph', DDGComponents, DDGDocument);
  }
}
