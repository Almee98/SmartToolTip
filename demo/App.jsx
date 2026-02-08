import React, { useState } from 'react';
import Responsitip from '../src/Responsitip';

function App() {
  const [screenWidth, setScreenWidth] = useState(window.innerWidth);
  const isDesktop = screenWidth >= 900;

  React.useEffect(() => {
    const handleResize = () => {
      setScreenWidth(window.innerWidth);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-12">
          <h1 className="mb-4">Responsitip Demo</h1>
          <div className="alert alert-info">
            <strong>Current screen width:</strong> {screenWidth}px
            <br />
            <strong>Mode:</strong> {isDesktop ? 'Desktop (≥900px)' : 'Mobile (<900px)'}
            <br />
            <small>Resize your browser window to see behavior change at 900px breakpoint</small>
          </div>
        </div>
      </div>

      <div className="row mt-4">
        <div className="col-12 col-md-6 mb-4">
          <h3>Trigger Type: "hover"</h3>
          <p>Desktop: Hover to show | Mobile: No tooltip</p>
          <Responsitip title="This is a hover tooltip" triggerType="hover" placement="top">
            <button className="btn btn-primary">Hover me (desktop only)</button>
          </Responsitip>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <h3>Trigger Type: "click"</h3>
          <p>Desktop: No tooltip | Mobile: Click to show</p>
          <Responsitip title="This is a click tooltip" triggerType="click" placement="top">
            <button className="btn btn-success">Click me (mobile only)</button>
          </Responsitip>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <h3>Trigger Type: "both"</h3>
          <p>Desktop: Hover to show | Mobile: Click to show</p>
          <Responsitip title="This tooltip works on both desktop and mobile!" triggerType="both" placement="bottom">
            <button className="btn btn-warning">Hover or Click me</button>
          </Responsitip>
        </div>

        <div className="col-12 col-md-6 mb-4">
          <h3>Different Placements</h3>
          <div className="d-flex flex-column gap-2">
            <Responsitip title="Top tooltip" triggerType="both" placement="top">
              <button className="btn btn-outline-primary">Top</button>
            </Responsitip>
            <Responsitip title="Right tooltip" triggerType="both" placement="right">
              <button className="btn btn-outline-primary">Right</button>
            </Responsitip>
            <Responsitip title="Bottom tooltip" triggerType="both" placement="bottom">
              <button className="btn btn-outline-primary">Bottom</button>
            </Responsitip>
            <Responsitip title="Left tooltip" triggerType="both" placement="left">
              <button className="btn btn-outline-primary">Left</button>
            </Responsitip>
          </div>
        </div>

        <div className="col-12 mb-4">
          <h3>With Custom Content</h3>
          <Responsitip 
            title={
              <div>
                <strong>Rich Content Tooltip</strong>
                <br />
                <small>You can use any React node as the title!</small>
              </div>
            } 
            triggerType="both" 
            placement="top"
          >
            <button className="btn btn-info">Hover/Click for rich content</button>
          </Responsitip>
        </div>

        <div className="col-12 mb-4">
          <h3>Testing Multiple Tooltips</h3>
          <p>On mobile, clicking one tooltip should close others</p>
          <div className="d-flex gap-2 flex-wrap">
            <Responsitip title="Tooltip 1" triggerType="both" placement="top">
              <button className="btn btn-secondary">Tooltip 1</button>
            </Responsitip>
            <Responsitip title="Tooltip 2" triggerType="both" placement="top">
              <button className="btn btn-secondary">Tooltip 2</button>
            </Responsitip>
            <Responsitip title="Tooltip 3" triggerType="both" placement="top">
              <button className="btn btn-secondary">Tooltip 3</button>
            </Responsitip>
          </div>
        </div>
      </div>

      <div className="row mt-5">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>Instructions</h4>
            </div>
            <div className="card-body">
              <ul>
                <li><strong>Desktop (≥900px):</strong> Tooltips with &quot;hover&quot; or &quot;both&quot; trigger types will show on hover</li>
                <li><strong>Mobile (&lt;900px):</strong> Tooltips with &quot;click&quot; or &quot;both&quot; trigger types will show on click</li>
                <li>On mobile, clicking outside a tooltip will close it</li>
                <li>On mobile, opening one tooltip will automatically close any other open tooltip</li>
                <li>Resize your browser window to see the behavior change at the 900px breakpoint</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
