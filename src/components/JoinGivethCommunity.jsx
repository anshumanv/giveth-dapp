import React, { Component } from 'react';
import PropTypes from 'prop-types';

import CommunityButton from './CommunityButton';
import User from '../models/User';
import { checkWalletBalance, isInWhitelist, takeActionAfterWalletUnlock } from '../lib/middleware';
import GivethWallet from '../lib/blockchain/GivethWallet';

/**
 * The join Giveth community top-bar
 */
class JoinGivethCommunity extends Component {
  constructor(props) {
    super(props);

    this.state = {
      canCreateCampaign: false,
      canCreateDAC: false,
    };

    this.createDAC = this.createDAC.bind(this);
    this.createCampaign = this.createCampaign.bind(this);
  }

  componentDidMount() {
    isInWhitelist(this.props.currentUser, React.whitelist.delegateWhitelist)
      .then(() => this.setState({ canCreateDAC: true }))
      .catch(() => {}); // nothing
    isInWhitelist(this.props.currentUser, React.whitelist.projectOwnerWhitelist)
      .then(() => this.setState({ canCreateCampaign: true }))
      .catch(() => {}); // nothing
  }

  createDAC() {
    isInWhitelist(this.props.currentUser, React.whitelist.delegateWhitelist)
      .then(() => {
        takeActionAfterWalletUnlock(this.props.wallet, () => {
          if (this.props.currentUser) {
            checkWalletBalance(this.props.wallet)
              .then(() => {
                this.props.history.push('/dacs/new');
              })
              .catch(err => {
                if (err === 'noBalance') {
                  // handle no balance error
                }
              });
          } else {
            React.swal({
              title: "You're almost there...",
              content: React.swal.msg(
                <p>
                  It&#8217;s great to see that you want to start a Decentralized Altruistic
                  Community, or DAC. To get started, please sign up (or sign in) first.
                </p>,
              ),
              icon: 'info',
              buttons: ['Cancel', 'Sign up now!'],
            }).then(isConfirmed => {
              if (isConfirmed) this.props.history.push('/signup');
            });
          }
        });
      })
      .catch(() => {
        React.swal({
          title: 'Sorry, Giveth is in beta...',
          content: React.swal.msg(
            <p>
              It&#8217;s great to see that you want to start a Decentralized Altruistic Community,
              or DAC! However, Giveth is still in alpha and we only allow a select group of people
              to start DACs
              <br />
              Please <strong>contact us on our Slack</strong>
              , or keep browsing
            </p>,
          ),
          icon: 'info',
          buttons: [false, 'Got it'],
        });
      });
  }

  createCampaign() {
    isInWhitelist(this.props.currentUser, React.whitelist.projectOwnerWhitelist)
      .then(() => {
        takeActionAfterWalletUnlock(this.props.wallet, () => {
          if (this.props.currentUser) {
            checkWalletBalance(this.props.wallet)
              .then(() => {
                this.props.history.push('/campaigns/new');
              })
              .catch(err => {
                if (err === 'noBalance') {
                  // handle no balance error
                }
              });
          } else {
            React.swal({
              title: "You're almost there...",
              content: React.swal.msg(
                <p>
                  It&#8217;s great to see that you want to start a campaign. To get started, please
                  sign up (or sign in) first.
                </p>,
              ),
              icon: 'info',
              buttons: ['Cancel', 'Sign up now!'],
            }).then(isConfirmed => {
              if (isConfirmed) this.props.history.push('/signup');
            });
          }
        });
      })
      .catch(() => {
        React.swal({
          title: 'Sorry, Giveth is in beta...',
          content: React.swal.msg(
            <p>
              It&#8217;s great to see that you want to start a campaign, however, Giveth is still in
              alpha and we only allow a select group of people to start campaigns
              <br />
              Please <strong>contact us on our Slack</strong>
              , or keep browsing
            </p>,
          ),
          icon: 'info',
          buttons: [false, 'Got it'],
        });
      });
  }

  render() {
    return (
      <div id="join-giveth-community">
        <div className="vertical-align">
          <center>
            <h3>Building the Future of Giving, with You.</h3>
            <CommunityButton className="btn btn-success" url="https://giveth.io/join">
              &nbsp;Join Giveth
            </CommunityButton>
            &nbsp;
            {this.state.canCreateDAC && (
              <button type="button" className="btn btn-info" onClick={() => this.createDAC()}>
                Create a Community
              </button>
            )}
            {this.state.canCreateCampaign && (
              <button type="button" className="btn btn-info" onClick={() => this.createCampaign()}>
                Start a Campaign
              </button>
            )}
          </center>
        </div>
      </div>
    );
  }
}

export default JoinGivethCommunity;

JoinGivethCommunity.propTypes = {
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired,
    push: PropTypes.func.isRequired,
  }).isRequired,
  currentUser: PropTypes.instanceOf(User),
  wallet: PropTypes.instanceOf(GivethWallet),
};

JoinGivethCommunity.defaultProps = {
  wallet: undefined,
  currentUser: undefined,
};
