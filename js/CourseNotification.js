/**
 * Utility to for handling generic functionality related to a course
 */
(function($, Core, undefined){

    var app = function($courseWrapper) {
        this.$courseWrapper = $courseWrapper;

        this.initialize();
    };

    $.extend(app.prototype, {
        $courseWrapper: null,

        selectors: {
            subscribeForm: '.js-notification-form',
            subscribeButton: 'button.js-load-on-save',
            subscribeToggleButton: '.js-subscribe-status-area button',
            subscribeStatusArea: '.js-subscribe-status-area',
            anonymousSubscriptionDialog: '#subscription-form-dialog',
        },

        initialize: function() {
            this.$courseWrapper.on('submit', this.selectors.subscribeForm, $.proxy(this._handleSubscribeSubmit, this));
            this.$courseWrapper.on('click', this.selectors.subscribeToggleButton, $.proxy(this._handleSubscribeClick, this));
            this.$courseWrapper.on('shown', this.selectors.anonymousSubscriptionDialog, $.proxy(this._handleDialogShown, this));
        },

        _handleSubscribeSubmit: function(e) {
            e.preventDefault();

            // make the button have a spinning animation
            this._findSubscribeButton().loadingAnimation();

            var $subscribeForm = $(e.currentTarget);

            var self = this;

            $.ajax({
                type: 'POST',
                url: $subscribeForm.attr('action'),
                data: $subscribeForm.serialize(),
                success: function(data) {
                    // hide the loading animation
                    self._findSubscribeButton().loadingAnimation('hide');

                    // close the dialog in case it's open
                    self._findAnonymousSubscriptionDialog().modal('hide');

                    self._updateSubscribeButton();
                },
                error: function() {
                    // hide the loading animation
                    self._findSubscribeButton().loadingAnimation('hide');

                    // todo - we should report some validation errors
                    // if the dialog box is open, let's paint the email red
                    var $email = self._findDialogEmailInput();
                    if ($email.is(':visible')) {
                        $email.css({
                            'border': '1px solid #ff6644'
                        });
                    }
                },
                dataType: 'json'
            });
        },

        /**
         * Handles click to subscribe or unsubscribe
         *
         * @param e
         * @private
         */
        _handleSubscribeClick: function(e) {
            if (Core.isUserAuthenticated()) {
                // just let the form submit - it will subscribe the current user
            } else {
                var $dialog = this._findAnonymousSubscriptionDialog();
                if ($dialog.is(':visible')) {
                    // let the form submit - they're probably hitting "enter" on the email box
                } else {
                    e.preventDefault();

                    // the user is not auth'ed, make the dialog popup
                    $dialog.modal();
                }
            }
        },

        /**
         * Called when the modal is shown - focuses the field
         *
         * @param e
         * @private
         */
        _handleDialogShown: function(e) {
            this._findDialogEmailInput().focus();
        },

        _findDialogEmailInput: function() {
            return this._findAnonymousSubscriptionDialog().find('.modal-body input');
        },

        /**
         * Makes sure the subscribe button has the right text and no loading screen
         *
         * @private
         */
        _updateSubscribeButton: function() {
            var $statusArea = this._findSubscribedStatusEl();
            // mark this area as subscribed
            $statusArea.addClass('status-subscribed');
        },

        _findSubscribeButton: function() {
            return this.$courseWrapper.find(this.selectors.subscribeButton);
        },

        _findAnonymousSubscriptionDialog: function() {
            return this.$courseWrapper.find(this.selectors.anonymousSubscriptionDialog)
        },

        _findSubscribedStatusEl: function() {
            return this.$courseWrapper.find(this.selectors.subscribeStatusArea);
        }
    });

    Core.CourseNotification = app;

})(jQuery, Core);