webpackJsonp([5],{0:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}var n=r(224),o=i(n),s=r(225),a=i(s),u=r(222),d=i(u);window.LoginForm=o["default"],window.RegisterForm=a["default"],window.CheckoutProcessor=d["default"]},185:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(17),o=i(n),s=r(99),a=i(s),u={reloadTopNav:function(){o["default"].ajax({method:"GET",url:a["default"].generate("_user_navigation")}).done(function(e){(0,o["default"])("#js-navbar").html(e)})}};t["default"]=u},222:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(17),o=i(n),s=r(99),a=i(s),u={sendCheckoutRequest:function(e,t,r){t.payment_type=e,r=r||"";var i=o["default"].param(t);r&&(i=r+"&"+i),o["default"].ajax({method:"POST",url:a["default"].generate("knp_university_checkout_handle"),data:i,success:function(e){e.targetUri?window.location=e.targetUri:console.error("Missing redirect",e)},error:function(t){var r=t.responseJSON;if(r.error)switch(e){case"stripe":StripePayment.showPaymentErrors(r.error),StripePayment._enableSubmitButton();break;case"braintree":showPaypalPaymentErrors(r.error),enablePaypalSubmitButton()}else console.error("Payment checkout failed",t)}})}};t["default"]=u},224:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(17),o=i(n),s=r(65),a=i(s),u=r(185),d=i(u),l=function(e,t){this.$loginFormWrapper=e,this.$successWrapper=t,this.initialize()};o["default"].extend(l.prototype,{$loginFormWrapper:null,$successWrapper:null,selectors:{loginForm:".js-login-form form"},initialize:function(){this.$loginFormWrapper.on("submit",this.selectors.loginForm,o["default"].proxy(this._handleFormSubmit,this))},submitForm:function(){return this._doFormSubmit()},_handleFormSubmit:function(e){e.preventDefault(),this._doFormSubmit()},_doFormSubmit:function(){var e=this._findLoginFormEl();return this._disableSubmitButton(),e.find(".form-group").removeClass("has-error"),o["default"].ajax({method:"POST",url:e.attr("action"),data:e.serialize(),dataType:"json"}).done(o["default"].proxy(this._handleSuccessfulFormResponse,this))},_handleSuccessfulFormResponse:function(e){if(this._enableSubmitButton(),e.authenticated){this.$loginFormWrapper.addClass("hidden"),this.$successWrapper.removeClass("hidden"),a["default"].setUserId(e.id);var t=e.firstName?e.firstName:"";this.$successWrapper.html('<p class="text-center"> Fancy seeing you here again '+t+"</p>"),this._reloadUserNavigation()}else{var r;e.error?e.error:"Unknown error";r="password"==e.error_field?this.$loginFormWrapper.find(".js-field-password"):this.$loginFormWrapper.find(".js-field-username");var i=r.closest(".form-group");i.find(".js-error-message-holder").html(e.error),i.addClass("has-error")}},_findLoginFormEl:function(){return this.$loginFormWrapper.find(this.selectors.loginForm)},_findSubmitButton:function(){return this._findLoginFormEl().find('[type="submit"]')},_reloadUserNavigation:function(){d["default"].reloadTopNav()},_disableSubmitButton:function(){this._findSubmitButton().loadingAnimation(),this._findSubmitButton().addClass("disabled")},_enableSubmitButton:function(){this._findSubmitButton().loadingAnimation("hide"),this._findSubmitButton().removeClass("disabled")}}),t["default"]=l},225:function(e,t,r){"use strict";function i(e){return e&&e.__esModule?e:{"default":e}}Object.defineProperty(t,"__esModule",{value:!0});var n=r(17),o=i(n),s=r(65),a=i(s),u=r(185),d=i(u),l=function(e,t){this.$registrationFormWrapper=e,this.$successWrapper=t,this.initialize()};o["default"].extend(l.prototype,{$registrationFormWrapper:null,$successWrapper:null,selectors:{registerForm:".js-register-form form"},initialize:function(){this.$registrationFormWrapper.on("submit",this.selectors.registerForm,o["default"].proxy(this._handleFormSubmit,this))},submitForm:function(){return this._doFormSubmit()},_handleFormSubmit:function(e){e.preventDefault(),this._doFormSubmit()},_doFormSubmit:function(){var e=this._findRegisterFormEl();return this._disableSubmitButton(),this.$registrationFormWrapper.find(this.selectors.errorEl).addClass("hidden"),o["default"].ajax({method:"POST",url:e.data("action"),data:e.serialize(),dataType:"json"}).done(o["default"].proxy(this._handleSuccessfulFormResponse,this))},_handleSuccessfulFormResponse:function(e){if(this._enableSubmitButton(),e.registered){this.$registrationFormWrapper.addClass("hidden"),this.$successWrapper.removeClass("hidden"),a["default"].setUserId(e.user.id);var t=e.user.firstName?e.user.firstName:"";this.$successWrapper.html('<p class="text-center">Woah, nice to meet you '+t+'!</p> <p class="text-center">If you ever have any questions or need a high five, <br> catch us in the tutorial comments.</p>'),this._reloadUserNavigation()}else{var r=e.formHtml;if(!r)return void this.$registrationFormWrapper.append("Ah, unknown error! Refresh and try again. So weird!");this._findRegisterFormEl().parent().html(r)}},_findRegisterFormEl:function(){return this.$registrationFormWrapper.find(this.selectors.registerForm)},_findSubmitButton:function(){return this._findRegisterFormEl().find('[type="submit"]')},_reloadUserNavigation:function(){d["default"].reloadTopNav()},_disableSubmitButton:function(){this._findSubmitButton().loadingAnimation(),this._findSubmitButton().addClass("disabled")},_enableSubmitButton:function(){this._findSubmitButton().loadingAnimation("hide"),this._findSubmitButton().removeClass("disabled")}}),t["default"]=l}});