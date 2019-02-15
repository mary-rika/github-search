import React from 'react';
import axios from 'axios';
import { Button, InputGroup, Input, Col } from 'reactstrap';
import PropTypes from 'prop-types';

export default class HomePage extends React.PureComponent {
  state = {
    query: '',
    loading: false,
    results: [],
  };

  handleClick = () => {
    const searchBox = document.querySelector('#searchInput');
    const val = searchBox.value;
    this.setState({
      query: val,
      loading: true,
    });
    this.getInfo(val);
  };

  getInfo = val => {
    axios
      .get(
        `https://api.github.com/search/repositories?q=${val}&sort=full_name&order=asc`,
      )
      .then(resp => {
        this.setState({
          results: resp.data.items,
          loading: false,
        });
      });
  };

  handlePath = repo => {
    this.props.history.push(`repo/${repo.full_name}`);
  };

  render() {
    return (
      <div>
        <div className="d-flex justify-content-center align-items-center pt-5">
          <Col sm={8}>
            <InputGroup>
              <Input
                id="searchInput"
                defaultValue={this.state.query}
                placeholder="Type Repository Name ..."
              />
              <Button
                color="info"
                disabled={this.state.loading}
                onClick={e => this.handleClick(e)}
              >
                Search
              </Button>
            </InputGroup>
          </Col>
        </div>
        <div className="d-flex justify-content-center align-items-center pt-5">
          <Col sm={8}>
            {this.state.loading && <div className="loading">Loading ...</div>}
            <div className="scroll">
              <div className="scroll_inner">
                {this.state.results.map(index => (
                  <li
                    key={index.id}
                    className="pb-1 d-flex justify-content-between"
                  >
                    {index.name}
                    <Button
                      onClick={() => this.handlePath(index)}
                      color="warning"
                    >
                      View More
                    </Button>
                  </li>
                ))}
              </div>
            </div>
          </Col>
        </div>
      </div>
    );
  }
}

HomePage.propTypes = {
  history: PropTypes.shape({
    push: PropTypes.func,
  }),
};
