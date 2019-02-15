import React from 'react';
import axios from 'axios';
import { Container } from 'reactstrap';
import PropTypes from 'prop-types';

const Remarkable = require('remarkable');

const md = new Remarkable();
class RepoDetail extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      lg: '',
      forkCount: 0,
      openIssuesCount: '',
      watchers: '',
      desc: '...',
    };
  }

  handleApi = () => {
    const { repo, userName } = this.props.match.params;
    axios.get(`https://api.github.com/repos/${userName}/${repo}`).then(res => {
      const lg = res.data.language;
      const forkCount = res.data.forks_count;
      const openIssuesCount = res.data.open_issues_count;
      const watchers = res.data.watchers_count;
      const desc = res.data.description;
      this.setState({
        lg,
        forkCount,
        openIssuesCount,
        watchers,
        desc,
      });
    });
    axios
      .get(
        `https://api.github.com/repos/${userName}/${repo}/contents/README.md`,
      )
      .then(res => {
        const a = atob(res.data.content);
        const test = md.render(a);
        document.querySelector('#readme').innerHTML = test;
      })
      .catch(() => {
        document.querySelector('#readme').innerHTML = '<p>No readme file</p>';
      });
  };

  newMethod() {
    return this.props.match.params;
  }

  componentWillMount() {
    this.handleApi();
  }

  render() {
    return (
      <Container className="mt-5">
        <div className="d-flex pb-2 mb-3 justify-content-between border-bottom">
          <p>
            <span className="text-warning">Language: </span>
            {this.state.lg}
          </p>
          <p>
            <span className="text-warning">Number of Forks: </span>
            {this.state.forkCount}
          </p>
          <p>
            <span className="text-warning">Number of Open Issues: </span>
            {this.state.openIssuesCount}
          </p>
          <p>
            <span className="text-warning">Viewed: </span>
            {this.state.watchers}
          </p>
          <p>
            <span className="text-warning">Description: </span>
            {this.state.desc}
          </p>
        </div>
        <div id="readme" />
      </Container>
    );
  }
}

RepoDetail.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      userName: PropTypes.string,
      repo: PropTypes.string,
    }),
  }),
};

export default RepoDetail;
