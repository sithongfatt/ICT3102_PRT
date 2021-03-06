/*!

=========================================================
* Paper Dashboard React - v1.1.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)
* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)
* Coded by Creative Tim
=========================================================
* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
*/
import React from "react";

// reactstrap components
import {
  Row,
  Col
} from "reactstrap";
import { Upload } from "../Upload";

class Dashboard extends React.Component {

  constructor(props) {
    super(props);
    this.state = { pictures: [] };
    this.onDrop = this.onDrop.bind(this);
  }

  onDrop(picture) {
    this.setState({
      pictures: this.state.pictures.concat(picture),
    });
  }

  render() {
    return (
      <>
        <div className="content">
          <div className="headingtitle">ICT3102 TEAM06 - OBJECT DETECTION</div>
          <Row>
            <Col md="12">
              <div className="filterTitle">MINIMUM CONFIDENCE LEVEL</div>
              <Upload />
            </Col>
          </Row>
        </div>
      </>
    );
  }
}

export default Dashboard;
