import React, { Component } from "react";
import { injectIntl } from "react-intl";
import { withTheme, withStyles } from "@material-ui/core/styles";
import { MenuItem, Tooltip} from "@material-ui/core";
import { formatMessage,formatMessageWithValues, withModulesManager, journalize } from "@openimis/fe-core";
import { sendMuseRequestPayment } from "./../actions"
import { connect } from "react-redux";
import { bindActionCreators } from "redux";

const styles = theme => ({
})

const RIGHT_BILL_PAYMENT_CREATE = 156202
const STATUS_VALIDATED = "1"

class SendMuseRequestPayment extends Component {
    _isMounted = false

    constructor(props) {
        super(props);
        this.state = {
            submitting: false,
            hidden: false
        }
    }
    
    componentDidUpdate(prevProps, prevState, snapshot) {
        if (prevProps.submittingMutation && !this.props.submittingMutation) {
            this.props.journalize(this.props.mutation);
        } 
    }

    componentDidMount() {
        this.state.submitting = (!!this.state.submittingMutation && !this.state.submittingMutation)
        
        if (this.state.submitting && !!this.props.mutation) {
            this.props.journalize(this.props.mutation)
        }        
    }


    _labelMutation = (selection, action) => {
        action(
            selection,
            formatMessageWithValues(
                this.props.intl,
                "muse_payment_adaptor",
                "PaymentRequest.mutationLabel",
                { code: selection[0].code }
            )
        );
    }
    
    requestPayment = selection => {   
        this._labelMutation(selection, this.props.sendMuseRequestPayment);
    }

    send_claims = (selection) => requestPayment(selection)

    call_action = (action) => {
        this.props.actionHandler(action)
    }

    render() {
        const { intl, actionHandler, selection, submittingMutation, journalizeHook, rights } = this.props;
        let entries = [];
        entries.push({ 
            text: formatMessage(intl, "muse_payment_adaptor", "muse_payment_adaptor.requestPayment"), 
            action: this.requestPayment 
        })
        entries = entries.map((i, idx) => (
            <Tooltip 
            disableHoverListener={selection.every( v => v.status === STATUS_VALIDATED)}
            title={formatMessage(intl, "muse_payment_adaptor", "muse_payment_adaptor.requestPayment.tooltip")}>
                <div><MenuItem 
                key={`selectionsMenu-claim_ai-${idx}`} 
                onClick={e => this.call_action(i.action)}
                disabled={!selection.every( v => v.status === STATUS_VALIDATED)}>
                {i.text}
                </MenuItem></div>
            </Tooltip>
        ))
        return (
            <div style={{ display: selection.length > 0 ? "block" : "none" }}>
                {rights.includes(RIGHT_BILL_PAYMENT_CREATE) && entries}
            </div>
        )
        
    }
}

const mapStateToProps = state => ({
    rights: !!state.core && !!state.core.user && !!state.core.user.i_user ? state.core.user.i_user.rights : [],
    state_main: state.muse_payment_adaptor,
    mutation: state.muse_payment_adaptor.mutation,
    submittingMutation: state.muse_payment_adaptor.submittingMutation,
    confirmed: state.core.confirmed,
});

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        { sendMuseRequestPayment, journalize },
        dispatch);
};

export default withModulesManager(connect(mapStateToProps, mapDispatchToProps)(
    injectIntl(withTheme(
        withStyles(styles)(SendMuseRequestPayment)
    ))));
