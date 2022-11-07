import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { Paper,Grid } from "@material-ui/core";
import { formatMessage, withModulesManager, TextAreaInput, FormattedMessage } from "@openimis/fe-core";
import { fetchHFBankAccountInfo } from "../actions"

const styles = (theme) => ({
    paper: theme.paper.body,
    paperHeader: theme.paper.header,
    paperHeaderTitle: theme.paper.title,
    paperHeaderAction: theme.paper.action,
    paperDivider: theme.paper.divider,
});


class HFBankAccountInfo extends Component {
    state = {
        lockNew: false,
        reset: 0,
        update: 0,
        healthFacility_uuid: null,
        bankAccountInfo: this._newBankAccountInfo(),
        newHealthFacility: true,
    };

    _newBankAccountInfo() {
        let bankAccount = {};
        return bankAccount;
      }

    componentDidMount() {
        if (this.props.edited_id) {
            this.props.fetchHFBankAccountInfo(
                this.props.modulesManager,
                this.props.edited_id,
            );
        }
        if (!!this.props.edited && !this.props.edited.mutationExtensions) {
            this.props.edited.mutationExtensions = {}
        }
        this.props.edited.mutationExtensions.bankAccountInfo = {}
    }

    updatemutationExtensions = (bankAccountAttribute, value) => {
        this.props.edited.mutationExtensions.bankAccountInfo[bankAccountAttribute] = value
        this.setState((state, props) => ({
            edited: this.props.edited}));
      };

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.fetchingBankAccountInfo && this.props.fetchedBankAccountInfo) {
            if (!this.props.edited.mutationExtensions) {
                this.props.edited.mutationExtensions = {}
            }
            this.props.edited.mutationExtensions.bankAccountInfo = !!this.props.bankAccountInfo ? this.props.bankAccountInfo : {}
            this.setState((state, props) => ({
                edited: this.props.edited}));
        }

        if (!prevProps.fetchedBankAccountInfo && this.props.fetchedBankAccountInfo) {
            this.props.edited.mutationExtensions.bankAccountInfo = !!this.props.bankAccountInfoResponse ? this.props.bankAccountInfoResponse : {};
            this.setState((state, props) => ({
                edited: this.props.edited}));
        }
      }

    render() {
        const { intl, classes, filters, onChangeFilters, edited, readOnly } = this.props;
        let account = this.props.edited.mutationExtensions?.bankAccountInfo;
        account = !!account ? account : {} 

        return (
                <Paper className={classes.paper}>
                    <Grid container>
                    <Grid item xs={12} className={classes.paperHeaderTitle}>
                        <FormattedMessage module={module} id={formatMessage(this.props.intl, "muse_payment_adaptor", "HFBankAccountInfo.header")} />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    <TextAreaInput
                        module="muse_payment_adaptor"
                        label="HFBankAccountInfo.bank_account"
                        value={account.bankAccount}
                        rows="2"
                        readOnly={readOnly}
                        onChange={(v, s) => this.updatemutationExtensions("bank_account", v)}
                    />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                        
                    <TextAreaInput
                        module="muse_payment_adaptor"
                        label="HFBankAccountInfo.bank_name"
                        value={account.bankName}
                        rows="2"
                        readOnly={readOnly}
                        onChange={(v, s) => this.updatemutationExtensions("bank_name", v)}
                    />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    <TextAreaInput
                        module="muse_payment_adaptor"
                        label="HFBankAccountInfo.account_name"
                        value={account.accountName}
                        rows="2"
                        readOnly={readOnly}
                        onChange={(v, s) => this.updatemutationExtensions("account_name", v)}
                    />
                    </Grid>
                    <Grid item xs={3} className={classes.item}>
                    <TextAreaInput
                        module="muse_payment_adaptor"
                        label="HFBankAccountInfo.bic"
                        value={account.bic}
                        rows="2"
                        readOnly={readOnly}
                        onChange={(v, s) => this.updatemutationExtensions("bic", v)}
                    />
                    </Grid>
                    </Grid>
                </Paper>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ fetchHFBankAccountInfo }, dispatch);
};

const mapStateToProps = (state, props) => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    userHealthFacilityFullPath: !!state.loc ? state.loc.userHealthFacilityFullPath : null,
    healthFacility: state.loc.healthFacility,
    fetchingHealthFacility: state.loc.fetchingHealthFacility,
    fetchedHealthFacility: state.loc.fetchedHealthFacility,
    errorHealthFacility: state.loc.errorHealthFacility,
    submittingMutation: state.loc.submittingMutation,
    mutation: state.loc.mutation,
    fetchingBankAccountInfo: state.muse_payment_adaptor.fetchingBankAccountInfo,
    fetchedBankAccountInfo: state.muse_payment_adaptor.fetchedBankAccountInfo,
    bankAccountInfoResponse: state.muse_payment_adaptor.bankAccountInfo,
    errorBankAccountInfo: state.muse_payment_adaptor.errorBankAccountInfo
});

export default withModulesManager(
    connect(mapStateToProps, mapDispatchToProps)(
        injectIntl(withTheme(withStyles(styles)(HFBankAccountInfo)))
    )
);
